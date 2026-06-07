package com.projectmatch.service;

import com.projectmatch.dto.UserDTO;
import com.projectmatch.model.User;
import com.projectmatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User updateProfile(Long id, UserDTO dto) {
        User user = findById(id);
        user.setName(dto.getName());
        user.setBio(dto.getBio());
        user.setSkills(dto.getSkills());
        if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setBio(user.getBio());
        dto.setSkills(user.getSkills());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }
}
