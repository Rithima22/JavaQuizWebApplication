import { useNavigate } from 'react-router-dom'

export default function BackButton({ to, label = '← Back' }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => to ? navigate(to) : navigate(-1)}
      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 hover:underline"
    >
      {label}
    </button>
  )
}