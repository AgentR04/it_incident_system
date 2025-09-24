package com.it.incident.incident_backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.regex.Pattern;

@Component
@Getter
@Setter
public class KafkaSettings {

    private final AtomicBoolean autoCreateEnabled;

    @Value("${incident.auto-create-dedupe-window-ms:300000}")
    private long dedupeWindowMs;

    @Value("${incident.message-include-pattern:(Exception|CRITICAL|FATAL|SEVERE)}")
    private String includePatternString;

    @Value("${incident.allowed-sources:*}")
    private String allowedSourcesProp;

    private Pattern includePattern;

    public KafkaSettings(@Value("${incident.auto-create-from-logs:true}") boolean enabled) {
        this.autoCreateEnabled = new AtomicBoolean(enabled);
    }

    @PostConstruct
    public void init() {
        this.includePattern = Pattern.compile(includePatternString);
    }

    public boolean isSourceAllowed(String source) {
        List<String> allowed = Arrays.stream(allowedSourcesProp.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        if (allowed.contains("*")) return true;
        if (source == null) return false;
        return allowed.contains(source);
    }
}
