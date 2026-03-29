package com.example.quizapp.service;

import com.example.quizapp.dto.LoginRequest;
import com.example.quizapp.dto.LoginResponse;
import com.example.quizapp.dto.RegisterRequest;
import com.example.quizapp.dto.UserResponse;
import com.example.quizapp.exception.BadRequestException;
import com.example.quizapp.model.User;
import com.example.quizapp.repository.UserRepository;
import com.example.quizapp.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return new LoginResponse(token, user.getUsername(),
                user.getRole().name(), user.getFullName());
    }

    public UserResponse register(RegisterRequest request) {
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
}