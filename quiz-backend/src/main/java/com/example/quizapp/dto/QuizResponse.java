package com.example.quizapp.dto;

import com.example.quizapp.model.Quiz;
import com.example.quizapp.model.QuizQuestion;

import java.util.List;
import java.util.stream.Collectors;

public class QuizResponse {
    private Long id;
    private String title;
    private String startTime;
    private String endTime;
    private Integer durationMinutes;
    private String teacherUsername;
    private List<QuestionResponse> questions;

    public QuizResponse(Quiz quiz, String teacherUsername, List<QuizQuestion> quizQuestions) {
        this.id = quiz.getId();
        this.title = quiz.getTitle();
        this.startTime = quiz.getStartTime().toString();
        this.endTime = quiz.getEndTime().toString();
        this.durationMinutes = quiz.getDurationMinutes();
        this.teacherUsername = teacherUsername;
        this.questions = quizQuestions
                .stream()
                .map(qq -> new QuestionResponse(qq.getQuestion(), teacherUsername))
                .collect(Collectors.toList());
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public String getTeacherUsername() { return teacherUsername; }
    public List<QuestionResponse> getQuestions() { return questions; }
}