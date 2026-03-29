import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import {
  getMyQuestionsApi, createQuestionApi,
  updateQuestionApi, deleteQuestionApi
} from '../../api/endpoints'

const EMPTY = {
  text: '', optionA: '', optionB: '',
  optionC: '', optionD: '', correctAnswer: 'A'
}

export default function TeacherQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editQ, setEditQ] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const fetchQuestions = async () => {
  try {
    const res = await getMyQuestionsApi()
    console.log('Questions response:', res.data)
    setQuestions(res.data)
  } catch (err) {
    console.error('Questions error:', err.response?.status, err.response?.data)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => { fetchQuestions() }, [])

  const openCreate = () => {
    setEditQ(null)
    setForm(EMPTY)
    setError('')
    setShowModal(true)
  }

  const openEdit = (q) => {
    setEditQ(q)
    setForm({
      text: q.text, optionA: q.optionA, optionB: q.optionB,
      optionC: q.optionC, optionD: q.optionD, correctAnswer: q.correctAnswer
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editQ) await updateQuestionApi(editQ.id, form)
      else await createQuestionApi(form)
      setShowModal(false)
      fetchQuestions()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return
    try {
      await deleteQuestionApi(id)
      fetchQuestions()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Questions</h1>
          <button
            onClick={openCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + New Question
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
            No questions yet. Create your first one!
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={q.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-3">
                      Q{i + 1}. {q.text}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <div
                          key={opt}
                          className={`px-3 py-1.5 rounded-lg border ${
                            q.correctAnswer === opt
                              ? 'bg-green-50 border-green-400 text-green-700 font-semibold'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          {opt}. {q[`option${opt}`]}
                          {q.correctAnswer === opt && ' ✓'}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
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
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editQ ? 'Edit Question' : 'New Question'}
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded px-3 py-2 mb-3 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Question text"
                rows={3}
                value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
                required
              />
              {['A', 'B', 'C', 'D'].map(opt => (
                <input
                  key={opt}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Option ${opt}`}
                  value={form[`option${opt}`]}
                  onChange={e => setForm({ ...form, [`option${opt}`]: e.target.value })}
                  required
                />
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.correctAnswer}
                  onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
                >
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <option key={opt} value={opt}>Option {opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold"
                >
                  {editQ ? 'Update' : 'Create'}
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