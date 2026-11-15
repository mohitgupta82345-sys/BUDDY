import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  AlertCircle,
} from 'lucide-react'

export function AssessmentPage() {
  const { isAuthenticated, profile } = useAuth()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadQuestions() {
      setIsLoading(true)
      try {
        if (!isAuthenticated) {
          navigate('/login', { state: { from: { pathname: '/assessment' } } })
          return
        }

        const res = await api.assessment.getQuestions()
        if (res.success && res.questions) {
          setQuestions(res.questions)
          setAnswers(new Array(res.questions.length).fill(null))
        }
      } catch (err) {
        console.error('Error loading questions:', err)
        setError('Failed to load assessment questions. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    loadQuestions()
  }, [isAuthenticated, navigate])

  const handleSelectOption = (option) => {
    const nextAnswers = [...answers]
    nextAnswers[currentStep] = option
    setAnswers(nextAnswers)
  }

  const handleNext = () => {
    if (!answers[currentStep]) {
      setError('Please select an option to continue.')
      return
    }
    setError('')
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    setError('')
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!answers[currentStep]) {
      setError('Please answer the final question before submitting.')
      return
    }

    if (answers.some((a) => !a)) {
      setError('Please ensure all assessment questions are answered.')
      return
    }

    setIsSubmitting(true)
    setError('')
    try {
      const res = await api.assessment.submit(answers)
      if (res.success) {
        navigate('/results', { state: { results: res.results } })
      }
    } catch (err) {
      console.error('Submit error:', err)
      setError(err.message || 'Failed to submit assessment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to restart the assessment from Question 1?')) {
      setCurrentStep(0)
      setAnswers(new Array(questions.length).fill(null))
      setError('')
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-2xl bg-[#eeedf8] text-[#8a83d6]">
          <Sparkles size={24} />
        </div>
        <p className="text-sm font-medium text-[#858e9c]">
          Personalizing questions based on {profile?.degree || 'your'} academic stream...
        </p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="text-2xl font-bold text-[#27364b]">Unable to load questions</h2>
        <p className="mt-2 text-sm text-[#858e9c]">Please ensure your backend server is running.</p>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]
  const progressPercent = Math.round(((currentStep + 1) / questions.length) * 100)
  const isSelected = (option) => answers[currentStep]?.id === option.id

  return (
    <div className="min-h-screen bg-[#f8f7f2] py-10 px-4 sm:px-6 lg:px-8 text-[#27364b]">
      <div className="mx-auto max-w-3xl">
        {/* Header & Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-[#858e9c] mb-2 font-medium">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#5d56a5]">
              <Sparkles size={14} /> Career Assessment Quiz
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-[#858e9c] hover:text-[#27364b] transition"
                title="Restart assessment"
              >
                <RotateCcw size={12} /> Restart
              </button>
              <span>Question {currentStep + 1} of {questions.length} ({progressPercent}%)</span>
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-[#e8e4dc]">
            <div
              className="h-full bg-[#8a83d6] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle size={15} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Question Card */}
        <div className="rounded-[28px] border border-[#ece7df] bg-white p-6 sm:p-10 shadow-[0_15px_40px_rgba(39,54,75,0.06)]">
          <div className="mb-3 inline-block rounded-md bg-[#eeedf8] px-2.5 py-1 text-[11px] font-bold text-[#5d56a5] uppercase tracking-wider">
            {currentQuestion.category || 'Competency & Strengths'}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#27364b] leading-snug">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const checked = isSelected(option)
              return (
                <button
                  key={option.id || idx}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 sm:p-5 text-left transition-all ${
                    checked
                      ? 'border-[#8a83d6] bg-[#fbfaff] shadow-[0_4px_16px_rgba(138,131,214,0.14)] ring-2 ring-[#8a83d6]/30'
                      : 'border-[#eae6de] bg-[#fffdfb] hover:border-[#8a83d6]/40 hover:bg-[#faf9fe]'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                      checked
                        ? 'bg-[#8a83d6] text-white'
                        : 'border border-[#dcd7cd] bg-white text-[#858e9c]'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <p className={`text-xs sm:text-sm font-medium leading-relaxed ${checked ? 'text-[#27364b] font-semibold' : 'text-[#475467]'}`}>
                      {option.label}
                    </p>
                  </div>
                  {checked && <CheckCircle2 size={18} className="text-[#8a83d6] shrink-0 mt-0.5" />}
                </button>
              )
            })}
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-[#f1eee8] flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#dfe3e8] bg-transparent px-4 py-2.5 text-xs font-semibold text-[#27364b] transition hover:bg-[#f8f7f2] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={14} /> Previous
            </button>

            {currentStep < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!answers[currentStep]}
                className="inline-flex items-center gap-2 rounded-xl bg-[#27364b] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d2b3d] disabled:opacity-50"
              >
                Next Question <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !answers[currentStep]}
                className="inline-flex items-center gap-2 rounded-xl bg-[#8a83d6] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-[#7871c9] disabled:opacity-50"
              >
                {isSubmitting ? 'Scoring Assessment...' : 'Submit & View Results'} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[#858e9c]">
          Scoring is deterministic and transparent based on weighted multi-dimensional aptitude metrics.
        </p>
      </div>
    </div>
  )
}
export default AssessmentPage
