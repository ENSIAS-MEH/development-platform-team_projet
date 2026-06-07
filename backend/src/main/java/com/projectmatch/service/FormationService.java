package com.projectmatch.service;

import com.projectmatch.dto.FormationDTO;
import com.projectmatch.model.Formation;
import com.projectmatch.model.User;
import com.projectmatch.repository.FormationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FormationService {

    private final FormationRepository formationRepository;
    private final UserService userService;

    public Formation create(FormationDTO dto, String mentorEmail) {
        User mentor = userService.findByEmail(mentorEmail);

        Formation formation = Formation.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice() != null ? dto.getPrice() : 0.0)
                .duration(dto.getDuration())
                .level(dto.getLevel())
                .mentor(mentor)
                .build();

        return formationRepository.save(formation);
    }

    public List<Formation> getAll() {
        return formationRepository.findAll();
    }

    public List<Formation> getFree() {
        return formationRepository.findByPrice(0.0);
    }

    public List<Formation> getByMentor(Long mentorId) {
        return formationRepository.findByMentorId(mentorId);
    }

    public Formation findById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation not found"));
    }

    public void delete(Long id) {
        formationRepository.deleteById(id);
    }
}
