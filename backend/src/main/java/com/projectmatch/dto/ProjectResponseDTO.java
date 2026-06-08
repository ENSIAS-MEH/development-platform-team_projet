package com.projectmatch.dto;

import com.projectmatch.model.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String requiredSkills;
    private ProjectStatus status;
    private Long ownerId;
    private UserSummaryDTO owner;
    private List<UserSummaryDTO> teamMembers;
    private LocalDateTime createdAt;
}
