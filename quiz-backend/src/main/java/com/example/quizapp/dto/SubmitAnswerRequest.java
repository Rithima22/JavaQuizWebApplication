package com.example.quizapp.dto;

import java.util.Map;

public class SubmitAnswerRequest {
    // key = questionId, value = selected answer (A/B/C/D)
    private Map<Long, String> answers;

    public SubmitAnswerRequest() {}

    public Map<Long, String> getAnswers() { return answers; }
    public void setAnswers(Map<Long, String> answers) { this.answers = answers; }
}