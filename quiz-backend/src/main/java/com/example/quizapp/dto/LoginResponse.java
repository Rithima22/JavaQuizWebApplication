package com.example.quizapp.dto;

public class LoginResponse {
    private String token;
    private String username;
    private String role;
    private String fullName;

    public LoginResponse(String token, String username, String role, String fullName) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.fullName = fullName;
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public String getFullName() { return fullName; }
}