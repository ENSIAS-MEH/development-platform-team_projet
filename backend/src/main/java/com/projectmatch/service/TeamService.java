package com.projectmatch.service;

import com.projectmatch.dto.DtoMapper;
import com.projectmatch.dto.TeamResponseDTO;
import com.projectmatch.model.Team;
import com.projectmatch.model.User;
import com.projectmatch.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserService userService;
    private final DtoMapper dtoMapper;

    @Transactional(readOnly = true)
    public TeamResponseDTO findByProjectId(Long projectId) {
        Team team = teamRepository.findWithMembersByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Team not found for project: " + projectId));
        return dtoMapper.toTeamResponse(team);
    }

    @Transactional
    public TeamResponseDTO joinTeam(Long projectId, String userEmail) {
        Team team = teamRepository.findWithMembersByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Team not found for project: " + projectId));
        User user = userService.findByEmail(userEmail);

        boolean alreadyMember = team.getMembers().stream()
                .anyMatch(m -> m.getId().equals(user.getId()));

        if (alreadyMember) {
            throw new RuntimeException("User already in this team");
        }

        team.getMembers().add(user);
        return dtoMapper.toTeamResponse(teamRepository.save(team));
    }

    @Transactional
    public TeamResponseDTO leaveTeam(Long projectId, String userEmail) {
        Team team = teamRepository.findWithMembersByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Team not found for project: " + projectId));
        User user = userService.findByEmail(userEmail);
        team.getMembers().removeIf(m -> m.getId().equals(user.getId()));
        return dtoMapper.toTeamResponse(teamRepository.save(team));
    }
}
