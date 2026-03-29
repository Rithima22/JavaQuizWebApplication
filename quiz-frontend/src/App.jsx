import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherQuestions from './pages/teacher/TeacherQuestions'
import TeacherQuizzes from './pages/teacher/TeacherQuizzes'
import QuizStats from './pages/teacher/QuizStats'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import TakeQuiz from './pages/student/TakeQuiz'
import StudentResults from './pages/student/StudentResults'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>
          } />

          {/* Teacher */}
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute role="TEACHER"><TeacherDashboard /></ProtectedRoute>
          } />
          <Route path="/teacher/questions" element={
            <ProtectedRoute role="TEACHER"><TeacherQuestions /></ProtectedRoute>
          } />
          <Route path="/teacher/quizzes" element={
            <ProtectedRoute role="TEACHER"><TeacherQuizzes /></ProtectedRoute>
          } />
          <Route path="/teacher/quizzes/:id/stats" element={
            <ProtectedRoute role="TEACHER"><QuizStats /></ProtectedRoute>
          } />

          {/* Student */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/quiz/:id/take" element={
            <ProtectedRoute role="STUDENT"><TakeQuiz /></ProtectedRoute>
          } />
          <Route path="/student/results" element={
            <ProtectedRoute role="STUDENT"><StudentResults /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}