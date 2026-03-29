package com.example.quizapp.service;

import com.example.quizapp.dto.*;
import com.example.quizapp.exception.BadRequestException;
import com.example.quizapp.exception.ResourceNotFoundException;
import com.example.quizapp.model.*;
import com.example.quizapp.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public TeacherService(QuestionRepository questionRepository,
                          QuizRepository quizRepository,
                          QuizQuestionRepository quizQuestionRepository,
                          UserRepository userRepository,
                          QuizAttemptRepository quizAttemptRepository) {
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.userRepository = userRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    // ── Questions ──────────────────────────────────────────────────────────────

    public QuestionResponse createQuestion(QuestionRequest request, String username) {
        User teacher = getUser(username);
        Question q = new Question();
        q.setText(request.getText());
        q.setOptionA(request.getOptionA());
        q.setOptionB(request.getOptionB());
        q.setOptionC(request.getOptionC());
        q.setOptionD(request.getOptionD());
        q.setCorrectAnswer(request.getCorrectAnswer().toUpperCase());
        q.setCreatedBy(teacher);
        return new QuestionResponse(questionRepository.save(q), username);
    }

    public List<QuestionResponse> getMyQuestions(String username) {
        User teacher = getUser(username);
        return questionRepository.findAllByCreatedBy(teacher)
                .stream()
                .map(q -> new QuestionResponse(q, username))
                .collect(Collectors.toList());
    }

    public QuestionResponse updateQuestion(Long id, QuestionRequest request, String username) {
        User teacher = getUser(username);
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + id));
        if (!q.getCreatedBy().getId().equals(teacher.getId())) {
            throw new BadRequestException("You can only edit your own questions");
        }
        q.setText(request.getText());
        q.setOptionA(request.getOptionA());
        q.setOptionB(request.getOptionB());
        q.setOptionC(request.getOptionC());
        q.setOptionD(request.getOptionD());
        q.setCorrectAnswer(request.getCorrectAnswer().toUpperCase());
        return new QuestionResponse(questionRepository.save(q), username);
    }

    @Transactional
    public void deleteQuestion(Long id, String username) {
        User teacher = getUser(username);
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + id));
        if (!q.getCreatedBy().getId().equals(teacher.getId())) {
            throw new BadRequestException("You can only delete your own questions");
        }
        // Remove from any quizzes first
        List<QuizQuestion> usages = quizQuestionRepository.findAllByQuestionId(id);
        quizQuestionRepository.deleteAll(usages);
        questionRepository.deleteById(id);
    }

    // ── Quizzes ────────────────────────────────────────────────────────────────

    @Transactional
    public QuizResponse createQuiz(QuizRequest request, String username) {
        User teacher = getUser(username);

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setStartTime(LocalDateTime.parse(request.getStartTime()));
        quiz.setEndTime(LocalDateTime.parse(request.getEndTime()));
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setTeacher(teacher);
        Quiz saved = quizRepository.save(quiz);

        List<QuizQuestion> addedQuestions = new ArrayList<>();
        for (int i = 0; i < request.getQuestionIds().size(); i++) {
            Long qId = request.getQuestionIds().get(i);
            Question question = questionRepository.findById(qId)
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + qId));
            QuizQuestion qq = new QuizQuestion();
            qq.setQuiz(saved);
            qq.setQuestion(question);
            qq.setQuestionOrder(i + 1);
            quizQuestionRepository.save(qq);
            addedQuestions.add(qq);
        }
        return new QuizResponse(saved, username, addedQuestions);
    }

    public List<QuizResponse> getMyQuizzes(String username) {
        User teacher = getUser(username);
        List<Quiz> quizzes = quizRepository.findAllByTeacher(teacher);
        return quizzes.stream().map(quiz -> {
            List<QuizQuestion> qqs = quizQuestionRepository
                    .findAllByQuizIdOrderByQuestionOrder(quiz.getId());
            return new QuizResponse(quiz, username, qqs);
        }).collect(Collectors.toList());
    }

    @Transactional
    public QuizResponse updateQuiz(Long id, QuizRequest request, String username) {
        User teacher = getUser(username);
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + id));
        if (!quiz.getTeacher().getId().equals(teacher.getId())) {
            throw new BadRequestException("You can only edit your own quizzes");
        }
        quiz.setTitle(request.getTitle());
        quiz.setStartTime(LocalDateTime.parse(request.getStartTime()));
        quiz.setEndTime(LocalDateTime.parse(request.getEndTime()));
        quiz.setDurationMinutes(request.getDurationMinutes());
        quizQuestionRepository.deleteAllByQuizId(id);
        quizRepository.save(quiz);

        List<QuizQuestion> addedQuestions = new ArrayList<>();
        for (int i = 0; i < request.getQuestionIds().size(); i++) {
            Long qId = request.getQuestionIds().get(i);
            Question question = questionRepository.findById(qId)
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + qId));
            QuizQuestion qq = new QuizQuestion();
            qq.setQuiz(quiz);
            qq.setQuestion(question);
            qq.setQuestionOrder(i + 1);
            quizQuestionRepository.save(qq);
            addedQuestions.add(qq);
        }
        return new QuizResponse(quiz, username, addedQuestions);
    }

    @Transactional
    public void deleteQuiz(Long id, String username) {
        User teacher = getUser(username);
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + id));
        if (!quiz.getTeacher().getId().equals(teacher.getId())) {
            throw new BadRequestException("You can only delete your own quizzes");
        }
        // Delete attempts first, then quiz_questions, then quiz
        quizAttemptRepository.deleteAllByQuizId(id);
        quizQuestionRepository.deleteAllByQuizId(id);
        quizRepository.deleteById(id);
    }

    public List<QuizAttempt> getQuizStats(Long quizId, String username) {
        User teacher = getUser(username);
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizId));
        if (!quiz.getTeacher().getId().equals(teacher.getId())) {
            throw new BadRequestException("Access denied");
        }
        return quizAttemptRepository.findAllByQuizId(quizId);
    }

    public List<UserResponse> getAllStudents() {
        return userRepository.findAllByRole(User.Role.STUDENT)
                .stream().map(UserResponse::new).collect(Collectors.toList());
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}