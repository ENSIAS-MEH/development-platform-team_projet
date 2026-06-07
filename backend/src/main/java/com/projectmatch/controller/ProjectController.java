package com.projectmatch.controller;

import com.projectmatch.dto.ProjectDTO;
import com.projectmatch.model.Project;
import com.projectmatch.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<Project> create(@RequestBody ProjectDTO dto,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.create(dto, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAll() {
        return ResponseEntity.ok(projectService.getAll());
    }

    @GetMapping("/open")
    public ResponseEntity<List<Project>> getOpen() {
        return ResponseEntity.ok(projectService.getOpen());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Project>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(projectService.search(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.findById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Project> updateStatus(@PathVariable Long id,
                                                 @RequestParam String status) {
        return ResponseEntity.ok(projectService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
