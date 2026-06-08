package com.projectmatch.service;

import com.projectmatch.dto.DtoMapper;
import com.projectmatch.dto.ProjectDTO;
import com.projectmatch.dto.ProjectResponseDTO;
import com.projectmatch.model.Project;
import com.projectmatch.model.ProjectStatus;
import com.projectmatch.model.Team;
import com.projectmatch.model.User;
import com.projectmatch.repository.ProjectRepository;
import com.projectmatch.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final UserService userService;
    private final DtoMapper dtoMapper;

    @Transactional
    public ProjectResponseDTO create(ProjectDTO dto, String ownerEmail) {
        User owner = userService.findByEmail(ownerEmail);

        Project project = Project.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .requiredSkills(dto.getRequiredSkills())
                .status(ProjectStatus.OPEN)
                .owner(owner)
                .build();

        project = projectRepository.save(project);

        Team team = Team.builder()
                .name(dto.getTitle() + " Team")
                .project(project)
                .build();
        team.getMembers().add(owner);
        teamRepository.save(team);

        return dtoMapper.toProjectResponse(project, team.getMembers());
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getAll() {
        return projectRepository.findAll().stream()
                .map(dtoMapper::toProjectResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getByOwnerEmail(String ownerEmail) {
        User owner = userService.findByEmail(ownerEmail);
        return projectRepository.findByOwnerId(owner.getId()).stream()
                .map(dtoMapper::toProjectResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getOpen() {
        return projectRepository.findByStatus(ProjectStatus.OPEN).stream()
                .map(dtoMapper::toProjectResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> search(String keyword) {
        return projectRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(dtoMapper::toProjectResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponseDTO findById(Long id) {
        Project project = projectRepository.findWithOwnerById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return dtoMapper.toProjectResponse(project);
    }

    @Transactional(readOnly = true)
    public ProjectResponseDTO findByIdWithTeam(Long id) {
        Project project = projectRepository.findWithOwnerById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<User> members = teamRepository.findWithMembersByProjectId(id)
                .map(Team::getMembers)
                .orElse(List.of());

        return dtoMapper.toProjectResponse(project, members);
    }

    @Transactional
    public ProjectResponseDTO update(Long id, ProjectDTO dto, String ownerEmail) {
        User owner = userService.findByEmail(ownerEmail);
        Project project = projectRepository.findWithOwnerById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        assertOwner(project, owner);

        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setRequiredSkills(dto.getRequiredSkills());
        return dtoMapper.toProjectResponse(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponseDTO updateStatus(Long id, String status, String ownerEmail) {
        User owner = userService.findByEmail(ownerEmail);
        Project project = projectRepository.findWithOwnerById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        assertOwner(project, owner);
        project.setStatus(ProjectStatus.valueOf(status.toUpperCase()));
        return dtoMapper.toProjectResponse(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long id, String ownerEmail) {
        User owner = userService.findByEmail(ownerEmail);
        Project project = projectRepository.findWithOwnerById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        assertOwner(project, owner);
        projectRepository.delete(project);
    }

    private void assertOwner(Project project, User owner) {
        if (!project.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized to modify this project");
        }
    }
}
