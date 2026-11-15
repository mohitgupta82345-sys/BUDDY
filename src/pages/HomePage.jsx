import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Compass,
  GraduationCap,
  Layers3,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  UserRound,
} from 'lucide-react'

const highlightStats = [
  { label: 'Careers mapped across streams', value: '24+', icon: Briefcase },
  { label: 'Personalized matching precision', value: '3x', icon: TrendingUp },
  { label: 'Educational degree support', value: '12+', icon: Layers3 },
  { label: 'Student confidence index', value: '96%', icon: Star },
]

const howBuddyWorksSteps = [
  {
    step: '01',
    title: 'Create your profile',
    description: 'Tell us your academic background — whether you study BCA, BBA, B.Com, B.Tech, Arts, or Science — along with your active skills and career goals.',
    badge: 'ACADEMICS & SKILLS',
    icon: GraduationCap,
    accent: 'bg-[#eef2ff] text-[#4b439c]',
  },
  {
    step: '02',
    title: 'Complete career assessment',
    description: 'Answer our stream-tailored quiz evaluating your problem-solving style, analytical aptitude, creativity, leadership, and work preferences.',
    badge: 'DYNAMIC ASSESSMENT',
    icon: Target,
    accent: 'bg-[#f4f0ff] text-[#6d5bb8]',
  },
  {
    step: '03',
    title: 'Discover career matches',
    description: 'Review transparent career compatibility scores, salary benchmarks, core responsibilities, and specific missing skills to focus on.',
    badge: 'TRANSPARENT SCORING',
    icon: Compass,
    accent: 'bg-[#edf7f0] text-[#3c7a52]',
  },
  {
    step: '04',
    title: 'Build your learning roadmap',
    description: 'Track your beginner-to-advanced milestone progress, check off practical goals, and apply directly to verified entry-level internships.',
    badge: 'ACTION ROADMAP',
    icon: TrendingUp,
    accent: 'bg-[#fff7ed] text-[#c2410c]',
  },
]

const testimonials = [
  {
    name: 'Aarav Sharma',
    course: 'B.Com Graduate',
    quote: 'BUDDY helped me realize my aptitude was strongest in financial analytics and modeling rather than traditional accounting.',
  },
  {
    name: 'Meera Nair',
    course: 'BCA 3rd Year',
    quote: 'The assessment and skill gap analyzer showed me exactly which tools to learn next to transition into an AI Engineer role.',
  },
  {
    name: 'Rohan Deshmukh',
    course: 'Mechanical Engineering Student',
    quote: 'The 3-stage roadmap made my next career steps clear. I could track my milestones and apply to verified programs directly.',
  },
]

const faqItems = [
  {
    question: 'Who is BUDDY built for?',
    answer: 'BUDDY is designed for students, fresh graduates, and career-switchers from BCA, BBA, B.Com, B.Tech, Arts, Commerce, Science, and other degree streams looking for career clarity.',
  },
  {
    question: 'Does BUDDY only cover software and IT roles?',
    answer: 'No. The platform covers technical and non-technical fields including Software, Data Science, AI, Business Analysis, Corporate Finance, UI/UX Design, Marketing, HR, Civil, Mechanical, Electrical, Healthcare, and Public Policy.',
  },
  {
    question: 'How does the assessment scoring work?',
    answer: 'Our assessment uses a transparent, deterministic multi-dimensional model evaluating aptitude, strengths, working preferences, and academic alignment. No random scores or simulated outputs.',
  },
  {
    question: 'Are the internship and job opportunities real?',
    answer: 'Yes. All recommended opportunities link directly to verified student platforms (such as Internshala, Unstop, LinkedIn, Naukri) and official corporate fresher hiring programs.',
  },
]

export function HomePage() {
  const [featuredCareers, setFeaturedCareers] = useState([])

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.careers.list({ featuredOnly: 'true' })
        if (res.success && res.careers) {
          // Exactly 6 featured careers as specified
          setFeaturedCareers(res.careers.slice(0, 6))
        }
      } catch (err) {
        console.error('Error loading featured careers:', err)
      }
    }
    loadFeatured()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-label">
            <Sparkles size={15} /> YOUR PERSONAL AI CAREER COMPANION
          </div>
          <h1>
            Your future,<br />
            <span>without the</span><br />
            guesswork.
          </h1>
          <p className="hero-description">
            Discover careers that match your actual strengths, understand your skill gaps, and build a structured roadmap for the future you want across any educational stream.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" to="/assessment">
              Discover your path <ArrowRight size={18} />
            </Link>
            <Link className="secondary-button" to="/explorer">
              Explore careers
            </Link>
          </div>

          <div className="hero-trust">
            <div className="trust-icon">
              <Target size={18} />
            </div>
            <div>
              <strong>Built around you</strong>
              <span>Your interests. Your strengths. Your future.</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card (Explicitly labeled as Sample Preview) */}
        <div className="hero-visual">
          <div className="dashboard-card relative">
            {/* Clear Simulation Banner */}
            <div className="dashboard-top">
              <div>
                <span className="dashboard-overline text-[10px] tracking-widest text-[#8a83d6] font-bold">
                  SAMPLE PREVIEW · SIMULATED SNAPSHOT
                </span>
                <h3>Illustrative Career Matching</h3>
              </div>
              <span className="inline-block rounded-full bg-[#fdf5e6] border border-[#fbd38d] px-2.5 py-0.5 text-[10px] font-bold text-[#b45309]">
                Illustrative Preview
              </span>
            </div>

            <div className="profile-box">
              <div className="profile-avatar">S</div>
              <div>
                <strong>Student Career Profile</strong>
                <span className="text-xs text-[#858e9c]">Take the quiz to generate your live matches</span>
              </div>
              <Sparkles className="profile-sparkle" size={20} />
            </div>

            <div className="match-heading">
              <span>SAMPLE CAREER MATCHES</span>
              <span className="match-count">TOP 3</span>
            </div>

            {[
              { name: 'Data Scientist', label: 'Analytics · Machine Learning', color: 'blue', score: '94%' },
              { name: 'AI Engineer', label: 'Artificial Intelligence · Python', color: 'purple', score: '89%' },
              { name: 'Software Engineer', label: 'Full Stack · Cloud Systems', color: 'mint', score: '86%' },
            ].map((item) => (
              <div className="career-item" key={item.name}>
                <div className={`career-icon ${item.color}`}>
                  <TrendingUp size={20} />
                </div>
                <div className="career-info">
                  <strong>{item.name}</strong>
                  <span>{item.label}</span>
                </div>
                <span className="match-percent">{item.score}</span>
              </div>
            ))}

            <div className="mt-4 rounded-xl border border-[#ece7df] bg-[#faf8f4] p-3 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#27364b]">
                <Sparkles size={13} className="text-[#8a83d6] shrink-0" />
                <span>Your personalized AI results await</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-[#687386]">
                These are illustrative sample scores. Complete your career assessment to get your personalized AI-powered career recommendations and actual match scores.
              </p>
            </div>
          </div>

          <div className="floating-note">
            <span className="floating-icon">✦</span>
            <div>
              <strong>Your journey starts here</strong>
              <span>One step closer to career clarity.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bottom-strip">
        <span>LESS CONFUSION.</span>
        <span>MORE CLARITY.</span>
        <span>A BETTER FUTURE.</span>
      </section>

      {/* NEW: Dedicated "How BUDDY Works" Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eeedf8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#5d56a5] mb-3">
            <UserCheck size={14} /> STEP-BY-STEP GUIDANCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#27364b] tracking-tight">
            How BUDDY Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#687386]">
            From university freshman to career-ready professional in four clear, data-driven steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howBuddyWorksSteps.map((item) => (
            <div
              key={item.step}
              className="rounded-[24px] border border-[#ece7df] bg-white p-6 shadow-sm hover:shadow-md hover:border-[#8a83d6] transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#8a83d6]/30 font-mono">
                    {item.step}
                  </span>
                  <div className={`p-2.5 rounded-xl ${item.accent}`}>
                    <item.icon size={20} />
                  </div>
                </div>

                <span className="inline-block rounded-md bg-[#faf8f4] border border-[#eee9df] px-2 py-0.5 text-[10px] font-bold text-[#858e9c] uppercase tracking-wider mb-2">
                  {item.badge}
                </span>

                <h3 className="text-lg font-bold text-[#27364b] mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-[#52607a] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#f1eee8] text-[11px] font-semibold text-[#8a83d6]">
                Step {item.step} Complete &rarr;
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Careers Grid (Requirement: Exactly 6 featured careers) */}
      <section className="career-section">
        <div className="career-heading">
          <span className="section-label">EXPLORE YOUR POSSIBILITIES</span>
          <h2>
            Featured Careers for <span>Ambitious Students.</span>
          </h2>
          <p>Explore different career paths and discover where your interests and strengths can take you.</p>
        </div>

        <div className="career-grid home-grid">
          {featuredCareers.map((career, index) => (
            <Link to={`/career/${career.id}`} className="career-card" key={career.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{career.name}</h3>
              <p>{career.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#8a83d6]">
                <span>{career.domain}</span>
                <span>{career.salary}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/explorer" className="secondary-button">
            View All 24+ Career Paths &rarr;
          </Link>
        </div>
      </section>

      {/* Feature Panel */}
      <section className="feature-panel">
        <div className="panel-heading">
          <span className="section-label">WHY STUDENTS CHOOSE BUDDY</span>
          <h2>Guidance that fits your path.</h2>
        </div>
        <div className="stats-grid">
          {highlightStats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-icon">
                <stat.icon size={20} />
              </div>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="preview-grid">
          <div className="preview-box">
            <div className="mini-label">SKILL GAP ANALYZER</div>
            <h3>Understand what to improve next.</h3>
            <ul>
              <li><CheckCircle2 size={16} /> Transparent comparison between your skills and role requirements</li>
              <li><CheckCircle2 size={16} /> Clear distinction between strengths and missing skill gaps</li>
              <li><CheckCircle2 size={16} /> Curated free & university courses to bridge each gap</li>
            </ul>
          </div>
          <div className="preview-box">
            <div className="mini-label">PERSISTENT LEARNING ROADMAP</div>
            <h3>Turn exploration into action.</h3>
            <ul>
              <li><CheckCircle2 size={16} /> Beginner, Intermediate, and Advanced milestones</li>
              <li><CheckCircle2 size={16} /> Interactive progress tracking saved to your database account</li>
              <li><CheckCircle2 size={16} /> Verified internship and early career job links</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonial-section">
        <div className="panel-heading">
          <span className="section-label">STUDENT STORIES</span>
          <h2>Real feedback from early users.</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((student) => (
            <article className="testimonial-card" key={student.name}>
              <div className="quote-mark">“</div>
              <p>{student.quote}</p>
              <div className="student-meta">
                <strong>{student.name}</strong>
                <span>{student.course}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="panel-heading">
          <span className="section-label">FAQ</span>
          <h2>Questions students ask most.</h2>
        </div>
        <div className="faq-list">
          {faqItems.map((item) => (
            <div className="faq-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-inner">
          <div>
            <span className="section-label">READY TO START?</span>
            <h2>Find a path that matches your potential.</h2>
          </div>
          <Link className="primary-button" to="/assessment">
            Start free assessment <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Share Your Feedback Section */}
      <FeedbackSection />
    </>
  )
}

const FEEDBACK_CATEGORIES = [
  'Overall Experience',
  'Career Recommendations',
  'User Interface',
  'Assessment Quiz',
  'Other',
]

function FeedbackSection() {
  const { isAuthenticated, user, profile } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [category, setCategory] = useState('Overall Experience')
  const [feedback, setFeedback] = useState('')
  const [guestName, setGuestName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const activeRating = hoverRating || rating

  const ratingLabels = {
    1: 'Needs Improvement',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (rating === 0) {
      setErrorMessage('Please select a star rating (1 to 5 stars).')
      return
    }

    if (!feedback.trim()) {
      setErrorMessage('Please share your thoughts or suggestions in the text area.')
      return
    }

    if (feedback.trim().length < 5) {
      setErrorMessage('Please provide a slightly more descriptive feedback (at least 5 characters).')
      return
    }

    setIsSubmitting(true)
    try {
      const displayName = isAuthenticated
        ? (profile?.full_name || user?.name || user?.email?.split('@')[0])
        : guestName.trim()

      await api.feedback.submit({
        rating,
        category,
        feedback: feedback.trim(),
        name: displayName,
      })

      setIsSuccess(true)
    } catch (err) {
      console.error('Feedback submit error:', err)
      setErrorMessage(err.message || 'Unable to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setRating(0)
    setHoverRating(0)
    setCategory('Overall Experience')
    setFeedback('')
    setGuestName('')
    setErrorMessage('')
    setIsSuccess(false)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="rounded-[28px] border border-[#ece7df] bg-white p-6 sm:p-10 shadow-[0_15px_40px_rgba(39,54,75,0.06)]">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eeedf8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#5d56a5] mb-3">
            <MessageSquare size={13} /> Share Your Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#27364b] tracking-tight">
            Help us make BUDDY better
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#687386] leading-relaxed">
            Your feedback helps us improve the career discovery experience for students.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="h-14 w-14 rounded-2xl bg-[#edf7f0] text-[#3c7a52] flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="text-xl font-black text-[#27364b]">Thank you for your feedback!</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#52607a] max-w-md leading-relaxed">
              Your feedback has been saved to our database. We review every suggestion to make career guidance, recommendations, and roadmaps even better for students.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 rounded-xl bg-[#27364b] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1d2b3d] transition cursor-pointer"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475467] mb-2">
                1. How would you rate your experience? <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Star rating">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= activeRating
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        className="p-1 rounded-lg transition hover:scale-115 focus:outline-none cursor-pointer"
                      >
                        <Star
                          size={28}
                          className={`transition-colors duration-150 ${
                            isFilled
                              ? 'fill-[#f59e0b] text-[#f59e0b] drop-shadow-xs'
                              : 'text-[#dcd7cd] hover:text-[#f59e0b]'
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
                {activeRating > 0 && (
                  <span className="ml-2 rounded-lg bg-[#faf8f4] border border-[#e5e0d7] px-2.5 py-1 text-xs font-semibold text-[#5d56a5]">
                    {ratingLabels[activeRating]}
                  </span>
                )}
              </div>
            </div>

            {/* Feedback Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475467] mb-2">
                2. Feedback category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {FEEDBACK_CATEGORIES.map((cat) => {
                  const isSelected = category === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`rounded-xl border py-2.5 px-3 text-xs font-semibold transition text-center cursor-pointer ${
                        isSelected
                          ? 'border-[#8a83d6] bg-[#eeedf8] text-[#5d56a5] ring-2 ring-[#8a83d6]/20'
                          : 'border-[#e2ded6] bg-[#faf8f4] text-[#52607a] hover:border-[#8a83d6]/50 hover:bg-white'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Feedback Text Area */}
            <div>
              <label htmlFor="feedback-text" className="block text-xs font-bold uppercase tracking-wider text-[#475467] mb-2">
                3. Your suggestions &amp; comments <span className="text-red-500">*</span>
              </label>
              <textarea
                id="feedback-text"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you liked or what we can improve..."
                required
                className="w-full rounded-2xl border border-[#e5e0d7] bg-[#fffdfb] p-3.5 text-xs sm:text-sm text-[#27364b] outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10 leading-relaxed"
              />
            </div>

            {/* Optional Name for logged out / info for logged in */}
            <div>
              {isAuthenticated ? (
                <div className="flex items-center gap-2 rounded-xl bg-[#faf8f4] border border-[#ece7df] p-3 text-xs text-[#52607a]">
                  <UserRound size={15} className="text-[#5d56a5] shrink-0" />
                  <span>
                    Submitting as <strong className="text-[#27364b]">{profile?.full_name || user?.name || user?.email}</strong> (associated with your account).
                  </span>
                </div>
              ) : (
                <div>
                  <label htmlFor="feedback-name" className="block text-xs font-bold uppercase tracking-wider text-[#475467] mb-1.5">
                    Your name <span className="text-[11px] font-normal text-[#858e9c] normal-case">(optional for guests)</span>
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name (or leave blank to submit anonymously)"
                    className="w-full rounded-xl border border-[#e5e0d7] bg-[#fffdfb] py-2.5 px-3.5 text-xs sm:text-sm text-[#27364b] outline-none transition focus:border-[#8a83d6] focus:ring-4 focus:ring-[#8a83d6]/10"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-[#858e9c]">
                Your feedback is stored securely in our database.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#27364b] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#1d2b3d] hover:-translate-y-0.5 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
export default HomePage
