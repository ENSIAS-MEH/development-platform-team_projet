package com.projectmatch.controller;

import com.projectmatch.dto.TeamResponseDTO;
import com.projectmatch.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<TeamResponseDTO> getTeamByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(teamService.findByProjectId(projectId));
    }

    @PostMapping("/project/{projectId}/join")
    public ResponseEntity<TeamResponseDTO> join(@PathVariable Long projectId,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teamService.joinTeam(projectId, userDetails.getUsername()));
    }

    @PostMapping("/project/{projectId}/leave")
    public ResponseEntity<TeamResponseDTO> leave(@PathVariable Long projectId,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teamService.leaveTeam(projectId, userDetails.getUsername()));
    }
}
