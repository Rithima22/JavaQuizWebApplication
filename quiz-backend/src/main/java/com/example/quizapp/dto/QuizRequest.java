package com.example.quizapp.dto;

import java.util.List;

public class QuizRequest {
    private String title;
    private String startTime;   // ISO format: 2025-06-01T09:00:00
    private String endTime;
    private Integer durationMinutes;
    private List<Long> questionIds;

    public QuizRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public List<Long> getQuestionIds() { return questionIds; }
    public void setQuestionIds(List<Long> questionIds) { this.questionIds = questionIds; }
}