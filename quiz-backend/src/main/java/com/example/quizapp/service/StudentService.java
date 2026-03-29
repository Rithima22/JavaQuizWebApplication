package com.example.quizapp.service;

import com.example.quizapp.dto.*;
import com.example.quizapp.exception.BadRequestException;
import com.example.quizapp.exception.ResourceNotFoundException;
import com.example.quizapp.model.*;
import com.example.quizapp.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final UserRepository userRepository;

    public StudentService(QuizRepository quizRepository,
                          QuizAttemptRepository quizAttemptRepository,
                          QuizQuestionRepository quizQuestionRepository,
                          UserRepository userRepository) {
        this.quizRepository = quizRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.userRepository = userRepository;
    }

    public List<StudentQuizView> getAllQuizzesForStudent(String username) {
        User student = getUser(username);
        LocalDateTime now = LocalDateTime.now();
        List<Quiz> quizzes = quizRepository.findAllOrderedByStartTime();

        return quizzes.stream().map(quiz -> {
            String status;
            if (now.isBefore(quiz.getStartTime())) status = "UPCOMING";
            else if (now.isAfter(quiz.getEndTime())) status = "ENDED";
            else status = "ACTIVE";

            boolean attempted = quizAttemptRepository
                    .existsByStudentIdAndQuizId(student.getId(), quiz.getId());

            // fetch teacher username safely
            User teacher = userRepository.findById(quiz.getTeacher().getId())
                    .orElse(null);
            String teacherUsername = teacher != null ? teacher.getUsername() : "Unknown";

            return new StudentQuizView(quiz, teacherUsername, status, attempted);
        }).collect(Collectors.toList());
    }

    @Transactional
    public QuizTakeResponse startQuiz(Long quizId, String username) {
        User student = getUser(username);
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizId));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(quiz.getStartTime())) {
            throw new BadRequestException("Quiz has not started yet");
        }
        if (now.isAfter(quiz.getEndTime())) {
            throw new BadRequestException("Quiz has already ended");
        }

        // If already attempted, return existing attempt instead of error
        java.util.Optional<QuizAttempt> existing =
                quizAttemptRepository.findByStudentIdAndQuizId(student.getId(), quizId);
        if (existing.isPresent()) {
            QuizAttempt attempt = existing.get();
            if (attempt.getSubmitted()) {
                throw new BadRequestException("You have already submitted this quiz");
            }
            // Return existing in-progress attempt
            List<QuizQuestion> questions = quizQuestionRepository
                    .findAllByQuizIdOrderByQuestionOrder(quizId);
            return new QuizTakeResponse(quizId, quiz.getTitle(),
                    quiz.getDurationMinutes(), attempt.getId(), questions);
        }

        QuizAttempt attempt = new QuizAttempt();
        attempt.setStudent(student);
        attempt.setQuiz(quiz);
        attempt.setStartTime(now);
        attempt.setSubmitted(false);
        QuizAttempt saved = quizAttemptRepository.save(attempt);

        List<QuizQuestion> questions = quizQuestionRepository
                .findAllByQuizIdOrderByQuestionOrder(quizId);

        return new QuizTakeResponse(quizId, quiz.getTitle(),
                quiz.getDurationMinutes(), saved.getId(), questions);
    }

    @Transactional
    public QuizAttemptResponse submitQuiz(Long quizId, SubmitAnswerRequest request, String username) {
        User student = getUser(username);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizId));

        QuizAttempt attempt = quizAttemptRepository
                .findByStudentIdAndQuizId(student.getId(), quizId)
                .orElseThrow(() -> new BadRequestException("No active attempt found for this quiz"));

        if (attempt.getSubmitted()) {
            throw new BadRequestException("Quiz already submitted");
        }

        List<QuizQuestion> questions = quizQuestionRepository
                .findAllByQuizIdOrderByQuestionOrder(quizId);

        Map<Long, String> answers = request.getAnswers();
        int score = 0;
        for (QuizQuestion qq : questions) {
            String selected = answers.get(qq.getQuestion().getId());
            if (selected != null &&
                    selected.toUpperCase().equals(qq.getQuestion().getCorrectAnswer())) {
                score++;
            }
        }

        attempt.setScore(score);
        attempt.setTotalQuestions(questions.size());
        attempt.setSubmitTime(LocalDateTime.now());
        attempt.setSubmitted(true);
        quizAttemptRepository.save(attempt);

        return new QuizAttemptResponse(attempt, quiz.getTitle());
    }

    public List<QuizAttemptResponse> getMyResults(String username) {
        User student = getUser(username);
        List<QuizAttempt> attempts = quizAttemptRepository
                .findAllByStudentId(student.getId());

        return attempts.stream()
                .filter(QuizAttempt::getSubmitted)
                .map(a -> {
                    Quiz quiz = quizRepository.findById(a.getQuiz().getId())
                            .orElse(null);
                    String title = quiz != null ? quiz.getTitle() : "Unknown";
                    return new QuizAttemptResponse(a, title);
                })
                .collect(Collectors.toList());
    }

    public QuizAttemptResponse getResult(Long quizId, String username) {
        User student = getUser(username);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizId));

        QuizAttempt attempt = quizAttemptRepository
                .findByStudentIdAndQuizId(student.getId(), quizId)
                .orElseThrow(() -> new ResourceNotFoundException("No attempt found for quiz: " + quizId));

        return new QuizAttemptResponse(attempt, quiz.getTitle());
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}