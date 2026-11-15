import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Cpu,
  Layers3,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

export function CareerDetailPage() {
  const { careerId } = useParams()
  const { isAuthenticated } = useAuth()
  const [career, setCareer] = useState(null)
  const [relatedCareers, setRelatedCareers] = useState([])
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCareer() {
      setIsLoading(true)
      try {
        const res = await api.careers.get(careerId)
        if (res.success && res.career) {
          setCareer(res.career)
          const allRes = await api.careers.list({ domain: res.career.domain })
          if (allRes.success && allRes.careers) {
            setRelatedCareers(allRes.careers.filter((c) => c.id !== res.career.id).slice(0, 4))
          }
        }
        if (isAuthenticated) {
          const savedRes = await api.careers.getSaved().catch(() => ({ savedIds: [] }))
          setIsSaved((savedRes.savedIds || []).includes(careerId))
        }
      } catch (err) {
        console.error('Error loading career details:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadCareer()
  }, [careerId, isAuthenticated])

  const toggleSave = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to save this career to your personal shortlist.')
      return
    }
    try {
      const res = await api.careers.save(careerId)
      if (res.success) {
        setIsSaved(res.saved)
      }
    } catch (err) {
      console.error('Error toggling career:', err)
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

  if (!career) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="text-2xl font-bold text-[#27364b]">Career Path Not Found</h2>
        <p className="mt-2 text-sm text-[#858e9c]">The career you requested does not exist in our database.</p>
        <Link to="/explorer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#27364b] px-4 py-2 text-xs font-semibold text-white">
          <ArrowLeft size={14} /> Return to Explorer
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2] py-8 px-4 sm:px-6 lg:px-8 text-[#27364b]">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link to="/explorer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#858e9c] hover:text-[#27364b] transition">
          <ArrowLeft size={14} /> Back to Career Explorer
        </Link>

        {/* Hero Card */}
        <div className="rounded-[28px] border border-[#ece7df] bg-white p-6 sm:p-10 shadow-[0_15px_40px_rgba(39,54,75,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-[#eeedf8] px-3 py-1 text-xs font-bold text-[#5d56a5]">
                  {career.domain}
                </span>
                <span className="rounded-full bg-[#edf7f0] px-3 py-1 text-xs font-bold text-[#3c7a52]">
                  {career.salary}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#27364b]">{career.name}</h1>
              <p className="mt-2 text-sm sm:text-base text-[#52607a] max-w-3xl leading-relaxed">
                {career.description}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={toggleSave}
                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-semibold transition ${
                  isSaved
                    ? 'bg-[#27364b] text-white shadow-sm'
                    : 'border border-[#dfe3e8] bg-transparent text-[#27364b] hover:bg-[#f8f7f2]'
                }`}
              >
                {isSaved ? 'Saved in Shortlist' : '+ Shortlist Career'}
              </button>
              <Link
                to="/assessment"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#8a83d6] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#7871c9]"
              >
                Check Compatibility <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl bg-[#faf8f4] p-4 border border-[#eee9df]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858e9c]">Education Level</span>
              <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#27364b]">{career.educationLevel}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858e9c]">Eligible Degrees</span>
              <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#27364b]">{career.degree.slice(0, 3).join(', ')}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858e9c]">Entry Compensation</span>
              <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#27364b]">{career.salary}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858e9c]">Industry Domain</span>
              <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#27364b]">{career.domain}</p>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 text-base font-bold text-[#27364b]">
              <Briefcase className="text-[#8a83d6]" size={18} />
              <span>Core Day-to-Day Responsibilities</span>
            </div>
            <ul className="mt-4 space-y-3">
              {(career.responsibilities || []).map((resp) => (
                <li key={resp} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#52607a]">
                  <CheckCircle2 size={16} className="text-[#8a83d6] shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 text-base font-bold text-[#27364b]">
              <Cpu className="text-[#8a83d6]" size={18} />
              <span>Required Skills & Industry Tools</span>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#858e9c]">Essential Technical & Functional Skills:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(career.skills || []).map((sk) => (
                    <span key={sk} className="rounded-lg bg-[#faf8f4] border border-[#e2ddd4] px-2.5 py-1 text-xs font-semibold text-[#27364b]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#858e9c]">Tools, Frameworks & Software:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(career.tools || []).map((tl) => (
                    <span key={tl} className="rounded-lg bg-[#eeedf8] px-2.5 py-1 text-xs font-semibold text-[#5d56a5]">
                      {tl}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#858e9c]">Soft Skills for Success:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(career.softSkills || []).map((ss) => (
                    <span key={ss} className="rounded-lg bg-[#edf7f0] px-2.5 py-1 text-xs font-medium text-[#3c7a52]">
                      {ss}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Roadmap Breakdown */}
        <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 text-base font-bold text-[#27364b]">
            <BookOpen className="text-[#8a83d6]" size={18} />
            <span>Structured Step-by-Step Learning Roadmap</span>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {(career.learningRoadmap || []).map((milestone, idx) => (
              <div key={milestone.id} className="rounded-2xl border border-[#eee9df] bg-[#fbfaf7] p-5 relative">
                <span className="absolute top-4 right-4 text-2xl font-black text-[#8a83d6]/20">
                  0{idx + 1}
                </span>
                <span className="inline-block rounded-md bg-[#eeedf8] px-2 py-0.5 text-[10px] font-bold text-[#5d56a5] uppercase tracking-wider">
                  {milestone.stage} ({milestone.duration})
                </span>
                <h4 className="mt-2 text-sm font-bold text-[#27364b]">{milestone.title}</h4>
                <p className="mt-1.5 text-xs text-[#687386] leading-relaxed">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Real-World Projects & Progression */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 text-base font-bold text-[#27364b]">
              <Layers3 className="text-[#8a83d6]" size={18} />
              <span>Recommended Portfolio Projects</span>
            </div>
            <div className="mt-4 space-y-3">
              {(career.projects || []).map((proj, i) => (
                <div key={proj} className="rounded-xl border border-[#f0ece4] bg-[#faf8f4] p-3 text-xs sm:text-sm text-[#27364b]">
                  <strong className="text-[#8a83d6] mr-2">Project {i + 1}:</strong>
                  <span>{proj}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 text-base font-bold text-[#27364b]">
              <TrendingUp className="text-[#8a83d6]" size={18} />
              <span>Career Hierarchy & Progression</span>
            </div>
            <div className="mt-4 space-y-2">
              {(career.careerPath || []).map((lvl, idx) => (
                <div key={lvl} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#27364b] text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#27364b]">{lvl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Careers */}
        {relatedCareers.length > 0 && (
          <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#858e9c] mb-4">
              Related Pathways in {career.domain}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {relatedCareers.map((rc) => (
                <Link
                  key={rc.id}
                  to={`/career/${rc.id}`}
                  className="rounded-xl border border-[#ece7df] bg-[#faf8f4] p-3 hover:border-[#8a83d6] transition group"
                >
                  <strong className="block text-xs font-bold text-[#27364b] group-hover:text-[#5d56a5]">
                    {rc.name}
                  </strong>
                  <span className="text-[11px] text-[#858e9c]">{rc.salary}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default CareerDetailPage
