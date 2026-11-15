import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowRight,
  CheckCircle2,
  Download,
  LayoutDashboard,
  RotateCcw,
  Sparkles,
  Target,
  AlertTriangle,
} from 'lucide-react'

export function ResultsPage() {
  const { profile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [resultsData, setResultsData] = useState(location.state?.results || null)
  const [isLoading, setIsLoading] = useState(!location.state?.results)

  useEffect(() => {
    async function fetchLatest() {
      if (resultsData) return
      setIsLoading(true)
      try {
        const res = await api.assessment.getLatest()
        if (res.success && res.assessment) {
          const topCareers = typeof res.assessment.top_careers === 'string'
            ? JSON.parse(res.assessment.top_careers)
            : res.assessment.top_careers

          const radarData = typeof res.assessment.radar_data === 'string'
            ? JSON.parse(res.assessment.radar_data)
            : res.assessment.radar_data

          setResultsData({
            readinessScore: res.assessment.readiness_score,
            topCareers,
            strengths: res.assessment.strengths,
            weaknesses: res.assessment.weaknesses,
            missingSkills: res.assessment.missing_skills,
            radarData,
          })
        } else {
          navigate('/assessment', { replace: true })
        }
      } catch (err) {
        console.error('Error fetching results:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLatest()
  }, [resultsData, navigate])

  if (isLoading || !resultsData) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-2xl bg-[#eeedf8] text-[#8a83d6]">
          <Sparkles size={24} />
        </div>
        <p className="text-sm font-medium text-[#858e9c]">Loading your assessment results...</p>
      </div>
    )
  }

  const {
    readinessScore = 80,
    topCareers = [],
    strengths = [],
    weaknesses = [],
    missingSkills = [],
    radarData = [],
  } = resultsData

  const primaryCareer = topCareers[0] || {}

  const barChartData = [
    { name: 'Core Match', score: primaryCareer.score || 85 },
    { name: 'Academic Fit', score: Math.min(96, (primaryCareer.score || 85) + 3) },
    { name: 'Readiness', score: readinessScore },
    { name: 'Growth Room', score: Math.max(30, 100 - readinessScore) },
  ]

  const handleDownloadPlan = () => {
    const studentName = profile?.full_name || 'Student'
    const plan = [
      '====================================================',
      'BUDDY CAREER COMPANION — PERSONALIZED ACTION PLAN',
      '====================================================',
      `Student Name: ${studentName}`,
      `Academic Degree: ${profile?.degree || 'Undergraduate'} (${profile?.branch || 'General'})`,
      `Overall Career Readiness Score: ${readinessScore}%`,
      '',
      'TOP RECOMMENDED CAREER PATHWAYS:',
      ...topCareers.map((c, i) => `${i + 1}. ${c.name} — ${c.score}% Match (${c.salary})\n   Why: ${c.reason}\n   Missing Skills: ${(c.missingSkills || []).slice(0, 3).join(', ')}`),
      '',
      'IDENTIFIED CORE STRENGTHS:',
      ...strengths.map((s) => `- ${s}`),
      '',
      'GROWTH & FOCUS OPPORTUNITIES:',
      ...weaknesses.map((w) => `- ${w}`),
      '',
      'ACTIONABLE 30-DAY LEARNING ROADMAP:',
      `1. Focus on mastering: ${(missingSkills || []).slice(0, 2).join(' and ')}.`,
      `2. Build a foundational portfolio project for ${primaryCareer.name || 'your primary match'}.`,
      `3. Apply for verified fresher internships on the BUDDY platform.`,
      `4. Review and update your skills checklist on the BUDDY Dashboard.`,
      '',
      `Generated on: ${new Date().toLocaleDateString()} via BUDDY Platform`,
      '====================================================',
    ].join('\n')

    const blob = new Blob([plan], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `buddy-career-plan-${(primaryCareer.name || 'career').toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const studentDisplayName = profile?.full_name || 'Student'

  return (
    <div className="min-h-screen bg-[#f8f7f2] py-8 px-4 sm:px-6 lg:px-8 text-[#27364b]">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] border border-[#ece7df] bg-white p-6 sm:p-10 shadow-[0_15px_40px_rgba(39,54,75,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eeedf8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#5d56a5]">
                <Sparkles size={14} /> Official Assessment Results
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#27364b]">
                {studentDisplayName}, your strongest direction is{' '}
                <span className="text-[#8a83d6]">{primaryCareer.name}</span>.
              </h1>
              <p className="mt-2 text-sm text-[#52607a] max-w-2xl leading-relaxed">
                Based on your aptitude responses, degree background in {profile?.degree || 'your field'}, and working preferences, here is your transparent career blueprint.
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              <div className="rounded-2xl bg-[#faf8f4] border border-[#eee9df] p-4 text-center min-w-[140px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#858e9c]">
                  Readiness Score
                </span>
                <div className="text-3xl font-black text-[#27364b] mt-0.5">{readinessScore}%</div>
                <span className="text-[10px] font-semibold text-[#3c7a52] bg-[#edf7f0] px-2 py-0.5 rounded-full inline-block mt-1">
                  High Potential
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 rounded-xl bg-[#27364b] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1d2b3d] transition"
                >
                  <LayoutDashboard size={14} /> View Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleDownloadPlan}
                  className="flex items-center gap-1.5 rounded-xl border border-[#dfe3e8] bg-white px-3 py-2 text-xs font-semibold text-[#27364b] hover:bg-[#f8f7f2] transition"
                >
                  <Download size={14} /> Action Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-[#27364b]">Top 3 Career Recommendations</h2>
              <p className="text-xs text-[#858e9c]">Ranked by transparent compatibility weighting</p>
            </div>
            <Link to="/explorer" className="text-xs font-bold text-[#5d56a5] hover:underline">
              Explore All 20+ Careers &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topCareers.map((career, idx) => (
              <div
                key={career.id || idx}
                className={`rounded-[24px] border p-6 flex flex-col justify-between transition shadow-sm ${
                  idx === 0
                    ? 'border-[#8a83d6] bg-white ring-2 ring-[#8a83d6]/30 shadow-md'
                    : 'border-[#ece7df] bg-white hover:border-[#8a83d6]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-md bg-[#eeedf8] px-2.5 py-0.5 text-xs font-bold text-[#5d56a5]">
                      Rank #{idx + 1}
                    </span>
                    <span className="text-lg font-black text-[#27364b]">{career.score}% Match</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#27364b] mt-1">{career.name}</h3>
                  <span className="text-xs font-semibold text-[#858e9c] block mt-0.5">
                    {career.domain} · {career.salary}
                  </span>

                  <p className="mt-3 text-xs text-[#52607a] leading-relaxed">
                    {career.reason || career.description}
                  </p>

                  {career.missingSkills && career.missingSkills.length > 0 && (
                    <div className="mt-4 rounded-xl bg-[#faf8f4] border border-[#f0ece4] p-3 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#b45309] mb-1">
                        <AlertTriangle size={13} />
                        <span>Missing Skills to Learn:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {career.missingSkills.slice(0, 3).map((ms) => (
                          <span key={ms} className="rounded bg-white border border-[#e5e0d7] px-1.5 py-0.5 text-[11px] text-[#475467]">
                            {ms}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#f1eee8] flex items-center justify-between">
                  <Link
                    to={`/career/${career.id}`}
                    className="text-xs font-bold text-[#5d56a5] hover:underline"
                  >
                    View Career Blueprint &rarr;
                  </Link>
                  <Link
                    to={`/roadmap`}
                    className="rounded-lg bg-[#faf8f4] border border-[#e0dad0] px-2.5 py-1 text-xs font-semibold text-[#27364b] hover:bg-[#eeedf8] transition"
                  >
                    Roadmap
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#f1eee8] pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#27364b]">Career Aptitude Profile</h3>
                <span className="text-xs text-[#858e9c]">Evaluation across 6 professional dimensions</span>
              </div>
              <span className="rounded-full bg-[#eeedf8] px-2.5 py-0.5 text-xs font-bold text-[#5d56a5]">
                Radar Analysis
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

          <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#f1eee8] pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#27364b]">Readiness & Potential Breakdown</h3>
                <span className="text-xs text-[#858e9c]">Benchmark scores for {primaryCareer.name}</span>
              </div>
              <span className="rounded-full bg-[#edf7f0] px-2.5 py-0.5 text-xs font-bold text-[#3c7a52]">
                Compatibility
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1eee8" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#52607a' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#52607a' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#27364b', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="score" fill="#8a83d6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold text-[#27364b] flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} className="text-[#3c7a52]" />
              <span>Demonstrated Strengths</span>
            </h3>
            <ul className="space-y-2.5">
              {strengths.map((str) => (
                <li key={str} className="flex items-center gap-2 text-xs sm:text-sm text-[#52607a] rounded-xl bg-[#faf8f4] p-3 border border-[#f0ece4]">
                  <span className="h-2 w-2 rounded-full bg-[#3c7a52]" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold text-[#27364b] flex items-center gap-2 mb-3">
              <Target size={18} className="text-[#8a83d6]" />
              <span>Recommended Growth Areas</span>
            </h3>
            <ul className="space-y-2.5">
              {weaknesses.map((wk) => (
                <li key={wk} className="flex items-center gap-2 text-xs sm:text-sm text-[#52607a] rounded-xl bg-[#faf8f4] p-3 border border-[#f0ece4]">
                  <span className="h-2 w-2 rounded-full bg-[#8a83d6]" />
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-[24px] bg-[#27364b] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Ready to track your learning journey?</h3>
            <p className="text-xs sm:text-sm text-[#bac0cf] mt-1">
              Your personalized dashboard has all your charts, saved careers, skill gaps, and milestone progress.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/assessment"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition"
            >
              <RotateCcw size={13} className="inline mr-1" /> Retake Quiz
            </Link>
            <Link
              to="/dashboard"
              className="rounded-xl bg-[#8a83d6] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#7871c9] transition flex items-center gap-1.5"
            >
              Go to Dashboard <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ResultsPage
