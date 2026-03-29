import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import {
  getAllUsersApi, createUserApi, updateUserApi, deleteUserApi
} from '../../api/endpoints'

const EMPTY_FORM = {
  username: '', password: '', fullName: '', email: '', role: 'STUDENT'
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [filterRole, setFilterRole] = useState('ALL')

  const fetchUsers = async () => {
    try {
      const res = await getAllUsersApi()
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const openCreate = () => {
    setEditUser(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowModal(true)
  }

  const openEdit = (u) => {
    setEditUser(u)
    setForm({
      username: u.username,
      password: '',
      fullName: u.fullName || '',
      email: u.email || '',
      role: u.role
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editUser) {
        await updateUserApi(editUser.id, form)
      } else {
        await createUserApi(form)
      }
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await deleteUserApi(id)
      fetchUsers()
    } catch (err) {
      alert('Failed to delete user')
    }
  }

  const filtered = filterRole === 'ALL'
    ? users
    : users.filter(u => u.role === filterRole)

  const roleBadge = (role) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-700',
      TEACHER: 'bg-green-100 text-green-700',
      STUDENT: 'bg-blue-100 text-blue-700',
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[role]}`}>
        {role}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
          <button
            onClick={openCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Add User
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {['ALL', 'ADMIN', 'TEACHER', 'STUDENT'].map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition
                ${filterRole === r
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}
            >
              {r}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Username</th>
                  <th className="px-6 py-3 text-left">Full Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-500">{u.id}</td>
                    <td className="px-6 py-3 font-medium">{u.username}</td>
                    <td className="px-6 py-3">{u.fullName || '-'}</td>
                    <td className="px-6 py-3">{u.email || '-'}</td>
                    <td className="px-6 py-3">{roleBadge(u.role)}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => openEdit(u)}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-6 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editUser ? 'Edit User' : 'Create New User'}
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded px-3 py-2 mb-3 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={editUser ? 'New Password (leave blank to keep)' : 'Password'}
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required={!editUser}
              />
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full Name"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
              />
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="STUDENT">STUDENT</option>
                <option value="TEACHER">TEACHER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold"
                >
                  {editUser ? 'Update' : 'Create'}
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