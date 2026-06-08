package com.projectmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormationResponseDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String duration;
    private String level;
    private Long mentorId;
    private UserSummaryDTO mentor;
    private String pdfUrl;
    private LocalDateTime createdAt;
}
