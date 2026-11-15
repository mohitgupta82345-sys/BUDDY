import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  ArrowRight,
  BookOpen,
  Compass,
  ExternalLink,
  Info,
  Loader2,
  RotateCcw,
  Sparkles,
  UserCheck,
  Zap,
  AlertCircle,
} from 'lucide-react'

export function DashboardPage() {
  const { user, profile } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [completedMilestones, setCompletedMilestones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiInsights, setAiInsights] = useState(null)
  const [aiError, setAiError] = useState('')
  const [showScoreExplainer, setShowScoreExplainer] = useState(false)

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true)
      try {
        const res = await api.dashboard.get()
        if (res.success) {
          setDashboardData(res)
          setCompletedMilestones(res.learningProgress?.completedMilestones || [])
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboard()
  }, [])

  const handleToggleMilestone = async (milestoneId) => {
    if (!dashboardData?.primaryCareer?.id) return
    const careerId = dashboardData.primaryCareer.id
    const isCompleted = completedMilestones.includes(milestoneId)
    const nextCompleted = !isCompleted

    // Optimistic update
    setCompletedMilestones((prev) =>
      nextCompleted ? [...prev, milestoneId] : prev.filter((id) => id !== milestoneId)
    )

    try {
      await api.roadmap.toggleMilestone(careerId, milestoneId, nextCompleted)
    } catch (err) {
      console.error('Failed to update milestone:', err)
      // Revert on failure
      setCompletedMilestones((prev) =>
        isCompleted ? [...prev, milestoneId] : prev.filter((id) => id !== milestoneId)
      )
    }
  }

  const handleRunAiRecommendations = async () => {
    setAiGenerating(true)
    setAiError('')
    try {
      const res = await api.recommendations.generate()
      if (res.success && res.recommendations) {
        setAiInsights(res.recommendations)
      } else {
        setAiError(res.message || 'Unable to generate recommendation analysis.')
      }
    } catch (err) {
      console.error('AI Recommendation Error:', err)
      setAiError(err.message || 'Failed to connect to recommendation engine.')
    } finally {
      setAiGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-2xl bg-[#eeedf8] text-[#8a83d6]">
          <Sparkles size={24} />
        </div>
        <p className="text-sm font-medium text-[#858e9c]">Loading your personalized dashboard...</p>
      </div>
    )
  }

  const student = dashboardData?.student || {
    name: profile?.full_name || user?.name || 'Student',
    college: profile?.college || 'University',
    degree: profile?.degree || 'BCA',
    branch: profile?.branch || 'Computer Science',
    currentYear: profile?.current_year || '1st Year',
    skills: profile?.skills || [],
    interests: profile?.interests || [],
  }

  const hasAssessment = Boolean(dashboardData?.hasAssessment)
  const readinessScore = dashboardData?.readinessScore || 75
  const topCareers = dashboardData?.topCareers || []
  const primaryCareer = dashboardData?.primaryCareer || topCareers[0] || {}
  const radarData = dashboardData?.radarData || []
  const strengths = dashboardData?.strengths || []
  const missingSkills = dashboardData?.missingSkills || []
  const opportunities = dashboardData?.matchedOpportunities || []

  const roadmapMilestones = primaryCareer.learningRoadmap || [
    { id: `${primaryCareer.id}-m1`, stage: 'Beginner', title: 'Foundational Knowledge & Tools', duration: '3-4 weeks', description: 'Core syntax and fundamentals.' },
    { id: `${primaryCareer.id}-m2`, stage: 'Intermediate', title: 'Hands-on Frameworks & Projects', duration: '4-6 weeks', description: 'Real-world data or application development.' },
    { id: `${primaryCareer.id}-m3`, stage: 'Advanced', title: 'Production Readiness & Portfolio', duration: '4-6 weeks', description: 'Publish project and prepare interview communication.' },
  ]

  const totalMilestones = roadmapMilestones.length
  const completedCount = completedMilestones.length
  const progressPercent = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0

  return (
    <div className="min-h-screen bg-[#f8f7f2] py-8 px-4 sm:px-6 lg:px-8 text-[#27364b]">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Header */}
        <div className="rounded-[28px] border border-[#ece7df] bg-white p-6 sm:p-10 shadow-[0_15px_40px_rgba(39,54,75,0.06)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eeedf8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#5d56a5]">
                  <Sparkles size={14} /> Personalized Student Dashboard
                </span>
                {hasAssessment ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#edf7f0] px-2.5 py-0.5 text-xs font-bold text-[#3c7a52]">
                    <UserCheck size={12} /> Assessment Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fdf5e6] px-2.5 py-0.5 text-xs font-bold text-[#b45309]">
                    <AlertCircle size={12} /> Assessment Pending
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#27364b]">
                Welcome back, {student.name}!
              </h1>
              <p className="text-xs sm:text-sm text-[#52607a] max-w-2xl leading-relaxed">
                Here is your live career readiness roadmap, skill gap progress, and curated industry opportunities tailored to your studies in {student.degree} ({student.branch}).
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleRunAiRecommendations}
                disabled={aiGenerating}
                className="flex items-center gap-1.5 rounded-xl bg-[#eeedf8] border border-[#d8d3f5] px-4 py-2.5 text-xs font-bold text-[#5d56a5] transition hover:bg-[#e0dcf8] disabled:opacity-50 cursor-pointer"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-[#5d56a5]" />
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    <span>Run AI Recommendation Analysis</span>
                  </>
                )}
              </button>

              <Link
                to="/assessment"
                className="flex items-center gap-1.5 rounded-xl border border-[#dfe3e8] bg-white px-4 py-2.5 text-xs font-semibold text-[#27364b] hover:bg-[#f8f7f2] transition"
              >
                <RotateCcw size={14} />
                <span>{hasAssessment ? 'Retake Assessment' : 'Take Assessment'}</span>
              </Link>

              <Link
                to="/explorer"
                className="flex items-center gap-1.5 rounded-xl bg-[#27364b] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1d2b3d] transition"
              >
                <Compass size={14} />
                <span>Career Explorer</span>
              </Link>
            </div>
          </div>

          {/* Student Profile Snapshot Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl bg-[#faf8f4] p-4 border border-[#eee9df]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858e9c]">College / Institute</span>
              <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#27364b] truncate">{student.college || 'Enrolled Student'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858e9c]">Degree &amp; Year</span>
              <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#27364b]">{student.degree} · {student.currentYear}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858e9c]">Primary Target Role</span>
              <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#5d56a5] truncate">{primaryCareer.name || 'Data Scientist'}</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#858e9c]">Career Readiness</span>
                <button
                  type="button"
                  onClick={() => setShowScoreExplainer((prev) => !prev)}
                  className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#5d56a5] hover:underline"
                  title="Click to view calculation breakdown"
                >
                  <Info size={11} /> Formula
                </button>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs sm:text-sm font-black text-[#27364b]">{readinessScore}%</span>
                <div className="h-2 flex-1 rounded-full bg-[#e5e0d7] overflow-hidden">
                  <div className="h-full bg-[#8a83d6]" style={{ width: `${readinessScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Readiness Score Calculation Explainer Box */}
          {showScoreExplainer && (
            <div className="mt-4 rounded-2xl border border-[#d8d3f5] bg-[#fbfaff] p-4 text-xs text-[#27364b] animate-in fade-in">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold flex items-center gap-1.5 text-[#5d56a5]">
                  <Info size={14} /> Transparent Career Readiness Formula
                </h4>
                <button
                  type="button"
                  onClick={() => setShowScoreExplainer(false)}
                  className="text-[#858e9c] hover:text-[#27364b] text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>
              <p className="text-[#52607a] leading-relaxed mb-3">
                BUDDY calculates your Career Readiness Score (0–100%) deterministically using multi-axial compatibility:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="rounded-xl bg-white border border-[#eee9df] p-3 shadow-xs">
                  <span className="font-bold text-[#27364b] block mb-0.5">40% Academic Alignment</span>
                  <span className="text-[11px] text-[#6b7280]">Course, degree, and stream synergy with target industry role standards.</span>
                </div>
                <div className="rounded-xl bg-white border border-[#eee9df] p-3 shadow-xs">
                  <span className="font-bold text-[#27364b] block mb-0.5">40% Dynamic Aptitude</span>
                  <span className="text-[11px] text-[#6b7280]">Practical problem solving, technical logic, and work preferences from assessment quiz.</span>
                </div>
                <div className="rounded-xl bg-white border border-[#eee9df] p-3 shadow-xs">
                  <span className="font-bold text-[#27364b] block mb-0.5">20% Skillset Coverage</span>
                  <span className="text-[11px] text-[#6b7280]">Overlap between current documented skills and industry prerequisite tools.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State Card if Assessment is Pending */}
        {!hasAssessment && (
          <div className="rounded-[28px] border-2 border-dashed border-[#8a83d6]/40 bg-[#faf9ff] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eeedf8] px-3 py-1 text-xs font-bold text-[#5d56a5]">
                <Sparkles size={14} /> Action Required
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#27364b]">
                Unlock Your Precision Career Matches &amp; Verified Score
              </h2>
              <p className="text-xs sm:text-sm text-[#52607a] max-w-xl leading-relaxed">
                You have not completed your career assessment quiz yet. Take the 5-minute dynamic assessment to calibrate your academic profile, aptitude radar, and personalized 3-stage learning roadmap.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to="/assessment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#27364b] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#1d2b3d] transition"
              >
                <span>Take Career Assessment Now</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* AI Error Notification */}
        {aiError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <span>{aiError}</span>
            </div>
            <button
              type="button"
              onClick={() => setAiError('')}
              className="text-xs font-bold text-red-600 hover:underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* AI Insight Notification (If Triggered) */}
        {aiInsights && (
          <div className="rounded-[24px] border border-[#8a83d6]/40 bg-[#fbfaff] p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#eeedf8] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-[#8a83d6]" size={18} />
                <h3 className="text-sm font-bold text-[#27364b]">
                  AI Recommendations Engine ({aiInsights.engineType})
                </h3>
              </div>
              <span className="rounded-full bg-[#eeedf8] px-2.5 py-0.5 text-[11px] font-bold text-[#5d56a5]">
                {aiInsights.isAiPowered ? 'Live Model Output' : 'Transparent Rule-Based'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl bg-white border border-[#eee9df] p-3">
                <strong className="text-[#27364b] block mb-1">Key Strengths Identified:</strong>
                <ul className="space-y-1 text-[#52607a]">
                  {(aiInsights.strengths || []).map((s) => <li key={s}>• {s}</li>)}
                </ul>
              </div>
              <div className="rounded-xl bg-white border border-[#eee9df] p-3">
                <strong className="text-[#27364b] block mb-1">Areas to Focus Next:</strong>
                <ul className="space-y-1 text-[#52607a]">
                  {(aiInsights.weaknesses || []).map((w) => <li key={w}>• {w}</li>)}
                </ul>
              </div>
              <div className="rounded-xl bg-white border border-[#eee9df] p-3">
                <strong className="text-[#27364b] block mb-1">30-Day Action Strategy:</strong>
                <ul className="space-y-1 text-[#52607a]">
                  {(aiInsights.personalizedActionPlan || []).map((p) => <li key={p}>• {p}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Recommended Career Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-[#27364b]">Top Recommended Careers</h2>
              <p className="text-xs text-[#858e9c]">Matched to your academic stream, skills, and assessment responses</p>
            </div>
            <Link to="/explorer" className="text-xs font-bold text-[#5d56a5] hover:underline">
              View All Careers &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topCareers.map((career, idx) => (
              <div
                key={career.id || idx}
                className={`rounded-[24px] border p-6 flex flex-col justify-between transition shadow-sm ${
                  idx === 0
                    ? 'border-[#8a83d6] bg-white ring-2 ring-[#8a83d6]/25 shadow-md'
                    : 'border-[#ece7df] bg-white hover:border-[#8a83d6]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-md bg-[#eeedf8] px-2.5 py-0.5 text-xs font-bold text-[#5d56a5]">
                      #{idx + 1} Best Match
                    </span>
                    <span className="text-base font-black text-[#27364b]">{career.score}% Match</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#27364b]">{career.name}</h3>
                  <span className="text-xs text-[#858e9c] block mt-0.5">
                    {career.domain} · {career.salary}
                  </span>

                  <p className="mt-3 text-xs text-[#52607a] leading-relaxed line-clamp-3">
                    {career.reason || career.description}
                  </p>

                  {career.missingSkills && career.missingSkills.length > 0 && (
                    <div className="mt-3 rounded-xl bg-[#faf8f4] border border-[#f0ece4] p-2.5 text-xs">
                      <span className="text-[11px] font-bold text-[#b45309] block mb-1">
                        Skills to build:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {career.missingSkills.slice(0, 3).map((ms) => (
                          <span key={ms} className="rounded bg-white border border-[#e5e0d7] px-1.5 py-0.2 text-[10px] text-[#475467]">
                            {ms}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[#f1eee8] flex items-center justify-between">
                  <Link
                    to={`/career/${career.id}`}
                    className="text-xs font-bold text-[#5d56a5] hover:underline"
                  >
                    View Details &rarr;
                  </Link>
                  <Link
                    to="/roadmap"
                    className="rounded-lg bg-[#faf8f4] border border-[#e0dad0] px-2.5 py-1 text-xs font-semibold text-[#27364b] hover:bg-[#eeedf8] transition"
                  >
                    Roadmap
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#f1eee8] pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#27364b]">Aptitude Dimensions Radar</h3>
                <span className="text-xs text-[#858e9c]">Across technical, analytical, creative & business logic</span>
              </div>
              <span className="rounded-full bg-[#eeedf8] px-2.5 py-0.5 text-xs font-bold text-[#5d56a5]">
                Multi-axial
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e8e4dc" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#52607a', fontWeight: 600 }} />
                  <Radar dataKey="score" stroke="#27364b" fill="#8a83d6" fillOpacity={0.4} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#27364b', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Career Comparison Matrix */}
          <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#f1eee8] pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#27364b]">Career Comparison</h3>
                <span className="text-xs text-[#858e9c]">Side-by-side view of your top matches</span>
              </div>
              <span className="rounded-full bg-[#edf7f0] px-2.5 py-0.5 text-xs font-bold text-[#3c7a52]">
                Comparison
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#f0ece4] text-[#858e9c] font-bold uppercase tracking-wider">
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Match %</th>
                    <th className="pb-2">Salary Range</th>
                    <th className="pb-2">Core Tools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f7f5f0]">
                  {topCareers.map((c) => (
                    <tr key={c.id || c.name} className="hover:bg-[#fbfaf8]">
                      <td className="py-2.5 font-bold text-[#27364b]">{c.name}</td>
                      <td className="py-2.5">
                        <span className="rounded bg-[#eeedf8] px-2 py-0.5 font-bold text-[#5d56a5]">
                          {c.score}%
                        </span>
                      </td>
                      <td className="py-2.5 text-[#52607a] font-medium">{c.salary}</td>
                      <td className="py-2.5 text-[#858e9c] truncate max-w-[140px]">
                        {(c.tools || c.skills || []).slice(0, 2).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Strengths and Weaknesses summary */}
            <div className="mt-4 pt-4 border-t border-[#f1eee8] grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-[#faf8f4] p-3 border border-[#f0ece4]">
                <strong className="text-[#3c7a52] block mb-1">Top Strength:</strong>
                <p className="text-[#52607a]">{strengths[0] || 'Analytical Problem Solving'}</p>
              </div>
              <div className="rounded-xl bg-[#faf8f4] p-3 border border-[#f0ece4]">
                <strong className="text-[#8a83d6] block mb-1">Focus Skill:</strong>
                <p className="text-[#52607a]">{missingSkills[0] || 'Production Project Experience'}</p>
              </div>
            </div>

            <p className="mt-4 text-[10px] text-[#858e9c] italic">
              * Salary figures reflect aggregate Indian entry-level &amp; early career industry benchmarks (AmbitionBox, Glassdoor, PayScale 2024–2025). Actual packages depend on candidate proficiency, company tier, and location.
            </p>
          </div>
        </div>

        {/* Learning Roadmap Progress Tracker */}
        <div className="rounded-[28px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f1eee8] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="text-[#8a83d6]" size={20} />
                <h3 className="text-xl font-bold text-[#27364b]">
                  {primaryCareer.name} — Learning Progress Tracker
                </h3>
              </div>
              <p className="text-xs text-[#858e9c] mt-0.5">
                Check off completed milestones. Progress is persistently saved to your database account.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#27364b]">
                {completedCount} of {totalMilestones} Completed ({progressPercent}%)
              </span>
              <div className="w-28 h-2.5 rounded-full bg-[#e8e4dc] overflow-hidden">
                <div
                  className="h-full bg-[#8a83d6] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {roadmapMilestones.map((milestone) => {
              const isDone = completedMilestones.includes(milestone.id)
              return (
                <div
                  key={milestone.id}
                  onClick={() => handleToggleMilestone(milestone.id)}
                  className={`cursor-pointer rounded-2xl border p-5 transition relative select-none flex flex-col justify-between ${
                    isDone
                      ? 'border-[#3c7a52] bg-[#f2faf4] shadow-sm'
                      : 'border-[#eee9df] bg-[#fbfaf7] hover:border-[#8a83d6]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isDone ? 'bg-[#3c7a52] text-white' : 'bg-[#eeedf8] text-[#5d56a5]'
                        }`}
                      >
                        {milestone.stage} ({milestone.duration})
                      </span>
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-[#dcd7cd] text-[#3c7a52] focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <h4 className={`mt-3 text-sm font-bold ${isDone ? 'text-[#1e3a27] line-through' : 'text-[#27364b]'}`}>
                      {milestone.title}
                    </h4>
                    <p className="mt-1 text-xs text-[#687386] leading-relaxed">
                      {milestone.description}
                    </p>

                    {milestone.skillObjectives && milestone.skillObjectives.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[10px] font-bold uppercase text-[#858e9c] block mb-1">
                          Skill Objectives:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {milestone.skillObjectives.map((so) => (
                            <span
                              key={so}
                              className={`rounded px-1.5 py-0.5 text-[10px] border ${
                                isDone
                                  ? 'bg-white border-[#3c7a52]/30 text-[#2c5c3e]'
                                  : 'bg-white border-[#e5e0d7] text-[#52607a]'
                              }`}
                            >
                              ✓ {so}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-2 border-t border-[#f0ece4] text-[11px] font-semibold text-[#858e9c]">
                    {isDone ? '✓ Completed' : 'Click to mark complete'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Matched Internship & Job Opportunities */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-xl font-black text-[#27364b]">Recommended Internships &amp; Entry-Level Roles</h2>
              <p className="text-xs text-[#858e9c]">Verified opportunities matched to your target role and skills</p>
            </div>
            <span className="text-xs font-semibold text-[#858e9c]">Real Verified Platforms &amp; Official Campus Feeds</span>
          </div>

          {opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="rounded-[22px] border border-[#ece7df] bg-white p-5 flex flex-col justify-between shadow-sm hover:border-[#8a83d6] transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-md bg-[#eeedf8] px-2 py-0.5 text-[10px] font-bold text-[#5d56a5]">
                        {opp.category}
                      </span>
                      <span className="rounded bg-[#edf7f0] px-1.5 py-0.5 text-[10px] font-bold text-[#3c7a52]">
                        {opp.sourceType}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#27364b] leading-snug">{opp.title}</h3>
                    <span className="text-xs font-semibold text-[#52607a] block mt-1">{opp.company}</span>

                    <div className="mt-2 space-y-1 text-[11px] text-[#6b7280]">
                      <p><strong>Location:</strong> {opp.location}</p>
                      <p><strong>Comp:</strong> {opp.stipend || opp.salary}</p>
                      {opp.eligibility && (
                        <p className="line-clamp-2 text-[10px] text-[#858e9c]">
                          <strong>Eligibility:</strong> {opp.eligibility}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {(opp.skills || []).slice(0, 3).map((sk) => (
                        <span key={sk} className="rounded bg-[#faf8f4] border border-[#e5e0d7] px-1.5 py-0.5 text-[10px] text-[#475467]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f1eee8] flex items-center justify-between">
                    <span className="text-[11px] text-[#858e9c] font-medium">{opp.platform}</span>
                    <a
                      href={opp.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-[#27364b] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1d2b3d] transition cursor-pointer"
                    >
                      Apply <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#dcd7cd] p-8 text-center bg-white">
              <Compass className="mx-auto h-8 w-8 text-[#858e9c]" />
              <h3 className="mt-2 text-sm font-bold text-[#27364b]">No active openings matching current filter</h3>
              <p className="mt-1 text-xs text-[#858e9c]">
                Verified openings from Internshala, Unstop, and TCS update frequently. Explore related domains in the Career Explorer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default DashboardPage
