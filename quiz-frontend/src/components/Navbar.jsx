import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const NAV_LINKS = {
  ADMIN: [
    { path: '/admin/dashboard', label: '🏠 Dashboard' },
    { path: '/admin/users', label: '👥 Manage Users' },
  ],
  TEACHER: [
    { path: '/teacher/dashboard', label: '🏠 Dashboard' },
    { path: '/teacher/questions', label: '❓ Questions' },
    { path: '/teacher/quizzes', label: '📝 Quizzes' },
  ],
  STUDENT: [
    { path: '/student/dashboard', label: '🏠 Dashboard' },
    { path: '/student/results', label: '📊 My Results' },
  ],
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const links = user ? (NAV_LINKS[user.role] || []) : []

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-blue-700 text-white px-4 py-3 flex justify-between items-center shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white text-2xl focus:outline-none"
          >
            ☰
          </button>
          <span
            className="text-lg font-bold cursor-pointer"
            onClick={() => {
              const home = links[0]?.path || '/login'
              navigate(home)
            }}
          >
            📚 Java Quiz App
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block">
              👤 {user.fullName}
              <span className="ml-2 bg-blue-500 px-2 py-0.5 rounded text-xs font-semibold">
                {user.role}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
          <span className="font-bold text-lg">📚 Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-xl"
          >
            ✕
          </button>
        </div>

        {user && (
          <div className="p-4 border-b bg-blue-50">
            <p className="font-semibold text-gray-800">{user.fullName}</p>
            <p className="text-xs text-blue-600 font-medium">{user.role}</p>
          </div>
        )}

        <nav className="p-3">
          {links.map(link => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path)
                setSidebarOpen(false)
              }}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 text-sm font-medium transition
                ${location.pathname === link.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  )
}