package com.projectmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponseDTO {
    private Long id;
    private Long projectId;
    private List<UserSummaryDTO> members;
}
