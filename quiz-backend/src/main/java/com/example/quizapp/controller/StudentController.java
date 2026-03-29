package com.example.quizapp.controller;

import com.example.quizapp.dto.*;
import com.example.quizapp.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Dashboard — all quizzes with UPCOMING/ACTIVE/ENDED status
    @GetMapping("/quizzes")
    public ResponseEntity<List<StudentQuizView>> getAllQuizzes(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                studentService.getAllQuizzesForStudent(userDetails.getUsername()));
    }

    // Start a quiz — returns questions without correct answers
    @PostMapping("/quizzes/{quizId}/start")
    public ResponseEntity<QuizTakeResponse> startQuiz(
            @PathVariable Long quizId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                studentService.startQuiz(quizId, userDetails.getUsername()));
    }

    // Submit answers
    @PostMapping("/quizzes/{quizId}/submit")
    public ResponseEntity<QuizAttemptResponse> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody SubmitAnswerRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                studentService.submitQuiz(quizId, request, userDetails.getUsername()));
    }

    // All my results
    @GetMapping("/results")
    public ResponseEntity<List<QuizAttemptResponse>> getMyResults(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                studentService.getMyResults(userDetails.getUsername()));
    }

    // Single quiz result
    @GetMapping("/quizzes/{quizId}/result")
    public ResponseEntity<QuizAttemptResponse> getResult(
            @PathVariable Long quizId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                studentService.getResult(quizId, userDetails.getUsername()));
    }
}