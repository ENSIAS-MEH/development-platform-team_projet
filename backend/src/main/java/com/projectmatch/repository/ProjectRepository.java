package com.projectmatch.repository;

import com.projectmatch.model.Project;
import com.projectmatch.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByOwnerId(Long ownerId);
    List<Project> findByTitleContainingIgnoreCase(String keyword);
}
