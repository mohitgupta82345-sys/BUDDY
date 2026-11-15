import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  ArrowRight,
  Search,
  Sparkles,
  Star,
  Target,
  X,
} from 'lucide-react'

export function ExplorerPage() {
  const { isAuthenticated } = useAuth()
  const [allCareers, setAllCareers] = useState([])
  const [savedCareerIds, setSavedCareerIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('All')
  const [selectedEducation, setSelectedEducation] = useState('All')
  const [selectedCareerId, setSelectedCareerId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const res = await api.careers.list()
        if (res.success && res.careers) {
          setAllCareers(res.careers)
          if (res.careers.length > 0) {
            setSelectedCareerId(res.careers[0].id)
          }
        }
        if (isAuthenticated) {
          const savedRes = await api.careers.getSaved().catch(() => ({ savedIds: [] }))
          setSavedCareerIds(savedRes.savedIds || [])
        }
      } catch (err) {
        console.error('Failed to load careers:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [isAuthenticated])

  const toggleSave = async (careerId) => {
    if (!isAuthenticated) {
      alert('Please sign in or create an account to save careers to your personal shortlist.')
      return
    }
    try {
      const res = await api.careers.save(careerId)
      if (res.success) {
        setSavedCareerIds((prev) =>
          res.saved ? [...prev, careerId] : prev.filter((id) => id !== careerId)
        )
      }
    } catch (err) {
      console.error('Error saving career:', err)
    }
  }

  const filteredCareers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query && selectedDomain === 'All' && selectedEducation === 'All' && showOnlyFeatured) {
      return allCareers.filter((c) => c.featured).slice(0, 6)
    }

    return allCareers.filter((c) => {
      const searchableText = [
        c.name,
        c.domain,
        c.description,
        c.degree.join(' '),
        c.streams.join(' '),
        c.skills.join(' '),
        c.tags.join(' '),
        c.tools.join(' '),
      ].join(' ').toLowerCase()

      const matchesSearch = !query || searchableText.includes(query)
      const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain
      const matchesEducation = selectedEducation === 'All' || c.educationLevel === selectedEducation

      return matchesSearch && matchesDomain && matchesEducation
    })
  }, [allCareers, searchTerm, selectedDomain, selectedEducation, showOnlyFeatured])

  const activeCareer = allCareers.find((c) => c.id === selectedCareerId) || filteredCareers[0] || allCareers[0]

  const domains = useMemo(() => {
    return ['All', ...new Set(allCareers.map((c) => c.domain))]
  }, [allCareers])

  const educationLevels = useMemo(() => {
    return ['All', ...new Set(allCareers.map((c) => c.educationLevel))]
  }, [allCareers])

  return (
    <section className="page-panel explorer-panel min-h-[85vh]">
      <div className="section-heading compact-heading">
        <span className="section-label">CAREER EXPLORER</span>
        <h2>Search & Discover Careers Across Every Stream</h2>
        <p className="text-sm text-[#858e9c] max-w-2xl">
          Browse technical, business, design, engineering, healthcare, and finance pathways with verified skills, salary ranges, and academic eligibility.
        </p>
      </div>

      <div className="explorer-toolbar mt-4">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              if (e.target.value.trim()) setShowOnlyFeatured(false)
            }}
            placeholder="Search by career, course (BCA, BBA, B.Com, B.Tech), skill, or branch..."
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-[#858e9c] hover:text-[#27364b] mr-2"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="ghost-button text-xs py-2 px-3"
          onClick={() => {
            setSearchTerm('')
            setSelectedDomain('All')
            setSelectedEducation('All')
            setShowOnlyFeatured(true)
          }}
        >
          Reset Filters
        </button>
      </div>

      <div className="filter-row flex flex-wrap items-center gap-3 mt-3">
        <select
          value={selectedDomain}
          onChange={(e) => {
            setSelectedDomain(e.target.value)
            setShowOnlyFeatured(false)
          }}
          className="rounded-xl border border-[#e0dad0] bg-white py-2 px-3 text-xs font-semibold text-[#27364b]"
        >
          {domains.map((d) => (
            <option key={d} value={d}>
              Domain: {d}
            </option>
          ))}
        </select>

        <select
          value={selectedEducation}
          onChange={(e) => {
            setSelectedEducation(e.target.value)
            setShowOnlyFeatured(false)
          }}
          className="rounded-xl border border-[#e0dad0] bg-white py-2 px-3 text-xs font-semibold text-[#27364b]"
        >
          {educationLevels.map((lvl) => (
            <option key={lvl} value={lvl}>
              Education: {lvl}
            </option>
          ))}
        </select>

        {!searchTerm && selectedDomain === 'All' && selectedEducation === 'All' && (
          <button
            type="button"
            onClick={() => setShowOnlyFeatured((prev) => !prev)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
              showOnlyFeatured
                ? 'bg-[#eeedf8] text-[#5d56a5]'
                : 'bg-[#27364b] text-white'
            }`}
          >
            {showOnlyFeatured ? 'Showing 6 Featured (Click to view all)' : 'Viewing Full Database'}
          </button>
        )}
      </div>

      <div className="search-suggestions flex flex-wrap gap-2 mt-3">
        {['BCA', 'BBA', 'B.Com', 'B.Tech', 'AI Engineer', 'Data Analyst', 'UI/UX', 'Finance', 'Civil', 'Marketing'].map(
          (suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setSearchTerm(suggestion)
                setShowOnlyFeatured(false)
              }}
              className="rounded-lg border border-[#e6e2da] bg-[#faf8f4] px-2.5 py-1 text-xs font-medium text-[#52607a] hover:bg-[#eeedf8] hover:text-[#5d56a5] transition"
            >
              {suggestion}
            </button>
          )
        )}
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex h-10 w-10 animate-spin items-center justify-center rounded-xl bg-[#eeedf8] text-[#8a83d6]">
            <Sparkles size={20} />
          </div>
        </div>
      ) : (
        <div className="explorer-layout mt-6">
          <div className="career-grid explorer-grid">
            {filteredCareers.length > 0 ? (
              filteredCareers.map((career, index) => {
                const isSelected = activeCareer?.id === career.id
                const isSaved = savedCareerIds.includes(career.id)
                return (
                  <div
                    key={career.id}
                    className={`career-card explorer-card ${isSelected ? 'active ring-2 ring-[#8a83d6]' : ''}`}
                  >
                    <button
                      type="button"
                      className="card-select w-full text-left"
                      onClick={() => setSelectedCareerId(career.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#8a83d6]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {career.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#fdf5e6] px-2 py-0.5 text-[10px] font-bold text-[#b45309]">
                            <Star size={10} /> Featured
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 font-bold text-[#27364b]">{career.name}</h3>
                      <p className="mt-1 text-xs text-[#687386] line-clamp-2">{career.description}</p>
                      <div className="career-meta-row mt-3 flex items-center justify-between text-xs">
                        <span className="rounded bg-[#f0eee9] px-2 py-0.5 font-medium text-[#4b5563]">
                          {career.domain}
                        </span>
                        <strong className="text-[#27364b]">{career.salary}</strong>
                      </div>
                    </button>

                    <div className="career-card-actions mt-3 pt-3 border-t border-[#f0ece4] flex items-center justify-between">
                      <Link to={`/career/${career.id}`} className="text-link text-xs font-bold text-[#5d56a5] hover:underline">
                        Full details &rarr;
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleSave(career.id)}
                        className={`save-button text-xs py-1 px-2.5 rounded-lg ${
                          isSaved ? 'bg-[#27364b] text-white active' : 'bg-[#eeedf8] text-[#5d56a5]'
                        }`}
                      >
                        {isSaved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-2 rounded-2xl border border-dashed border-[#dcd7cd] p-10 text-center">
                <Target className="mx-auto h-8 w-8 text-[#858e9c]" />
                <h3 className="mt-2 text-base font-bold text-[#27364b]">No matching careers found</h3>
                <p className="mt-1 text-xs text-[#858e9c]">
                  Try searching with broader terms like &quot;Technology&quot;, &quot;BCA&quot;, or &quot;Design&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedDomain('All')
                    setSelectedEducation('All')
                    setShowOnlyFeatured(true)
                  }}
                  className="mt-4 rounded-xl bg-[#27364b] px-4 py-2 text-xs font-semibold text-white"
                >
                  Clear all search filters
                </button>
              </div>
            )}
          </div>

          {activeCareer && (
            <aside className="career-detail-panel rounded-[24px] border border-[#ece7df] bg-white p-6 shadow-sm">
              <div className="detail-header flex items-start justify-between">
                <div>
                  <span className="section-label text-xs">CAREER PREVIEW</span>
                  <h3 className="text-2xl font-black text-[#27364b]">{activeCareer.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="rounded-md bg-[#eeedf8] px-2 py-0.5 text-xs font-bold text-[#5d56a5]">
                      {activeCareer.domain}
                    </span>
                    <span className="text-xs font-semibold text-[#27364b]">{activeCareer.salary}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSave(activeCareer.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                    savedCareerIds.includes(activeCareer.id)
                      ? 'bg-[#27364b] text-white'
                      : 'border border-[#dfe3e8] bg-transparent text-[#27364b] hover:bg-[#f8f7f2]'
                  }`}
                >
                  {savedCareerIds.includes(activeCareer.id) ? 'Shortlisted' : '+ Shortlist'}
                </button>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-[#52607a] leading-relaxed">
                {activeCareer.description}
              </p>

              <div className="detail-block mt-4 pt-3 border-t border-[#f1eee8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#858e9c] mb-1.5">
                  Academic Eligibility
                </h4>
                <div className="space-y-1 text-xs text-[#27364b]">
                  <p><strong>Level:</strong> {activeCareer.educationLevel}</p>
                  <p><strong>Degrees:</strong> {activeCareer.degree.join(' · ')}</p>
                  <p><strong>Streams:</strong> {activeCareer.streams.join(' · ')}</p>
                </div>
              </div>

              <div className="detail-block mt-4 pt-3 border-t border-[#f1eee8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#858e9c] mb-1.5">
                  Key Skills & Tools
                </h4>
                <div className="chip-row flex flex-wrap gap-1.5">
                  {activeCareer.skills.map((skill) => (
                    <span key={skill} className="rounded-md bg-[#faf8f4] border border-[#e5e0d7] px-2 py-1 text-xs font-semibold text-[#27364b]">
                      {skill}
                    </span>
                  ))}
                  {activeCareer.tools.map((tool) => (
                    <span key={tool} className="rounded-md bg-[#eeedf8] px-2 py-1 text-xs font-semibold text-[#5d56a5]">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-block mt-4 pt-3 border-t border-[#f1eee8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#858e9c] mb-1.5">
                  3-Stage Learning Roadmap
                </h4>
                <div className="space-y-2">
                  {(activeCareer.learningRoadmap || []).map((step) => (
                    <div key={step.id} className="rounded-xl bg-[#fbfaf7] p-2.5 border border-[#ede9e1]">
                      <div className="flex items-center justify-between text-xs font-bold text-[#27364b]">
                        <span>{step.stage}: {step.title}</span>
                        <span className="text-[10px] text-[#8a83d6]">{step.duration}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#6b7280]">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#f1eee8]">
                <Link
                  to={`/career/${activeCareer.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#27364b] py-2.5 text-xs font-semibold text-white transition hover:bg-[#1d2b3d]"
                >
                  Explore Complete Career Blueprint <ArrowRight size={14} />
                </Link>
              </div>
            </aside>
          )}
        </div>
      )}
    </section>
  )
}
export default ExplorerPage
