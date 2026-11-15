import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, AlertCircle, Loader2 } from 'lucide-react'

const featureItems = [
  'Personalized career recommendations across 24+ streams',
  'Skill-gap insights tailored to your degree and stream',
  'Dynamic learning roadmaps with database-backed progress',
  'Direct links to verified entry-level internships & jobs',
]

function AuthFeaturePanel() {
  return (
    <div className="relative hidden overflow-hidden bg-[#27364b] p-8 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(138,131,214,0.28),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(138,131,214,0.12),_transparent_30%)]" />
      <div className="relative z-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold text-[#f8f7f2] shadow-inner shadow-white/10">
            B
          </div>
          <div className="text-2xl font-black tracking-[-0.08em]">
            BUDDY<span className="text-[#8a83d6]">.</span>
          </div>
        </div>

        <div className="mb-10 max-w-sm">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dfe3f3]">
            <Sparkles className="h-3.5 w-3.5 text-[#8a83d6]" />
            Your career companion
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-[-0.08em]">
            Find a path that fits your future.
          </h1>
        </div>

        <div className="space-y-4">
          {featureItems.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8a83d6]/20 text-[#c8c0ff]">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm text-[#e9edf8]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf7f0] text-[#4a7d5d]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-[#bac0cf]">Trusted Guidance</div>
          <div className="text-sm font-semibold text-white">Built for students and future thinkers across all streams.</div>
        </div>
      </div>
    </div>
  )
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const cleanEmail = email.trim()

    if (!cleanEmail) {
      setError('Please provide your email address.')
      return
    }

    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address format (e.g. name@college.edu).')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await login(cleanEmail, password)
      if (res.completedOnboarding) {
        const destination = location.state?.from?.pathname || '/dashboard'
        navigate(destination, { replace: true })
      } else {
        navigate('/onboarding', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your email and password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[85vh] bg-[#f8f7f2] text-[#27364b] py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#ece7df] bg-white shadow-[0_25px_80px_rgba(39,54,75,0.10)] grid lg:grid-cols-[1.05fr_1fr]">
        <AuthFeaturePanel />

        <div className="flex items-center justify-center bg-[#f8f7f2] p-5 sm:p-8 lg:p-10">
          <div className="w-full max-w-md rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-[0_12px_35px_rgba(39,54,75,0.08)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eeedf8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5d56a5]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Welcome back
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.08em] text-[#27364b]">Student Login</h2>
              </div>
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#5d56a5]">
                <Lock className="h-5 w-5" />
              </div>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-[#475467]">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8392]" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    disabled={isSubmitting}
                    required
                    className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-3 pl-10 pr-4 text-xs sm:text-sm text-[#27364b] outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold text-[#475467]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8392]" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    disabled={isSubmitting}
                    required
                    className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-3 pl-10 pr-11 text-xs sm:text-sm text-[#27364b] outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#7a8392] hover:text-[#5d56a5] transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#27364b] px-4 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_20px_rgba(39,54,75,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1d2b3d] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing in securely...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-[#ece7df] pt-4 text-center text-xs text-[#52607a]">
              Don&apos;t have an account yet?{' '}
              <Link to="/signup" className="font-bold text-[#5d56a5] hover:underline">
                Create student account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginPage
