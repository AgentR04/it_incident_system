
package com.it.incident.incident_backend.service;

import com.it.incident.incident_backend.exception.ResourceNotFoundException;
import com.it.incident.incident_backend.model.Incident;
import com.it.incident.incident_backend.repository.IncidentRepository;
import com.it.incident.incident_backend.repository.IncidentSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentSpecification incidentSpecification;
    private final NotificationService notificationService;

    public IncidentService(IncidentRepository incidentRepository, IncidentSpecification incidentSpecification, NotificationService notificationService) {
        this.incidentRepository = incidentRepository;
        this.incidentSpecification = incidentSpecification;
        this.notificationService = notificationService;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Optional<Incident> getIncidentById(Long id) {
        return incidentRepository.findById(id);
    }

    public Incident createIncident(Incident incident) {
        Incident newIncident = incidentRepository.save(incident);
        notificationService.sendIncidentUpdate();
        return newIncident;
    }

    public Incident updateIncident(Long id, Incident incidentDetails) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));

        incident.setTitle(incidentDetails.getTitle());
        incident.setDescription(incidentDetails.getDescription());
        incident.setStatus(incidentDetails.getStatus());
        incident.setSeverity(incidentDetails.getSeverity());

        Incident updatedIncident = incidentRepository.save(incident);
        notificationService.sendIncidentUpdate();
        return updatedIncident;
    }

    public void deleteIncident(Long id) {
        if (!incidentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Incident not found with id: " + id);
        }
        incidentRepository.deleteById(id);
        notificationService.sendIncidentUpdate();
    }

    public List<Incident> searchIncidents(String title, String status, String severity) {
        Specification<Incident> spec = Specification.where(incidentSpecification.hasTitle(title))
                .and(incidentSpecification.hasStatus(status))
                .and(incidentSpecification.hasSeverity(severity));
        return incidentRepository.findAll(spec);
    }
}
