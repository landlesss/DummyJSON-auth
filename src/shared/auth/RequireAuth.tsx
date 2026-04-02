import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth.ts'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

