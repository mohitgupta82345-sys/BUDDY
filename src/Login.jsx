import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, UserRound } from 'lucide-react'

const featureItems = [
  'Personalized career recommendations',
  'Skill-gap insights that feel actionable',
  'Roadmaps built for your interests and strengths',
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
          <div className="text-xs uppercase tracking-[0.18em] text-[#bac0cf]">Trusted guidance</div>
          <div className="text-sm font-semibold text-white">Built for students and future thinkers.</div>
        </div>
      </div>
    </div>
  )
}

export function Register({ onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: true,
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.fullName.trim() || !formData.email || !formData.password || !formData.confirmPassword) {
      return
    }

    if (formData.password !== formData.confirmPassword) {
      return
    }

    onSubmit?.(formData)
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#27364b]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-[#ece7df] bg-white shadow-[0_25px_80px_rgba(39,54,75,0.10)] lg:grid-cols-[1.05fr_1fr]">
          <AuthFeaturePanel />

          <div className="flex items-center justify-center bg-[#f8f7f2] p-5 sm:p-8 lg:p-12">
            <div className="w-full max-w-md rounded-[24px] border border-[#ece7df] bg-white p-6 shadow-[0_12px_35px_rgba(39,54,75,0.08)] sm:p-8">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eeedf8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5d56a5]">
                    <Sparkles className="h-3.5 w-3.5" />
                    New here
                  </div>
                  <h2 className="text-3xl font-black tracking-[-0.08em] text-[#27364b]">Register</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#5d56a5]">
                  <UserRound className="h-5 w-5" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-[#475467]">
                    Full name
                  </label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8392]" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-[#e5e0d7] bg-[#fffdfb] py-3.5 pl-11 pr-4 text-sm text-[#27364b] outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-[#475467]">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8392]" />
                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@buddy.app"
                      className="w-full rounded-2xl border border-[#e5e0d7] bg-[#fffdfb] py-3.5 pl-11 pr-4 text-sm text-[#27364b] outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-[#475467]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8392]" />
                    <input
                      id="register-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full rounded-2xl border border-[#e5e0d7] bg-[#fffdfb] py-3.5 pl-11 pr-12 text-sm text-[#27364b] outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#7a8392] transition hover:bg-[#f3f1fb] hover:text-[#5d56a5]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-[#475467]">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8392]" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className="w-full rounded-2xl border border-[#e5e0d7] bg-[#fffdfb] py-3.5 pl-11 pr-4 text-sm text-[#27364b] outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10"
                    />
                  </div>
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#52607a]">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-[#dfe3e8] bg-white text-[#8a83d6] focus:ring-[#8a83d6]"
                  />
                  Send me product updates
                </label>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#27364b] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(39,54,75,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1d2b3d]"
                >
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 border-t border-[#ece7df] pt-5 text-center text-sm text-[#52607a]">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[#5d56a5] transition hover:text-[#473d8b]">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Login({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: 'student@buddy.app',
    password: 'buddy123',
    remember: true,
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formData.email || !formData.password) {
      return
    }
    onSubmit?.(formData)
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#27364b]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-[#ece7df] bg-white shadow-[0_25px_80px_rgba(39,54,75,0.10)] lg:grid-cols-[1.05fr_1fr]">
          <AuthFeaturePanel />

          <div className="flex items-center justify-center bg-[#f8f7f2] p-5 sm:p-8 lg:p-12">
            <div className="w-full max-w-md rounded-[24px] border border-[#ece7df] bg-white p-6 shadow-[0_12px_35px_rgba(39,54,75,0.08)] sm:p-8">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eeedf8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5d56a5]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Welcome back
                  </div>
                  <h2 className="text-3xl font-black tracking-[-0.08em] text-[#27364b]">Login</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#5d56a5]">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-[#475467]">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8392]" />
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@buddy.app"
                      className="w-full rounded-2xl border border-[#e5e0d7] bg-[#fffdfb] py-3.5 pl-11 pr-4 text-sm text-[#27364b] outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="login-password" className="text-sm font-semibold text-[#475467]">
                      Password
                    </label>
                    <button type="button" className="text-xs font-semibold text-[#5d56a5] transition hover:text-[#473d8b]">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8392]" />
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-[#e5e0d7] bg-[#fffdfb] py-3.5 pl-11 pr-12 text-sm text-[#27364b] outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#7a8392] transition hover:bg-[#f3f1fb] hover:text-[#5d56a5]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#52607a]">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-[#dfe3e8] bg-white text-[#8a83d6] focus:ring-[#8a83d6]"
                    />
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#27364b] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(39,54,75,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1d2b3d]"
                >
                  Login
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 border-t border-[#ece7df] pt-5 text-center text-sm text-[#52607a]">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="font-bold text-[#5d56a5] transition hover:text-[#473d8b]">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
