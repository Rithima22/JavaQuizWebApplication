import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import {
  getMyQuizzesApi, createQuizApi,
  updateQuizApi, deleteQuizApi, getMyQuestionsApi
} from '../../api/endpoints'

const EMPTY = {
  title: '', startTime: '', endTime: '',
  durationMinutes: 30, questionIds: []
}

export default function TeacherQuizzes() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editQuiz, setEditQuiz] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const [qzRes, qRes] = await Promise.all([
        getMyQuizzesApi(), getMyQuestionsApi()
      ])
      setQuizzes(qzRes.data)
      setQuestions(qRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setEditQuiz(null)
    setForm(EMPTY)
    setError('')
    setShowModal(true)
  }

  const openEdit = (q) => {
    setEditQuiz(q)
    setForm({
      title: q.title,
      startTime: q.startTime,
      endTime: q.endTime,
      durationMinutes: q.durationMinutes,
      questionIds: q.questions.map(qq => qq.id)
    })
    setError('')
    setShowModal(true)
  }

  const toggleQuestion = (id) => {
    setForm(prev => ({
      ...prev,
      questionIds: prev.questionIds.includes(id)
        ? prev.questionIds.filter(q => q !== id)
        : [...prev.questionIds, id]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.questionIds.length === 0) {
      setError('Please select at least one question')
      return
    }
    try {
      // Convert local datetime to UTC ISO string for backend
      const toUTC = (localDatetime) => {
        if (!localDatetime) return localDatetime
        return new Date(localDatetime).toISOString().slice(0, 19)
      }

      const payload = {
        ...form,
        startTime: toUTC(form.startTime),
        endTime: toUTC(form.endTime),
      }

      if (editQuiz) await updateQuizApi(editQuiz.id, payload)
      else await createQuizApi(payload)
      setShowModal(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz?')) return
    try {
      await deleteQuizApi(id)
      fetchData()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  const getStatus = (quiz) => {
    const now = new Date()
    const start = new Date(quiz.startTime)
    const end = new Date(quiz.endTime)
    if (now < start) return { label: 'UPCOMING', color: 'bg-yellow-100 text-yellow-700' }
    if (now > end) return { label: 'ENDED', color: 'bg-gray-100 text-gray-600' }
    return { label: 'ACTIVE', color: 'bg-green-100 text-green-700' }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Quizzes</h1>
          <button
            onClick={openCreate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Schedule Quiz
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : quizzes.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
            No quizzes yet. Schedule your first one!
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map(q => {
              const status = getStatus(q)
              return (
                <div key={q.id} className="bg-white rounded-xl shadow p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{q.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 space-y-0.5">
                        <div>🕐 Start: {new Date(q.startTime).toLocaleString()}</div>
                        <div>🕐 End: {new Date(q.endTime).toLocaleString()}</div>
                        <div>⏱ Duration: {q.durationMinutes} minutes</div>
                        <div>❓ Questions: {q.questions?.length || 0}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/teacher/quizzes/${q.id}/stats`)}
                        className="text-purple-600 hover:underline text-sm"
                      >
                        Stats
                      </button>
                      <button
                        onClick={() => openEdit(q)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editQuiz ? 'Edit Quiz' : 'Schedule New Quiz'}
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded px-3 py-2 mb-3 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Quiz Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.startTime}
                  onChange={e => setForm({ ...form, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.endTime}
                  onChange={e => setForm({ ...form, endTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.durationMinutes}
                  onChange={e => setForm({ ...form, durationMinutes: parseInt(e.target.value) })}
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  Select Questions ({form.questionIds.length} selected)
                </label>
                {questions.length === 0 ? (
                  <p className="text-sm text-red-400">
                    No questions available. Create questions first!
                  </p>
                ) : (
                  <div className="border rounded-lg max-h-40 overflow-y-auto divide-y">
                    {questions.map(q => (
                      <label
                        key={q.id}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={form.questionIds.includes(q.id)}
                          onChange={() => toggleQuestion(q.id)}
                        />
                        <span className="truncate">{q.text}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold"
                >
                  {editQuiz ? 'Update' : 'Schedule'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
