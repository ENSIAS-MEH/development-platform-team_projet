package com.projectmatch.repository;

import com.projectmatch.model.Formation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {

    @EntityGraph(attributePaths = {"mentor"})
    @Override
    List<Formation> findAll();

    @EntityGraph(attributePaths = {"mentor"})
    List<Formation> findByMentorId(Long mentorId);

    @EntityGraph(attributePaths = {"mentor"})
    List<Formation> findByPrice(Double price);

    @EntityGraph(attributePaths = {"mentor"})
    Optional<Formation> findWithMentorById(Long id);
}
