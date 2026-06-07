package com.projectmatch.service;

import com.projectmatch.model.Team;
import com.projectmatch.model.User;
import com.projectmatch.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserService userService;

    public Team findByProjectId(Long projectId) {
        return teamRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Team not found for project: " + projectId));
    }

    public Team joinTeam(Long projectId, String userEmail) {
        Team team = findByProjectId(projectId);
        User user = userService.findByEmail(userEmail);

        boolean alreadyMember = team.getMembers().stream()
                .anyMatch(m -> m.getId().equals(user.getId()));

        if (alreadyMember) {
            throw new RuntimeException("User already in this team");
        }

        team.getMembers().add(user);
        return teamRepository.save(team);
    }

    public Team leaveTeam(Long projectId, String userEmail) {
        Team team = findByProjectId(projectId);
        User user = userService.findByEmail(userEmail);
        team.getMembers().removeIf(m -> m.getId().equals(user.getId()));
        return teamRepository.save(team);
    }

    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }
}
