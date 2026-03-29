package com.example.quizapp.repository;

import com.example.quizapp.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    Optional<QuizAttempt> findByStudentIdAndQuizId(Long studentId, Long quizId);

    List<QuizAttempt> findAllByStudentId(Long studentId);

    List<QuizAttempt> findAllByQuizId(Long quizId);

    boolean existsByStudentIdAndQuizId(Long studentId, Long quizId);

    @Query("""
        SELECT qa FROM QuizAttempt qa
        JOIN qa.quiz qz
        WHERE qz.teacher.id = :teacherId
          AND qa.submitted = true
        ORDER BY qa.submitTime DESC
        """)
    List<QuizAttempt> findSubmittedAttemptsByTeacherId(@Param("teacherId") Long teacherId);
    void deleteAllByQuizId(Long quizId);
}
