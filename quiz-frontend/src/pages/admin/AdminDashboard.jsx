import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import { getAllUsersApi, getUsersByRoleApi } from '../../api/endpoints'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, teachers: 0, students: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allRes, teacherRes, studentRes] = await Promise.all([
          getAllUsersApi(),
          getUsersByRoleApi('TEACHER'),
          getUsersByRoleApi('STUDENT'),
        ])
        setStats({
          total: allRes.data.length,
          teachers: teacherRes.data.length,
          students: studentRes.data.length,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {user?.fullName} 👋
        </h1>
        <p className="text-gray-500 mb-8">Admin Control Panel</p>

        {loading ? (
          <p className="text-gray-500">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 text-center border-t-4 border-blue-500">
              <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-gray-600 mt-1">Total Users</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center border-t-4 border-green-500">
              <div className="text-4xl font-bold text-green-600">{stats.teachers}</div>
              <div className="text-gray-600 mt-1">Teachers</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center border-t-4 border-purple-500">
              <div className="text-4xl font-bold text-purple-600">{stats.students}</div>
              <div className="text-gray-600 mt-1">Students</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="bg-white hover:bg-blue-50 border border-blue-200 rounded-xl p-6 text-left shadow transition"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="font-semibold text-gray-800">Manage Users</div>
            <div className="text-sm text-gray-500 mt-1">
              Add, edit or delete teachers and students
            </div>
          </button>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-left shadow">
            <div className="text-2xl mb-2">🔐</div>
            <div className="font-semibold text-gray-800">System Info</div>
            <div className="text-sm text-gray-500 mt-1">
              Backend: Spring Boot 4.x | DB: MySQL | Auth: JWT
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}