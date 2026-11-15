import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Sparkles } from 'lucide-react'

export function SkillGapPage() {
  const { profile } = useAuth()
  const [careers, setCareers] = useState([])
  const [selectedCareerId, setSelectedCareerId] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const res = await api.careers.list()
        if (res.success && res.careers) {
          setCareers(res.careers)
          if (res.careers.length > 0) {
            setSelectedCareerId(res.careers[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to load careers for skill gap:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

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
  const userSkills = (profile?.skills || []).map((s) => s.toLowerCase().trim())

  const analysis = (selectedCareer?.skills || []).map((skill) => {
    const isMatched = userSkills.some(
      (us) => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us)
    )
    return {
      skill,
      status: isMatched ? 'Matched Strength' : 'Missing Skill Gap',
      matched: isMatched,
      recommendation: isMatched
        ? 'Your existing knowledge aligns well. Deepen with advanced real-world implementations.'
        : 'High priority skill to learn before applying to entry-level roles in this path.',
    }
  })

  const matchedCount = analysis.filter((a) => a.matched).length
  const totalCount = analysis.length
  const matchPercent = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-[#f8f7f2] py-8 px-4 sm:px-6 lg:px-8 text-[#27364b]">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="section-heading compact-heading">
          <span className="section-label">SKILL GAP ANALYZER</span>
          <h2>Measure Your Skill Readiness Against Any Career</h2>
          <p className="text-sm text-[#858e9c]">
            Compare your active profile skills with the industry prerequisites for target roles.
          </p>
        </div>

        <div className="rounded-[24px] border border-[#ece7df] bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label htmlFor="skillgap-career" className="block text-xs font-bold text-[#475467] mb-1">
              Select Career Focus:
            </label>
            <select
              id="skillgap-career"
              value={selectedCareerId}
              onChange={(e) => setSelectedCareerId(e.target.value)}
              className="rounded-xl border border-[#e0dad0] bg-[#faf8f4] py-2.5 px-3 text-sm font-semibold text-[#27364b] outline-none focus:border-[#8a83d6]"
            >
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.domain})
                </option>
              ))}
            </select>
          </div>

          {selectedCareer && (
            <div className="flex items-center gap-4 bg-[#faf8f4] p-3 rounded-2xl border border-[#eee9df]">
              <div>
                <span className="text-[10px] font-bold text-[#858e9c] uppercase">Skill Coverage</span>
                <p className="text-base font-black text-[#27364b]">{matchedCount} of {totalCount} Skills ({matchPercent}%)</p>
              </div>
              <div className="w-24 h-2 rounded-full bg-[#e8e4dc] overflow-hidden">
                <div className="h-full bg-[#8a83d6]" style={{ width: `${matchPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.map((item) => (
            <div
              key={item.skill}
              className={`rounded-[22px] border p-5 transition shadow-sm ${
                item.matched
                  ? 'border-[#cce8d5] bg-[#f7fbf8]'
                  : 'border-[#fae3c6] bg-[#fffaf5]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#27364b]">{item.skill}</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    item.matched
                      ? 'bg-[#edf7f0] text-[#3c7a52]'
                      : 'bg-[#fef3c7] text-[#b45309]'
                  }`}
                >
                  {item.matched ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-[#52607a] leading-relaxed">{item.recommendation}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-[#ece7df] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 mb-4">
            <BookOpen className="text-[#8a83d6]" size={18} />
            <h3 className="text-base font-bold text-[#27364b]">
              Recommended Learning Resources for {selectedCareer?.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#eee9df] bg-[#faf8f4] p-4 text-xs">
              <strong className="text-[#27364b] block mb-1">Foundational Courses:</strong>
              <p className="text-[#687386] mb-3">Coursera & edX university verified specializations.</p>
              <a
                href="https://www.coursera.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-[#5d56a5] hover:underline"
              >
                Browse Coursera <ExternalLink size={11} />
              </a>
            </div>

            <div className="rounded-xl border border-[#eee9df] bg-[#faf8f4] p-4 text-xs">
              <strong className="text-[#27364b] block mb-1">Free Coding & Practical Labs:</strong>
              <p className="text-[#687386] mb-3">freeCodeCamp, Harvard CS50 & Kaggle micro-courses.</p>
              <a
                href="https://www.freecodecamp.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-[#5d56a5] hover:underline"
              >
                Explore freeCodeCamp <ExternalLink size={11} />
              </a>
            </div>

            <div className="rounded-xl border border-[#eee9df] bg-[#faf8f4] p-4 text-xs">
              <strong className="text-[#27364b] block mb-1">National NPTEL / SWAYAM:</strong>
              <p className="text-[#687386] mb-3">Indian government & IIT approved course tracks.</p>
              <a
                href="https://nptel.ac.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-[#5d56a5] hover:underline"
              >
                Visit NPTEL <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SkillGapPage
