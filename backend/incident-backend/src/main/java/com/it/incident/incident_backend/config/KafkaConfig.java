package com.it.incident.incident_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;

/**
 * Kafka configuration entry point. We rely on Spring Boot auto-config for
 * ConsumerFactory/ListenerContainerFactory via spring.kafka.* properties.
 */
@Configuration
@EnableKafka
public class KafkaConfig {
}
