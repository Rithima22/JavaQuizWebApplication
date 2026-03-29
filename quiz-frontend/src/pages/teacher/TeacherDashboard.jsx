import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import { getMyQuestionsApi, getMyQuizzesApi, getStudentsApi } from '../../api/endpoints'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ questions: 0, quizzes: 0, students: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [qRes, quizRes, stuRes] = await Promise.all([
          getMyQuestionsApi(),
          getMyQuizzesApi(),
          getStudentsApi(),
        ])
        setStats({
          questions: qRes.data.length,
          quizzes: quizRes.data.length,
          students: stuRes.data.length,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {user?.fullName} 👋
        </h1>
        <p className="text-gray-500 mb-8">Teacher Panel</p>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 text-center border-t-4 border-blue-500">
              <div className="text-4xl font-bold text-blue-600">{stats.questions}</div>
              <div className="text-gray-600 mt-1">My Questions</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center border-t-4 border-green-500">
              <div className="text-4xl font-bold text-green-600">{stats.quizzes}</div>
              <div className="text-gray-600 mt-1">My Quizzes</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center border-t-4 border-purple-500">
              <div className="text-4xl font-bold text-purple-600">{stats.students}</div>
              <div className="text-gray-600 mt-1">Total Students</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/teacher/questions')}
            className="bg-white hover:bg-blue-50 border border-blue-200 rounded-xl p-6 text-left shadow transition"
          >
            <div className="text-2xl mb-2">❓</div>
            <div className="font-semibold text-gray-800">Manage Questions</div>
            <div className="text-sm text-gray-500 mt-1">Create and manage Java MCQ questions</div>
          </button>
          <button
            onClick={() => navigate('/teacher/quizzes')}
            className="bg-white hover:bg-green-50 border border-green-200 rounded-xl p-6 text-left shadow transition"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold text-gray-800">Manage Quizzes</div>
            <div className="text-sm text-gray-500 mt-1">Schedule quizzes and view student scores</div>
          </button>
        </div>
      </div>
    </div>
  )
}