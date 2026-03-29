package com.example.quizapp.dto;

import com.example.quizapp.model.Question;

public class QuestionResponse {
    private Long id;
    private String text;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;
    private String createdBy;

    public QuestionResponse(Question q, String createdByUsername) {
        this.id = q.getId();
        this.text = q.getText();
        this.optionA = q.getOptionA();
        this.optionB = q.getOptionB();
        this.optionC = q.getOptionC();
        this.optionD = q.getOptionD();
        this.correctAnswer = q.getCorrectAnswer();
        this.createdBy = createdByUsername;
    }

    public Long getId() { return id; }
    public String getText() { return text; }
    public String getOptionA() { return optionA; }
    public String getOptionB() { return optionB; }
    public String getOptionC() { return optionC; }
    public String getOptionD() { return optionD; }
    public String getCorrectAnswer() { return correctAnswer; }
    public String getCreatedBy() { return createdBy; }
}