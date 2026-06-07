package com.projectmatch.service;

import com.projectmatch.dto.ProjectDTO;
import com.projectmatch.model.Project;
import com.projectmatch.model.ProjectStatus;
import com.projectmatch.model.Team;
import com.projectmatch.model.User;
import com.projectmatch.repository.ProjectRepository;
import com.projectmatch.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final UserService userService;

    public Project create(ProjectDTO dto, String ownerEmail) {
        User owner = userService.findByEmail(ownerEmail);

        Project project = Project.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .requiredSkills(dto.getRequiredSkills())
                .status(ProjectStatus.OPEN)
                .owner(owner)
                .build();

        project = projectRepository.save(project);

        // Auto-create team for the project
        Team team = Team.builder()
                .name(dto.getTitle() + " Team")
                .project(project)
                .build();
        team.getMembers().add(owner);
        teamRepository.save(team);

        return project;
    }

    public List<Project> getAll() {
        return projectRepository.findAll();
    }

    public List<Project> getOpen() {
        return projectRepository.findByStatus(ProjectStatus.OPEN);
    }

    public List<Project> search(String keyword) {
        return projectRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Project updateStatus(Long id, String status) {
        Project project = findById(id);
        project.setStatus(ProjectStatus.valueOf(status.toUpperCase()));
        return projectRepository.save(project);
    }

    public void delete(Long id) {
        projectRepository.deleteById(id);
    }
}
