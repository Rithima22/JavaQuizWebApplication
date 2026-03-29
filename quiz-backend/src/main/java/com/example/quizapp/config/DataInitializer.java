package com.example.quizapp.config;

import com.example.quizapp.model.User;
import com.example.quizapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:Admin@1234}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByUsername(adminUsername)) {
            System.out.println("Admin already exists, skipping seed.");
            return;
        }

        User admin = new User();
        admin.setUsername(adminUsername);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole(User.Role.ADMIN);
        admin.setFullName("System Administrator");

        userRepository.save(admin);
        System.out.println("✅ Admin account created: " + adminUsername);
    }
}