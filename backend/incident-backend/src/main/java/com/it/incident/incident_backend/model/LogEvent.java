package com.it.incident.incident_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogEvent {
    private String level;      // e.g. INFO, WARN, ERROR
    private String message;    // message content
    private String source;     // optional: service/source name
    private Long timestamp;    // epoch millis
}
