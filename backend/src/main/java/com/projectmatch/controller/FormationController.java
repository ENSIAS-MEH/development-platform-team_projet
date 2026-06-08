package com.projectmatch.controller;

import com.projectmatch.dto.FormationDTO;
import com.projectmatch.dto.FormationResponseDTO;
import com.projectmatch.service.FormationService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/formations")
@RequiredArgsConstructor
public class FormationController {

    private final FormationService formationService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<FormationResponseDTO> create(
            @RequestPart("formation") FormationDTO dto,
            @RequestPart("pdf") MultipartFile pdf,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(formationService.create(dto, pdf, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<FormationResponseDTO>> getAll() {
        return ResponseEntity.ok(formationService.getAll());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<FormationResponseDTO>> getMine(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(formationService.getByMentorEmail(userDetails.getUsername()));
    }

    @GetMapping("/free")
    public ResponseEntity<List<FormationResponseDTO>> getFree() {
        return ResponseEntity.ok(formationService.getFree());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormationResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(formationService.findById(id));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<Resource> getPdf(@PathVariable Long id) throws Exception {
        Path file = formationService.getPdfPath(id);
        Resource resource = new UrlResource(file.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"formation-" + id + ".pdf\"")
                .body(resource);
    }

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<FormationResponseDTO>> getByMentor(@PathVariable Long mentorId) {
        return ResponseEntity.ok(formationService.getByMentor(mentorId));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<FormationResponseDTO> update(
            @PathVariable Long id,
            @RequestPart("formation") FormationDTO dto,
            @RequestPart(value = "pdf", required = false) MultipartFile pdf,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(formationService.update(id, dto, pdf, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MENTOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        formationService.delete(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
