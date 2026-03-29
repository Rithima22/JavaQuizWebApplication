package com.example.quizapp.service;

import com.example.quizapp.dto.RegisterRequest;
import com.example.quizapp.dto.UserResponse;
import com.example.quizapp.exception.BadRequestException;
import com.example.quizapp.exception.ResourceNotFoundException;
import com.example.quizapp.model.User;
import com.example.quizapp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getUsersByRole(String role) {
        User.Role userRole;
        try {
            userRole = User.Role.valueOf(role.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid role: " + role);
        }
        return userRepository.findAllByRole(userRole)
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new UserResponse(user);
    }

    public UserResponse createUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken: " + request.getUsername());
        }
        User.Role role;
        try {
            role = User.Role.valueOf(request.getRole().toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid role. Must be ADMIN, TEACHER, or STUDENT");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        userRepository.save(user);
        return new UserResponse(user);
    }

    public UserResponse updateUser(Long id, RegisterRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (!user.getUsername().equals(request.getUsername()) &&
                userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken: " + request.getUsername());
        }

        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
            } catch (Exception e) {
                throw new BadRequestException("Invalid role: " + request.getRole());
            }
        }
        userRepository.save(user);
        return new UserResponse(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}