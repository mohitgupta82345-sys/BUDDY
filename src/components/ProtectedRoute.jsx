import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles } from 'lucide-react'

export function ProtectedRoute({ children, requireOnboarding = true }) {
  const { isAuthenticated, isLoading, completedOnboarding } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-2xl bg-[#eeedf8] text-[#8a83d6]">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-[#858e9c]">Loading your BUDDY experience...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireOnboarding && !completedOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

export function OnboardingRoute({ children }) {
  const { isAuthenticated, isLoading, completedOnboarding } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-2xl bg-[#eeedf8] text-[#8a83d6]">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-[#858e9c]">Loading student onboarding...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Returning users who already onboarded shouldn't be forced to redo onboarding
  if (completedOnboarding) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
