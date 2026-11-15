import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, BookOpen, Check, Compass, GraduationCap, Sparkles, Target, X, AlertCircle } from 'lucide-react'

const DEGREE_OPTIONS = [
  'BCA (Bachelor of Computer Applications)',
  'B.Tech / B.E (Engineering)',
  'BBA (Bachelor of Business Administration)',
  'B.Com (Bachelor of Commerce)',
  'B.Sc (Bachelor of Science)',
  'B.A (Bachelor of Arts)',
  'B.Des (Bachelor of Design)',
  'B.Pharm (Bachelor of Pharmacy)',
  'MCA (Master of Computer Applications)',
  'MBA (Master of Business Administration)',
  'Diploma / Polytechnic',
  'Other Bachelor / Master Course',
]

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year / Final Year', 'Recent Graduate / Fresher']

const POPULAR_SKILLS = [
  'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Data Analysis',
  'Machine Learning', 'Excel', 'Power BI', 'Financial Modeling', 'Figma',
  'SEO', 'Content Writing', 'Public Speaking', 'Git', 'AutoCAD', 'Problem Solving',
  'Process Mapping', 'Market Research', 'Cybersecurity', 'Cloud / AWS',
]

const POPULAR_INTERESTS = [
  'Artificial Intelligence', 'Software Development', 'Data & Analytics',
  'Product Management', 'UI/UX Design', 'Corporate Finance', 'Digital Marketing',
  'Human Resources', 'Robotics & Hardware', 'Core Engineering', 'Healthcare & Life Sciences',
  'Public Policy & Social Impact', 'Startups & Entrepreneurship',
]

export function OnboardingPage() {
  const { user, profile, completeOnboarding } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(profile?.full_name || user?.name || '')
  const [college, setCollege] = useState(profile?.college || '')
  const [degree, setDegree] = useState(profile?.degree || 'BCA (Bachelor of Computer Applications)')
  const [branch, setBranch] = useState(profile?.branch || 'Computer Science')
  const [currentYear, setCurrentYear] = useState(profile?.current_year || '1st Year')
  const [skills, setSkills] = useState(profile?.skills || ['Python', 'Problem Solving'])
  const [customSkill, setCustomSkill] = useState('')
  const [interests, setInterests] = useState(profile?.interests || ['Artificial Intelligence', 'Software Development'])
  const [careerGoals, setCareerGoals] = useState(
    profile?.career_goals || 'I want a clear, realistic career path that matches my strengths and shows what skills to learn next.'
  )
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const addCustomSkill = (e) => {
    e.preventDefault()
    if (!customSkill.trim()) return
    const cleaned = customSkill.trim()
    if (!skills.includes(cleaned)) {
      setSkills((prev) => [...prev, cleaned])
    }
    setCustomSkill('')
  }

  const removeSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove))
  }

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!fullName.trim()) {
      setError('Please provide your full name.')
      return
    }

    if (!degree.trim() || !branch.trim()) {
      setError('Please select your degree/course and stream.')
      return
    }

    setIsSubmitting(true)
    try {
      // Extract shorthand degree code
      const degreeCode = degree.split(' ')[0]

      await completeOnboarding({
        fullName: fullName.trim(),
        college: college.trim(),
        degree: degreeCode,
        branch: branch.trim(),
        currentYear,
        skills,
        interests,
        careerGoals: careerGoals.trim(),
      })

      // Prompt to take assessment quiz
      navigate('/assessment', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to save student profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2] py-12 px-4 sm:px-6 lg:px-8 text-[#27364b]">
      <div className="mx-auto max-w-3xl">
        {/* Onboarding Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eeedf8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#5d56a5]">
            <Sparkles size={14} /> Step 1 of 2: Student Onboarding
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#27364b]">
            Let&apos;s build your student profile
          </h1>
          <p className="mt-2 text-sm text-[#858e9c] max-w-xl mx-auto">
            BUDDY personalizes your career recommendations, assessment quiz questions, and learning roadmaps based on your educational background.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Onboarding Form Card */}
        <form onSubmit={handleSubmit} className="space-y-8 rounded-[24px] border border-[#ece7df] bg-white p-6 sm:p-10 shadow-[0_15px_40px_rgba(39,54,75,0.06)]">
          {/* Section 1: Academic Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 text-base font-bold text-[#27364b]">
              <GraduationCap className="text-[#8a83d6]" size={20} />
              <span>Academic Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  required
                  className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2.5 px-3.5 text-sm outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1.5">
                  College / University
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Delhi University / IIT / Christ University"
                  className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2.5 px-3.5 text-sm outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1.5">
                  Degree / Course <span className="text-red-500">*</span>
                </label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2.5 px-3 text-xs sm:text-sm outline-none transition focus:border-[#8a83d6]"
                >
                  {DEGREE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1.5">
                  Branch / Stream <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="e.g. Computer Science, Finance, Arts"
                  required
                  className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2.5 px-3.5 text-sm outline-none transition focus:border-[#8a83d6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1.5">
                  Current Year of Study
                </label>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
                  className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2.5 px-3 text-xs sm:text-sm outline-none transition focus:border-[#8a83d6]"
                >
                  {YEAR_OPTIONS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Skills */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 text-base font-bold text-[#27364b]">
              <Target className="text-[#8a83d6]" size={20} />
              <span>Current Skills & Strengths</span>
            </div>
            <p className="text-xs text-[#858e9c]">
              Select the skills you currently possess or are learning. This helps our recommendation engine calculate your real skill gap.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {POPULAR_SKILLS.map((skill) => {
                const selected = skills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? 'bg-[#27364b] text-white shadow-sm'
                        : 'border border-[#e0dad0] bg-[#f8f7f2] text-[#4d5a6a] hover:bg-[#eeedf8]'
                    }`}
                  >
                    {selected && <Check size={12} />}
                    {skill}
                  </button>
                )
              })}
            </div>

            {/* Custom Skill Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add other skill (e.g. Docker, Tableau)..."
                className="rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2 px-3 text-xs outline-none focus:border-[#8a83d6] flex-1 max-w-xs"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="rounded-xl bg-[#eeedf8] px-3.5 py-2 text-xs font-bold text-[#5d56a5] hover:bg-[#e0dcf8] transition"
              >
                + Add Skill
              </button>
            </div>

            {/* Selected Skills Chips */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="text-xs font-medium text-[#858e9c] self-center mr-1">Selected:</span>
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-md bg-[#eef2ff] px-2 py-0.5 text-xs font-medium text-[#4b439c]"
                  >
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-600">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Interests & Passions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 text-base font-bold text-[#27364b]">
              <Compass className="text-[#8a83d6]" size={20} />
              <span>Career Interests</span>
            </div>
            <p className="text-xs text-[#858e9c]">
              What domains or industries excite you most? (Select all that apply)
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {POPULAR_INTERESTS.map((interest) => {
                const selected = interests.includes(interest)
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? 'bg-[#8a83d6] text-white shadow-sm'
                        : 'border border-[#e0dad0] bg-[#f8f7f2] text-[#4d5a6a] hover:bg-[#eeedf8]'
                    }`}
                  >
                    {selected && <Check size={12} />}
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 4: Goals */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 border-b border-[#f1eee8] pb-3 text-base font-bold text-[#27364b]">
              <BookOpen className="text-[#8a83d6]" size={20} />
              <span>Your Career Ambition & Aspirations</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475467] mb-1.5">
                Briefly describe what you want to achieve or clarify in your career
              </label>
              <textarea
                rows={3}
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                placeholder="e.g. I want to transition into an AI Engineer or Data Scientist role, build a strong GitHub portfolio, and land an internship."
                className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] p-3 text-sm outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#f1eee8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#858e9c]">
              Profile is saved securely in your BUDDY database account.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#27364b] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(39,54,75,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1d2b3d] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Profile...' : 'Save & Proceed to Assessment'}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default OnboardingPage
