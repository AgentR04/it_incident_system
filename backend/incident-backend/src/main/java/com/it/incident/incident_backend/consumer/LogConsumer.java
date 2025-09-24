package com.it.incident.incident_backend.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.it.incident.incident_backend.model.Incident;
import com.it.incident.incident_backend.model.LogEvent;
import com.it.incident.incident_backend.service.IncidentService;
import com.it.incident.incident_backend.config.KafkaSettings;
import com.it.incident.incident_backend.monitoring.KafkaIngestionMetrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class LogConsumer {

    private final IncidentService incidentService;
    private final KafkaSettings kafkaSettings;
    private final KafkaIngestionMetrics metrics;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // simple in-memory dedupe cache: key -> epochMillis
    private final Map<String, Long> recentIncidents = new ConcurrentHashMap<>();

    @Value("${incident.auto-create-dedupe-window-ms:300000}") // 5 min
    private long dedupeWindowMs;

    private static final DateTimeFormatter TS_FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(ZoneId.systemDefault());

    @KafkaListener(topics = "${kafka.logs-topic:it-logs}", groupId = "${spring.kafka.consumer.group-id:incident-service}")
    public void onMessage(@Payload String message) {
        if (!kafkaSettings.getAutoCreateEnabled().get()) {
            log.debug("Auto-create from logs disabled. Skipping message.");
            return;
        }
        try {
            LogEvent event = parseMessage(message);
            if (event == null) return;

            // Only act on allowed source and ERROR/include-pattern
            if (!kafkaSettings.isSourceAllowed(event.getSource())) {
                metrics.incrementSkipped();
                return;
            }
            // Only act on ERROR or includePattern
            String level = (event.getLevel() == null ? "" : event.getLevel()).toUpperCase();
            boolean critical = "ERROR".equals(level)
                    || (event.getMessage() != null && kafkaSettings.getIncludePattern().matcher(event.getMessage()).find());
            if (!critical) return;

            // Dedupe recent similar incidents
            String key = dedupeKey(event);
            long now = System.currentTimeMillis();
            recentIncidents.entrySet().removeIf(e -> now - e.getValue() > dedupeWindowMs);
            Long last = recentIncidents.putIfAbsent(key, now);
            if (last != null && (now - last) < dedupeWindowMs) {
                log.info("Duplicate log within window; skipping incident creation");
                metrics.incrementDeduped();
                return;
            }

            // Create incident
            Incident incident = new Incident();
            incident.setTitle(buildTitle(event));
            incident.setDescription(buildDescription(event));
            incident.setStatus("OPEN");
            incident.setSeverity(mapSeverity(level));
            incidentService.createIncident(incident);
            log.info("Created incident from log event: {}", incident.getTitle());
            metrics.incrementCreated();
        } catch (Exception ex) {
            log.error("Failed processing log event: {}", message, ex);
            metrics.incrementFailed();
        }
    }

    private LogEvent parseMessage(String raw) {
        try {
            // Try JSON first
            return objectMapper.readValue(raw, LogEvent.class);
        } catch (Exception ignore) {
            // Fallback: parse plain text like "ERROR|source|message"
            try {
                String[] parts = raw.split("\\|", 3);
                if (parts.length >= 3) {
                    LogEvent e = new LogEvent();
                    e.setLevel(parts[0]);
                    e.setSource(parts[1]);
                    e.setMessage(parts[2]);
                    e.setTimestamp(System.currentTimeMillis());
                    return e;
                }
            } catch (Exception ignored) { }
            log.debug("Unrecognized log format: {}", raw);
            return null;
        }
    }

    private String buildTitle(LogEvent e) {
        String src = e.getSource() != null ? ("[" + e.getSource() + "] ") : "";
        String lvl = e.getLevel() != null ? e.getLevel().toUpperCase() : "ERROR";
        return src + lvl + ": " + safeTrim(e.getMessage(), 60);
    }

    private String buildDescription(LogEvent e) {
        String ts = e.getTimestamp() != null ? TS_FMT.format(Instant.ofEpochMilli(e.getTimestamp())) : TS_FMT.format(Instant.now());
        return "Detected critical log at " + ts + "\n"
                + "Level: " + e.getLevel() + "\n"
                + (e.getSource() != null ? ("Source: " + e.getSource() + "\n") : "")
                + "Message: " + e.getMessage();
    }

    private String mapSeverity(String level) {
        return switch (level) {
            case "ERROR", "FATAL", "SEVERE" -> "HIGH";
            case "WARN" -> "MEDIUM";
            default -> "LOW";
        };
    }

    private String dedupeKey(LogEvent e) {
        String payload = (e.getLevel() + "|" + e.getSource() + "|" + safeTrim(e.getMessage(), 200)).toLowerCase();
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] hash = md.digest(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception ex) {
            // Fallback: return payload itself (less ideal but avoids extra deps)
            return payload;
        }
    }

    private String safeTrim(String s, int max) {
        if (s == null) return "";
        return s.length() > max ? s.substring(0, max - 3) + "..." : s;
    }
}
