package com.projectmatch.service;

import com.projectmatch.dto.DtoMapper;
import com.projectmatch.dto.FormationDTO;
import com.projectmatch.dto.FormationResponseDTO;
import com.projectmatch.model.Formation;
import com.projectmatch.model.Role;
import com.projectmatch.model.User;
import com.projectmatch.repository.FormationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FormationService {

    private final FormationRepository formationRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;
    private final DtoMapper dtoMapper;

    @Transactional
    public FormationResponseDTO create(FormationDTO dto, MultipartFile pdf, String mentorEmail) {
        User mentor = userService.findByEmail(mentorEmail);

        String pdfFileName = fileStorageService.storeFormationPdf(pdf);

        Formation formation = Formation.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice() != null ? dto.getPrice() : 0.0)
                .duration(dto.getDuration())
                .level(dto.getLevel())
                .pdfFileName(pdfFileName)
                .mentor(mentor)
                .build();

        return dtoMapper.toFormationResponse(formationRepository.save(formation));
    }

    @Transactional(readOnly = true)
    public List<FormationResponseDTO> getAll() {
        return formationRepository.findAll().stream()
                .map(dtoMapper::toFormationResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FormationResponseDTO> getByMentorEmail(String mentorEmail) {
        User mentor = userService.findByEmail(mentorEmail);
        return formationRepository.findByMentorId(mentor.getId()).stream()
                .map(dtoMapper::toFormationResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FormationResponseDTO> getFree() {
        return formationRepository.findByPrice(0.0).stream()
                .map(dtoMapper::toFormationResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FormationResponseDTO> getByMentor(Long mentorId) {
        return formationRepository.findByMentorId(mentorId).stream()
                .map(dtoMapper::toFormationResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FormationResponseDTO findById(Long id) {
        Formation formation = formationRepository.findWithMentorById(id)
                .orElseThrow(() -> new RuntimeException("Formation not found"));
        return dtoMapper.toFormationResponse(formation);
    }

    @Transactional(readOnly = true)
    public Path getPdfPath(Long id) {
        Formation formation = formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation not found"));
        if (formation.getPdfFileName() == null) {
            throw new RuntimeException("This formation has no PDF");
        }
        return fileStorageService.resolveFormationPdf(formation.getPdfFileName());
    }

    @Transactional
    public FormationResponseDTO update(Long id, FormationDTO dto, MultipartFile pdf, String mentorEmail) {
        User mentor = userService.findByEmail(mentorEmail);
        Formation formation = formationRepository.findWithMentorById(id)
                .orElseThrow(() -> new RuntimeException("Formation not found"));
        assertMentor(formation, mentor);

        formation.setTitle(dto.getTitle());
        formation.setDescription(dto.getDescription());
        formation.setPrice(dto.getPrice() != null ? dto.getPrice() : 0.0);
        formation.setDuration(dto.getDuration());
        formation.setLevel(dto.getLevel());

        if (pdf != null && !pdf.isEmpty()) {
            fileStorageService.deleteFormationPdf(formation.getPdfFileName());
            formation.setPdfFileName(fileStorageService.storeFormationPdf(pdf));
        }

        return dtoMapper.toFormationResponse(formationRepository.save(formation));
    }

    @Transactional
    public void delete(Long id, String userEmail) {
        Formation formation = formationRepository.findWithMentorById(id)
                .orElseThrow(() -> new RuntimeException("Formation not found"));
        User user = userService.findByEmail(userEmail);
        if (user.getRole() != Role.ADMIN) {
            assertMentor(formation, user);
        }
        fileStorageService.deleteFormationPdf(formation.getPdfFileName());
        formationRepository.delete(formation);
    }

    private void assertMentor(Formation formation, User mentor) {
        if (!formation.getMentor().getId().equals(mentor.getId())) {
            throw new RuntimeException("Not authorized to modify this formation");
        }
    }
}
