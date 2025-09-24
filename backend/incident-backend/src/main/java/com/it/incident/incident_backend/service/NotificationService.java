package com.it.incident.incident_backend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendIncidentUpdate() {
        // Send a simple message to the /topic/incidents destination
        // The frontend will subscribe to this topic to receive live updates
        messagingTemplate.convertAndSend("/topic/incidents", "update");
    }
}
