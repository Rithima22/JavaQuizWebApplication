package com.example.quizapp.dto;

import com.example.quizapp.model.User;

public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String role;

    public UserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.role = user.getRole().name();
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}