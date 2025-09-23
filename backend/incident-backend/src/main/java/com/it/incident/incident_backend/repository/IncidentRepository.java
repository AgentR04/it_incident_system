package com.it.incident.incident_backend.repository;

import com.it.incident.incident_backend.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    // Spring Data JPA will auto-generate queries from method names
    List<Incident> findByTitleContainingIgnoreCase(String title);

    List<Incident> findByStatusIgnoreCase(String status);

    List<Incident> findBySeverityIgnoreCase(String severity);

    List<Incident> findByTitleContainingIgnoreCaseAndStatusIgnoreCaseAndSeverityIgnoreCase(
            String title, String status, String severity
    );
}
