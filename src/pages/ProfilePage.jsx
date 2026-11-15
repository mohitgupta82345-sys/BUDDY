import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  Check,
  CheckCircle2,
  Target,
  UserRound,
  X,
  AlertCircle,
} from 'lucide-react'

const DEGREE_OPTIONS = [
  'BCA', 'B.Tech', 'BBA', 'B.Com', 'B.Sc', 'B.A', 'B.Des', 'B.Pharm', 'MCA', 'MBA', 'Diploma', 'Other'
]

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate']

export function ProfilePage() {
  const { user, profile, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(() => profile?.full_name || user?.name || '')
  const [college, setCollege] = useState(() => profile?.college || '')
  const [degree, setDegree] = useState(() => profile?.degree || 'BCA')
  const [branch, setBranch] = useState(() => profile?.branch || '')
  const [currentYear, setCurrentYear] = useState(() => profile?.current_year || '1st Year')
  const [skills, setSkills] = useState(() => profile?.skills || [])
  const [customSkill, setCustomSkill] = useState('')
  const [careerGoals, setCareerGoals] = useState(() => profile?.career_goals || '')
  const [savedCareers, setSavedCareers] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function loadSaved() {
      try {
        const res = await api.careers.getSaved()
        if (isMounted && res.success && res.careers) {
          setSavedCareers(res.careers)
        }
      } catch (err) {
        console.error('Error loading saved careers:', err)
      }
    }
    loadSaved()
    return () => { isMounted = false }
  }, [])

  const addSkill = (e) => {
    e.preventDefault()
    if (!customSkill.trim()) return
    const cleaned = customSkill.trim()
    if (!skills.includes(cleaned)) {
      setSkills((prev) => [...prev, cleaned])
    }
    setCustomSkill('')
  }

  const removeSkill = (s) => {
    setSkills((prev) => prev.filter((item) => item !== s))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')
    setError('')

    try {
      await updateProfile({
        fullName: fullName.trim(),
        college: college.trim(),
        degree,
        branch: branch.trim(),
        currentYear,
        skills,
        interests: profile?.interests || [],
        careerGoals: careerGoals.trim(),
        completedOnboarding: true,
      })
      setMessage('Profile updated successfully in database!')
    } catch (err) {
      setError(err.message || 'Failed to update profile.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2] py-8 px-4 sm:px-6 lg:px-8 text-[#27364b]">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="section-heading compact-heading">
          <span className="section-label">STUDENT PROFILE</span>
          <h2>Manage Your Academic Information & Saved Careers</h2>
          <p className="text-sm text-[#858e9c]">
            Update your academic stream, active skills, and career goals to keep your recommendations accurate.
          </p>
        </div>

        {message && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700">
            <CheckCircle2 size={16} className="text-green-600" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle size={16} className="text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 rounded-[28px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 text-base font-bold text-[#27364b]">
              <UserRound className="text-[#8a83d6]" size={18} />
              <span>Personal & Education Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2 px-3 text-xs sm:text-sm outline-none focus:border-[#8a83d6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full rounded-xl border border-[#e5e0d7] bg-[#f8f7f2] py-2 px-3 text-xs sm:text-sm text-[#858e9c] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1">Degree</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2 px-3 text-xs sm:text-sm outline-none focus:border-[#8a83d6]"
                >
                  {DEGREE_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1">Branch / Stream</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2 px-3 text-xs sm:text-sm outline-none focus:border-[#8a83d6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1">Year of Study</label>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
                  className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2 px-3 text-xs sm:text-sm outline-none focus:border-[#8a83d6]"
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475467] mb-1">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Delhi University / Mumbai University"
                className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2 px-3 text-xs sm:text-sm outline-none focus:border-[#8a83d6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475467] mb-1">Your Skills</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-md bg-[#eeedf8] px-2 py-1 text-xs font-medium text-[#5d56a5]"
                  >
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-600">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Add a new skill (e.g. Python, SQL)..."
                  className="rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-1.5 px-3 text-xs flex-1 outline-none focus:border-[#8a83d6]"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl bg-[#27364b] px-3.5 py-1.5 text-xs font-semibold text-white"
                >
                  + Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475467] mb-1">Career Ambition & Goals</label>
              <textarea
                rows={3}
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] p-3 text-xs sm:text-sm outline-none focus:border-[#8a83d6]"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-[#27364b] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#1d2b3d] transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
              <Check size={15} />
            </button>
          </form>

          <div className="rounded-[28px] border border-[#ece7df] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 text-base font-bold text-[#27364b]">
              <Target className="text-[#8a83d6]" size={18} />
              <span>Shortlisted Careers</span>
            </div>

            {savedCareers.length > 0 ? (
              <div className="space-y-3">
                {savedCareers.map((c) => (
                  <div key={c.id} className="rounded-xl border border-[#eee9df] bg-[#faf8f4] p-3 text-xs">
                    <strong className="block font-bold text-[#27364b]">{c.name}</strong>
                    <span className="text-[#858e9c] text-[11px] block mt-0.5">{c.domain} · {c.salary}</span>
                    <Link
                      to={`/career/${c.id}`}
                      className="mt-2 inline-flex items-center gap-1 font-bold text-[#5d56a5] hover:underline"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#858e9c]">
                <p>No careers shortlisted yet.</p>
                <Link to="/explorer" className="mt-2 inline-block font-bold text-[#5d56a5] hover:underline">
                  Browse Explorer &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProfilePage
