package com.projectmatch.controller;

import com.projectmatch.dto.FormationDTO;
import com.projectmatch.model.Formation;
import com.projectmatch.service.FormationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
@RequiredArgsConstructor
public class FormationController {

    private final FormationService formationService;

    @PostMapping
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<Formation> create(@RequestBody FormationDTO dto,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(formationService.create(dto, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Formation>> getAll() {
        return ResponseEntity.ok(formationService.getAll());
    }

    @GetMapping("/free")
    public ResponseEntity<List<Formation>> getFree() {
        return ResponseEntity.ok(formationService.getFree());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formation> getById(@PathVariable Long id) {
        return ResponseEntity.ok(formationService.findById(id));
    }

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<Formation>> getByMentor(@PathVariable Long mentorId) {
        return ResponseEntity.ok(formationService.getByMentor(mentorId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MENTOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        formationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
