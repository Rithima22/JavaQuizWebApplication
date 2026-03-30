import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import BackButton from '../../components/BackButton'
import { getMyResultsApi } from '../../api/endpoints'

export default function StudentResults() {
  const navigate = useNavigate()
  const location = useLocation()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const message = location.state?.message

  const formatTime = (utcString) => {
    return new Date(utcString + 'Z').toLocaleString(undefined, {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    })
  }
  
  useEffect(() => {
    getMyResultsApi()
      .then(res => setResults(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const getGrade = (score, total) => {
    const pct = (score / total) * 100
    if (pct >= 90) return { label: 'A+', color: 'text-green-600' }
    if (pct >= 75) return { label: 'A', color: 'text-green-500' }
    if (pct >= 60) return { label: 'B', color: 'text-blue-600' }
    if (pct >= 40) return { label: 'C', color: 'text-yellow-600' }
    return { label: 'F', color: 'text-red-600' }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Results</h1>
          <BackButton to="/student/dashboard" label="← Back to Dashboard" />
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-6 text-sm">
            ✅ {message}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading results...</p>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
            No results yet. Take a quiz first!
          </div>
        ) : (
          <div className="space-y-4">
            {results.map(r => {
              const pct = r.totalQuestions > 0
                ? ((r.score / r.totalQuestions) * 100).toFixed(0)
                : 0
              const grade = getGrade(r.score, r.totalQuestions)
              return (
                <div key={r.attemptId} className="bg-white rounded-xl shadow p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {r.quizTitle}
                      </h3>
                      <div className="text-sm text-gray-500 space-y-0.5">
                        <div>📅 Submitted: {formatTime(r.submitTime)}</div>
                        <div>❓ Questions: {r.totalQuestions}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${grade.color}`}>
                        {grade.label}
                      </div>
                      <div className="text-2xl font-bold text-gray-700 mt-1">
                        {r.score}/{r.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-500">{pct}%</div>
                    </div>
                  </div>
                  {/* Score bar */}
                  <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        pct >= 60 ? 'bg-green-500' : 'bg-red-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
