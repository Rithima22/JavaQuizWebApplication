package com.example.quizapp.controller;

import com.example.quizapp.dto.*;
import com.example.quizapp.model.QuizAttempt;
import com.example.quizapp.service.TeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.example.quizapp.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    private final TeacherService teacherService;
    private final UserRepository userRepository;

    public TeacherController(TeacherService teacherService, UserRepository userRepository) {
        this.teacherService = teacherService;
        this.userRepository = userRepository;
    }

    // ── Questions ─────────────────────────────────────────────────────────────

    @PostMapping("/questions")
    public ResponseEntity<QuestionResponse> createQuestion(
            @RequestBody QuestionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teacherService.createQuestion(request, userDetails.getUsername()));
    }

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionResponse>> getMyQuestions(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teacherService.getMyQuestions(userDetails.getUsername()));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable Long id,
            @RequestBody QuestionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teacherService.updateQuestion(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<String> deleteQuestion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        teacherService.deleteQuestion(id, userDetails.getUsername());
        return ResponseEntity.ok("Question deleted successfully");
    }

    // ── Quizzes ───────────────────────────────────────────────────────────────

    @PostMapping("/quizzes")
    public ResponseEntity<QuizResponse> createQuiz(
            @RequestBody QuizRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teacherService.createQuiz(request, userDetails.getUsername()));
    }

    @GetMapping("/quizzes")
    public ResponseEntity<List<QuizResponse>> getMyQuizzes(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teacherService.getMyQuizzes(userDetails.getUsername()));
    }

    @PutMapping("/quizzes/{id}")
    public ResponseEntity<QuizResponse> updateQuiz(
            @PathVariable Long id,
            @RequestBody QuizRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teacherService.updateQuiz(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/quizzes/{id}")
    public ResponseEntity<String> deleteQuiz(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        teacherService.deleteQuiz(id, userDetails.getUsername());
        return ResponseEntity.ok("Quiz deleted successfully");
    }

    // ── Stats ─────────────────────────────────────────────────────────────────

    @GetMapping("/quizzes/{id}/stats")
    public ResponseEntity<List<Map<String, Object>>> getQuizStats(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<QuizAttempt> attempts = teacherService.getQuizStats(id, userDetails.getUsername());
        List<Map<String, Object>> stats = new java.util.ArrayList<>();
        for (QuizAttempt a : attempts) {
            Map<String, Object> map = new java.util.HashMap<>();
            // fetch student directly from DB to avoid lazy loading
            String studentName = userRepository.findById(a.getStudent().getId())
                    .map(u -> u.getUsername()).orElse("Unknown");
            map.put("student", studentName);
            map.put("score", a.getScore());
            map.put("totalQuestions", a.getTotalQuestions());
            map.put("submitTime", a.getSubmitTime() != null ? a.getSubmitTime().toString() : null);
            map.put("submitted", a.getSubmitted());
            stats.add(map);
        }
        return ResponseEntity.ok(stats);
    }

    // ── Students ──────────────────────────────────────────────────────────────

    @GetMapping("/students")
    public ResponseEntity<List<UserResponse>> getAllStudents() {
        return ResponseEntity.ok(teacherService.getAllStudents());
    }
}