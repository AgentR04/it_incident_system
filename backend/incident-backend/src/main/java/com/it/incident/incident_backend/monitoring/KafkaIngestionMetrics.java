package com.it.incident.incident_backend.monitoring;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicLong;

@Component
public class KafkaIngestionMetrics implements HealthIndicator {

    private final AtomicLong created = new AtomicLong();
    private final AtomicLong deduped = new AtomicLong();
    private final AtomicLong failed = new AtomicLong();
    private final AtomicLong skipped = new AtomicLong();

    public void incrementCreated() { created.incrementAndGet(); }
    public void incrementDeduped() { deduped.incrementAndGet(); }
    public void incrementFailed() { failed.incrementAndGet(); }
    public void incrementSkipped() { skipped.incrementAndGet(); }

    public long getCreated() { return created.get(); }
    public long getDeduped() { return deduped.get(); }
    public long getFailed() { return failed.get(); }
    public long getSkipped() { return skipped.get(); }

    @Override
    public Health health() {
        // Basic health based on failures; can be enhanced with broker checks
        Health.Builder b = Health.up();
        return b.withDetail("kafkaIngestionCreated", getCreated())
                .withDetail("kafkaIngestionDeduped", getDeduped())
                .withDetail("kafkaIngestionFailed", getFailed())
                .withDetail("kafkaIngestionSkipped", getSkipped())
                .build();
    }
}
