package com.projectmatch.controller;

import com.projectmatch.dto.ProjectDTO;
import com.projectmatch.dto.ProjectResponseDTO;
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
    public ResponseEntity<ProjectResponseDTO> create(@RequestBody ProjectDTO dto,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.create(dto, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponseDTO>> getAll() {
        return ResponseEntity.ok(projectService.getAll());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ProjectResponseDTO>> getMine(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.getByOwnerEmail(userDetails.getUsername()));
    }

    @GetMapping("/open")
    public ResponseEntity<List<ProjectResponseDTO>> getOpen() {
        return ResponseEntity.ok(projectService.getOpen());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProjectResponseDTO>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(projectService.search(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> update(@PathVariable Long id,
                                                       @RequestBody ProjectDTO dto,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.update(id, dto, userDetails.getUsername()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProjectResponseDTO> updateStatus(@PathVariable Long id,
                                                           @RequestParam String status,
                                                           @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.updateStatus(id, status, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        projectService.delete(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
