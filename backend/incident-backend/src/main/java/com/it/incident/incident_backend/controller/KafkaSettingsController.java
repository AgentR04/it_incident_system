package com.it.incident.incident_backend.controller;

import com.it.incident.incident_backend.config.KafkaSettings;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/kafka")
@RequiredArgsConstructor
public class KafkaSettingsController {

    private final KafkaSettings settings;

    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of(
                "autoCreateEnabled", settings.getAutoCreateEnabled().get(),
                "dedupeWindowMs", settings.getDedupeWindowMs(),
                "allowedSources", settings.getAllowedSourcesProp(),
                "includePattern", settings.getIncludePatternString()
        );
    }

    @PostMapping("/ingestion/enable")
    public ResponseEntity<?> enable() {
        settings.getAutoCreateEnabled().set(true);
        return ResponseEntity.ok(Map.of("autoCreateEnabled", true));
    }

    @PostMapping("/ingestion/disable")
    public ResponseEntity<?> disable() {
        settings.getAutoCreateEnabled().set(false);
        return ResponseEntity.ok(Map.of("autoCreateEnabled", false));
    }
}
