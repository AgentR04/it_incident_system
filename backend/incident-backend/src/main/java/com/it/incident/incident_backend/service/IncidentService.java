package com.it.incident.incident_backend.service;

import com.it.incident.incident_backend.model.Incident;
import com.it.incident.incident_backend.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Optional<Incident> getIncidentById(Long id) {
        return incidentRepository.findById(id);
    }

    public Incident createIncident(Incident incident) {
        return incidentRepository.save(incident);
    }

    public Incident updateIncident(Long id, Incident incident) {
        return incidentRepository.findById(id).map(existing -> {
            existing.setTitle(incident.getTitle());
            existing.setDescription(incident.getDescription());
            existing.setStatus(incident.getStatus());
            existing.setSeverity(incident.getSeverity());
            existing.setUpdatedAt(incident.getUpdatedAt());
            return incidentRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Incident not found with id " + id));
    }

    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }

    // 🔍 Search logic
    public List<Incident> searchIncidents(String title, String status, String severity) {
        if (title != null && status != null && severity != null) {
            return incidentRepository.findByTitleContainingIgnoreCaseAndStatusIgnoreCaseAndSeverityIgnoreCase(
                    title, status, severity
            );
        } else if (title != null) {
            return incidentRepository.findByTitleContainingIgnoreCase(title);
        } else if (status != null) {
            return incidentRepository.findByStatusIgnoreCase(status);
        } else if (severity != null) {
            return incidentRepository.findBySeverityIgnoreCase(severity);
        } else {
            return incidentRepository.findAll();
        }
    }
}
