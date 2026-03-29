package com.example.quizapp.dto;

import com.example.quizapp.model.Quiz;

public class StudentQuizView {
    private Long id;
    private String title;
    private String startTime;
    private String endTime;
    private Integer durationMinutes;
    private String teacherUsername;
    private String status;
    private Boolean attempted;

    public StudentQuizView(Quiz quiz, String teacherUsername, String status, Boolean attempted) {
        this.id = quiz.getId();
        this.title = quiz.getTitle();
        this.startTime = quiz.getStartTime().toString();
        this.endTime = quiz.getEndTime().toString();
        this.durationMinutes = quiz.getDurationMinutes();
        this.teacherUsername = teacherUsername;
        this.status = status;
        this.attempted = attempted;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public String getTeacherUsername() { return teacherUsername; }
    public String getStatus() { return status; }
    public Boolean getAttempted() { return attempted; }
}