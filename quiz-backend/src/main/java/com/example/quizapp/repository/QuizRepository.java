package com.example.quizapp.repository;

import com.example.quizapp.model.Quiz;
import com.example.quizapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findAllByTeacher(User teacher);

    @Query("SELECT q FROM Quiz q WHERE q.startTime <= :now AND q.endTime >= :now")
    List<Quiz> findActiveQuizzes(@Param("now") LocalDateTime now);

    @Query("SELECT q FROM Quiz q ORDER BY q.startTime DESC")
    List<Quiz> findAllOrderedByStartTime();
}