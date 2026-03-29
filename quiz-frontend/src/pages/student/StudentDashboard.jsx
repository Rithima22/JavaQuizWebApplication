import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import { getStudentQuizzesApi } from '../../api/endpoints'

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    getStudentQuizzesApi()
      .then(res => setQuizzes(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const statusStyle = {
    ACTIVE: 'bg-green-100 text-green-700',
    UPCOMING: 'bg-yellow-100 text-yellow-700',
    ENDED: 'bg-gray-100 text-gray-500',
  }

  const filtered = filter === 'ALL'
    ? quizzes
    : quizzes.filter(q => q.status === filter)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {user?.fullName} 👋
        </h1>
        <p className="text-gray-500 mb-6">Your Quiz Dashboard</p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {['ALL', 'ACTIVE', 'UPCOMING', 'ENDED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition
                  ${filter === f
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/student/results')}
            className="text-blue-600 hover:underline text-sm"
          >
            View My Results →
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading quizzes...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
            No quizzes found.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(q => (
              <div key={q.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{q.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[q.status]}`}>
                        {q.status}
                      </span>
                      {q.attempted && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          Attempted
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 space-y-0.5">
                      <div>👨‍🏫 Teacher: {q.teacherUsername}</div>
                      <div>🕐 Start: {new Date(q.startTime).toLocaleString()}</div>
                      <div>🕐 End: {new Date(q.endTime).toLocaleString()}</div>
                      <div>⏱ Duration: {q.durationMinutes} minutes</div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {q.status === 'ACTIVE' && !q.attempted && (
                      <button
                        onClick={() => navigate(`/student/quiz/${q.id}/take`)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Take Quiz
                      </button>
                    )}
                    {q.attempted && (
                      <button
                        onClick={() => navigate('/student/results')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        View Result
                      </button>
                    )}
                    {q.status === 'UPCOMING' && !q.attempted && (
                      <span className="text-yellow-600 text-sm font-medium">
                        Not started yet
                      </span>
                    )}
                    {q.status === 'ENDED' && !q.attempted && (
                      <span className="text-gray-400 text-sm">Expired</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}