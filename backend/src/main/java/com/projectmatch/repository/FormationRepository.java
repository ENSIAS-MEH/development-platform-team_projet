package com.projectmatch.repository;

import com.projectmatch.model.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByMentorId(Long mentorId);
    List<Formation> findByPrice(Double price);
}
