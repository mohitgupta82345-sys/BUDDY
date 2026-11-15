import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Sparkles, AlertCircle } from 'lucide-react'

export function RoadmapPage() {
  const { isAuthenticated } = useAuth()
  const [careers, setCareers] = useState([])
  const [selectedCareerId, setSelectedCareerId] = useState('')
  const [completedMilestones, setCompletedMilestones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [authNotice, setAuthNotice] = useState(false)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const res = await api.careers.list()
        if (res.success && res.careers) {
          setCareers(res.careers)
          const initialId = res.careers[0]?.id || ''
          setSelectedCareerId(initialId)
          if (isAuthenticated && initialId) {
            const roadRes = await api.roadmap.get(initialId).catch(() => ({ completedMilestoneIds: [] }))
            setCompletedMilestones(roadRes.completedMilestoneIds || [])
          }
        }
      } catch (err) {
        console.error('Failed to load roadmap careers:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [isAuthenticated])

  const handleCareerChange = async (e) => {
    const newId = e.target.value
    setSelectedCareerId(newId)
    if (isAuthenticated && newId) {
      try {
        const roadRes = await api.roadmap.get(newId).catch(() => ({ completedMilestoneIds: [] }))
        setCompletedMilestones(roadRes.completedMilestoneIds || [])
      } catch (err) {
        console.error('Error loading milestones for career:', err)
      }
    }
  }

  const handleToggle = async (milestoneId) => {
    if (!isAuthenticated) {
      setAuthNotice(true)
      return
    }

    const isDone = completedMilestones.includes(milestoneId)
    const nextState = !isDone

    // Optimistic UI update
    setCompletedMilestones((prev) =>
      nextState ? [...prev, milestoneId] : prev.filter((id) => id !== milestoneId)
    )

    try {
      await api.roadmap.toggleMilestone(selectedCareerId, milestoneId, nextState)
    } catch (err) {
      console.error('Failed to save milestone progress:', err)
      // Revert on error
      setCompletedMilestones((prev) =>
        isDone ? [...prev, milestoneId] : prev.filter((id) => id !== milestoneId)
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-2xl bg-[#eeedf8] text-[#8a83d6]">
          <Sparkles size={24} />
        </div>
      </div>
    )
  }

  const selectedCareer = careers.find((c) => c.id === selectedCareerId) || careers[0]
  const milestones = selectedCareer?.learningRoadmap || []

  const total = milestones.length
  const completedCount = completedMilestones.length
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0

  return (
    <div className="min-h-screen bg-[#f8f7f2] py-8 px-4 sm:px-6 lg:px-8 text-[#27364b]">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="section-heading compact-heading">
          <span className="section-label">CAREER ROADMAP</span>
          <h2>Milestone Learning Roadmaps with Progress Tracking</h2>
          <p className="text-sm text-[#858e9c]">
            Follow structured stages from fundamentals to production portfolio projects and check off your progress.
          </p>
        </div>

        <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label htmlFor="roadmap-select" className="block text-xs font-bold text-[#475467] mb-1">
              Select Career Roadmap:
            </label>
            <select
              id="roadmap-select"
              value={selectedCareerId}
              onChange={handleCareerChange}
              className="rounded-xl border border-[#e0dad0] bg-[#faf8f4] py-2.5 px-3 text-sm font-semibold text-[#27364b] outline-none focus:border-[#8a83d6]"
            >
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.domain})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 bg-[#faf8f4] p-3 rounded-2xl border border-[#eee9df]">
            <div>
              <span className="text-[10px] font-bold text-[#858e9c] uppercase">Roadmap Progress</span>
              <p className="text-base font-black text-[#27364b]">
                {completedCount} of {total} Milestones ({percent}%)
              </p>
            </div>
            <div className="w-24 h-2 rounded-full bg-[#e8e4dc] overflow-hidden">
              <div className="h-full bg-[#8a83d6] transition-all duration-300" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>

        {authNotice && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#8a83d6]/30 bg-[#eeedf8] p-4 text-xs text-[#27364b] animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-[#5d56a5] shrink-0" />
              <span>Please sign in or create an account to save and persist your milestone completion progress to your profile.</span>
            </div>
            <Link
              to="/login"
              className="rounded-lg bg-[#27364b] px-3 py-1.5 font-bold text-white hover:bg-[#1d2b3d] shrink-0"
            >
              Sign In
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {milestones.map((m, idx) => {
            const isDone = completedMilestones.includes(m.id)
            return (
              <div
                key={m.id}
                onClick={() => handleToggle(m.id)}
                className={`cursor-pointer rounded-[24px] border p-6 sm:p-7 transition shadow-sm select-none ${
                  isDone
                    ? 'border-[#3c7a52] bg-[#f5faf6]'
                    : 'border-[#ece7df] bg-white hover:border-[#8a83d6]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${
                        isDone ? 'bg-[#3c7a52] text-white' : 'bg-[#eeedf8] text-[#5d56a5]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a83d6]">
                        {m.stage} · {m.duration}
                      </span>
                      <h3 className={`text-base font-bold ${isDone ? 'text-[#1e3a27] line-through' : 'text-[#27364b]'}`}>
                        {m.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#858e9c] hidden sm:inline">
                      {isDone ? 'Completed' : 'Mark as Done'}
                    </span>
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}}
                      className="h-5 w-5 rounded border-[#dcd7cd] text-[#3c7a52] focus:ring-0 cursor-pointer"
                    />
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-[#52607a] leading-relaxed pl-11">
                  {m.description}
                </p>

                {m.skillObjectives && m.skillObjectives.length > 0 && (
                  <div className="mt-4 pl-11">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#858e9c] block mb-1.5">
                      Target Competencies &amp; Objectives:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.skillObjectives.map((obj) => (
                        <span
                          key={obj}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                            isDone
                              ? 'border-[#3c7a52]/30 bg-[#eef7f0] text-[#2c5c3e]'
                              : 'border-[#e2ded6] bg-[#faf8f4] text-[#475467]'
                          }`}
                        >
                          ✓ {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default RoadmapPage
