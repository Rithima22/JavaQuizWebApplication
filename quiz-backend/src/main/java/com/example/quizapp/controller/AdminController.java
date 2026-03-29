package com.example.quizapp.controller;

import com.example.quizapp.dto.RegisterRequest;
import com.example.quizapp.dto.UserResponse;
import com.example.quizapp.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // GET all users
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // GET users by role: /api/admin/users/role/TEACHER
    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(adminService.getUsersByRole(role));
    }

    // GET single user
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    // POST create user (teacher or student)
    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(adminService.createUser(request));
    }

    // PUT update user
    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id,
                                                    @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(adminService.updateUser(id, request));
    }

    // DELETE user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}