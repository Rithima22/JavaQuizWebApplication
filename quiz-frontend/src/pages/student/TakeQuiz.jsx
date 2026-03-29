import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { startQuizApi, submitQuizApi } from '../../api/endpoints'
import BackButton from '../../components/BackButton'

export default function TakeQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    startQuizApi(id)
      .then(res => {
        setQuiz(res.data)
        setTimeLeft(res.data.durationMinutes * 60)
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to start quiz')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return
    setSubmitting(true)
    try {
      await submitQuizApi(id, { answers })
      navigate('/student/results', {
        state: { message: auto ? 'Time is up! Quiz auto-submitted.' : 'Quiz submitted successfully!' }
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit')
      setSubmitting(false)
    }
  }, [answers, id, navigate, submitting])

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) {
      handleSubmit(true)
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, handleSubmit])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const timerColor = timeLeft <= 60
    ? 'text-red-600'
    : timeLeft <= 300
    ? 'text-yellow-600'
    : 'text-green-600'

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Starting quiz...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <BackButton to="/student/dashboard" label="← Back to Dashboard" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky header with timer */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="max-w-3xl mx-auto px-6 py-3 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-gray-800">{quiz.title}</h1>
            <p className="text-xs text-gray-500">{quiz.questions.length} questions</p>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold font-mono ${timerColor}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-400">Time Remaining</div>
          </div>
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-1 bg-blue-500 transition-all"
            style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <p className="text-sm text-gray-500">
          Answered: {Object.keys(answers).length} / {quiz.questions.length}
        </p>

        {quiz.questions.map((q, i) => (
          <div key={q.id} className="bg-white rounded-xl shadow p-6">
            <p className="font-semibold text-gray-800 mb-4">
              Q{i + 1}. {q.text}
            </p>
            <div className="space-y-2">
              {['A', 'B', 'C', 'D'].map(opt => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                    ${answers[q.id] === opt
                      ? 'bg-blue-50 border-blue-500'
                      : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold">{opt}.</span> {q[`option${opt}`]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : '✅ Submit Quiz'}
        </button>
      </div>
    </div>
  )
}