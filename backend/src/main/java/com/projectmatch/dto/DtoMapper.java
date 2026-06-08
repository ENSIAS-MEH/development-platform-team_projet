package com.projectmatch.dto;

import com.projectmatch.model.Formation;
import com.projectmatch.model.Project;
import com.projectmatch.model.Team;
import com.projectmatch.model.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DtoMapper {

    public UserSummaryDTO toUserSummary(User user) {
        if (user == null) {
            return null;
        }
        return UserSummaryDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public ProjectResponseDTO toProjectResponse(Project project) {
        return toProjectResponse(project, null);
    }

    public ProjectResponseDTO toProjectResponse(Project project, List<User> teamMembers) {
        User owner = project.getOwner();
        List<UserSummaryDTO> members = teamMembers == null
                ? null
                : teamMembers.stream().map(this::toUserSummary).toList();

        return ProjectResponseDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .requiredSkills(project.getRequiredSkills())
                .status(project.getStatus())
                .ownerId(owner != null ? owner.getId() : null)
                .owner(toUserSummary(owner))
                .teamMembers(members)
                .createdAt(project.getCreatedAt())
                .build();
    }

    public FormationResponseDTO toFormationResponse(Formation formation) {
        User mentor = formation.getMentor();
        String pdfUrl = formation.getPdfFileName() != null
                ? "/api/formations/" + formation.getId() + "/pdf"
                : null;

        return FormationResponseDTO.builder()
                .id(formation.getId())
                .title(formation.getTitle())
                .description(formation.getDescription())
                .price(formation.getPrice())
                .duration(formation.getDuration())
                .level(formation.getLevel())
                .mentorId(mentor != null ? mentor.getId() : null)
                .mentor(toUserSummary(mentor))
                .pdfUrl(pdfUrl)
                .createdAt(formation.getCreatedAt())
                .build();
    }

    public TeamResponseDTO toTeamResponse(Team team) {
        Long projectId = team.getProject() != null ? team.getProject().getId() : null;
        return TeamResponseDTO.builder()
                .id(team.getId())
                .projectId(projectId)
                .members(team.getMembers().stream().map(this::toUserSummary).toList())
                .build();
    }
}
