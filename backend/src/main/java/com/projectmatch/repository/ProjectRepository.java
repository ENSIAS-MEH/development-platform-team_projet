package com.projectmatch.repository;

import com.projectmatch.model.Project;
import com.projectmatch.model.ProjectStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @EntityGraph(attributePaths = {"owner"})
    @Override
    List<Project> findAll();

    @EntityGraph(attributePaths = {"owner"})
    List<Project> findByStatus(ProjectStatus status);

    @EntityGraph(attributePaths = {"owner"})
    List<Project> findByOwnerId(Long ownerId);

    @EntityGraph(attributePaths = {"owner"})
    List<Project> findByTitleContainingIgnoreCase(String keyword);

    @EntityGraph(attributePaths = {"owner"})
    Optional<Project> findWithOwnerById(Long id);
}
