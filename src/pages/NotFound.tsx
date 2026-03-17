import { useNavigate } from 'react-router-dom'

export function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <p className="text-6xl mb-4">404</p>
      <p className="text-[#606078] mb-6">Page not found</p>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 text-[#bf5fff] hover:underline"
      >
        Go home
      </button>
    </div>
  )
}
