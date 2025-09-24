package com.it.incident.incident_backend.repository;

import com.it.incident.incident_backend.model.Incident;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class IncidentSpecification {

    public Specification<Incident> hasTitle(String title) {
        return (root, query, criteriaBuilder) ->
                title == null ? criteriaBuilder.conjunction() :
                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    public Specification<Incident> hasStatus(String status) {
        return (root, query, criteriaBuilder) ->
                status == null ? criteriaBuilder.conjunction() :
                criteriaBuilder.equal(criteriaBuilder.lower(root.get("status")), status.toLowerCase());
    }

    public Specification<Incident> hasSeverity(String severity) {
        return (root, query, criteriaBuilder) ->
                severity == null ? criteriaBuilder.conjunction() :
                criteriaBuilder.equal(criteriaBuilder.lower(root.get("severity")), severity.toLowerCase());
    }
}
