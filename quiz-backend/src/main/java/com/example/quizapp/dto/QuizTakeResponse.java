package com.example.quizapp.dto;

import com.example.quizapp.model.QuizQuestion;

import java.util.List;
import java.util.stream.Collectors;

// Sent to student when they start a quiz — NO correct answers included!
public class QuizTakeResponse {
    private Long quizId;
    private String title;
    private Integer durationMinutes;
    private Long attemptId;
    private List<QuestionForStudent> questions;

    public QuizTakeResponse(Long quizId, String title, Integer durationMinutes,
                             Long attemptId, List<QuizQuestion> quizQuestions) {
        this.quizId = quizId;
        this.title = title;
        this.durationMinutes = durationMinutes;
        this.attemptId = attemptId;
        this.questions = quizQuestions.stream()
                .map(qq -> new QuestionForStudent(qq.getQuestion().getId(),
                        qq.getQuestion().getText(),
                        qq.getQuestion().getOptionA(),
                        qq.getQuestion().getOptionB(),
                        qq.getQuestion().getOptionC(),
                        qq.getQuestion().getOptionD()))
                .collect(Collectors.toList());
    }

    public Long getQuizId() { return quizId; }
    public String getTitle() { return title; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public Long getAttemptId() { return attemptId; }
    public List<QuestionForStudent> getQuestions() { return questions; }

    public static class QuestionForStudent {
        private Long id;
        private String text;
        private String optionA;
        private String optionB;
        private String optionC;
        private String optionD;

        public QuestionForStudent(Long id, String text, String optionA,
                                   String optionB, String optionC, String optionD) {
            this.id = id;
            this.text = text;
            this.optionA = optionA;
            this.optionB = optionB;
            this.optionC = optionC;
            this.optionD = optionD;
        }

        public Long getId() { return id; }
        public String getText() { return text; }
        public String getOptionA() { return optionA; }
        public String getOptionB() { return optionB; }
        public String getOptionC() { return optionC; }
        public String getOptionD() { return optionD; }
    }
}