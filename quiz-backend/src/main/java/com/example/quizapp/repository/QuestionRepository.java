package com.example.quizapp.repository;

import com.example.quizapp.model.Question;
import com.example.quizapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findAllByCreatedBy(User teacher);

    List<Question> findByTextContainingIgnoreCase(String keyword);
}