package com.example.quizapp.dto;

import com.example.quizapp.model.QuizAttempt;

public class QuizAttemptResponse {
    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private Integer score;
    private Integer totalQuestions;
    private String startTime;
    private String submitTime;
    private Boolean submitted;

    public QuizAttemptResponse(QuizAttempt a, String quizTitle) {
        this.attemptId = a.getId();
        this.quizId = a.getQuiz().getId();
        this.quizTitle = quizTitle;
        this.score = a.getScore();
        this.totalQuestions = a.getTotalQuestions();
        this.startTime = a.getStartTime() != null ? a.getStartTime().toString() : null;
        this.submitTime = a.getSubmitTime() != null ? a.getSubmitTime().toString() : null;
        this.submitted = a.getSubmitted();
    }

    public Long getAttemptId() { return attemptId; }
    public Long getQuizId() { return quizId; }
    public String getQuizTitle() { return quizTitle; }
    public Integer getScore() { return score; }
    public Integer getTotalQuestions() { return totalQuestions; }
    public String getStartTime() { return startTime; }
    public String getSubmitTime() { return submitTime; }
    public Boolean getSubmitted() { return submitted; }
}