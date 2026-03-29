package com.example.quizapp.repository;

import com.example.quizapp.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {

    List<QuizQuestion> findAllByQuizIdOrderByQuestionOrder(Long quizId);

    void deleteAllByQuizId(Long quizId);
    List<QuizQuestion> findAllByQuestionId(Long questionId);
}