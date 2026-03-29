import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import BackButton from '../../components/BackButton'
import { getQuizStatsApi } from '../../api/endpoints'

export default function QuizStats() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuizStatsApi(id)
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const avg = stats.length > 0
    ? (stats.reduce((a, b) => a + (b.score || 0), 0) / stats.length).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <BackButton to="/teacher/quizzes" label="← Back to Quizzes" />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Quiz Statistics</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : stats.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
            No students have attempted this quiz yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-5 text-center border-t-4 border-blue-500">
                <div className="text-3xl font-bold text-blue-600">{stats.length}</div>
                <div className="text-gray-500 text-sm mt-1">Attempts</div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center border-t-4 border-green-500">
                <div className="text-3xl font-bold text-green-600">{avg}</div>
                <div className="text-gray-500 text-sm mt-1">Average Score</div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center border-t-4 border-purple-500">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.max(...stats.map(s => s.score || 0))}
                </div>
                <div className="text-gray-500 text-sm mt-1">Highest Score</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Student</th>
                    <th className="px-6 py-3 text-left">Score</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-left">Percentage</th>
                    <th className="px-6 py-3 text-left">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium">{s.student}</td>
                      <td className="px-6 py-3">{s.score}</td>
                      <td className="px-6 py-3">{s.totalQuestions}</td>
                      <td className="px-6 py-3">
                        <span className={`font-semibold ${
                          (s.score / s.totalQuestions) >= 0.7
                            ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {s.totalQuestions > 0
                            ? ((s.score / s.totalQuestions) * 100).toFixed(0)
                            : 0}%
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {s.submitTime
                          ? new Date(s.submitTime).toLocaleString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}