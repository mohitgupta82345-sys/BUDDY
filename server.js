import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

import {
  initDb,
  isUsingPostgres,
  findUserByEmail,
  findUserById,
  createUser,
  getProfileByUserId,
  upsertProfile,
  saveAssessmentRecord,
  getLatestAssessment,
  getAssessmentHistory,
  getSavedCareers,
  saveCareer,
  unsaveCareer,
  getMilestoneProgress,
  toggleMilestone,
  saveFeedback,
  getFeedbackList,
} from './server/db.js'

import { careerDatabase } from './server/careersData.js'
import { opportunitiesDatabase } from './server/opportunitiesData.js'
import { getFullAssessmentQuestions, calculateAssessmentScores } from './server/assessmentData.js'
import { generateCareerRecommendations } from './server/recommendationEngine.js'

const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET || JWT_SECRET.startsWith('replace-with-')) {
  throw new Error('Set JWT_SECRET to a unique secret in .env before starting the server.')
}

const app = express()

const frontendOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean)

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://buddy-phi-six.vercel.app',
    ...frontendOrigins,
  ],
  credentials: true,
}))
app.use(express.json({ limit: '2mb' }))

// JWT Helper
function signToken(user, profile) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: profile?.full_name || 'Student',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Authentication Middleware
async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    return next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please sign in again.' })
  }
}

// Initialize database
await initDb()

// ==========================================
// 1. HEALTH & SYSTEM STATUS
// ==========================================
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'BUDDY Career Companion API is operational',
    database: isUsingPostgres() ? 'PostgreSQL' : 'Persistent Local Storage Adapter',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  })
})

// ==========================================
// 2. AUTHENTICATION ENDPOINTS
// ==========================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {}

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, valid email, and password are required.' })
    }

    const cleanEmail = String(email).trim().toLowerCase()
    const cleanName = String(fullName).trim()

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' })
    }

    // Check existing
    const existing = await findUserByEmail(cleanEmail)
    if (existing) {
      return res.status(409).json({ success: false, message: 'This email is already registered. Please sign in.' })
    }

    // Hash password securely with bcrypt
    const passwordHash = await bcrypt.hash(String(password), 10)
    const newUser = await createUser({ email: cleanEmail, passwordHash })

    // Create initial student profile
    const initialProfile = await upsertProfile(newUser.id, {
      fullName: cleanName,
      college: '',
      degree: 'BCA',
      branch: 'Computer Science',
      currentYear: '1st Year',
      skills: [],
      interests: [],
      careerGoals: '',
      completedOnboarding: false,
    })

    const token = signToken(newUser, initialProfile)

    return res.status(201).json({
      success: true,
      token,
      completedOnboarding: false,
      user: {
        id: newUser.id,
        email: newUser.email,
        profile: initialProfile,
        completedOnboarding: false,
      },
    })
  } catch (err) {
    console.error('Registration Error:', err)
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' })
  }
})

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const cleanEmail = String(email).trim().toLowerCase()
    const user = await findUserByEmail(cleanEmail)

    if (!user) {
      return res.status(401).json({ success: false, message: 'No registered account found with this email. Please register.' })
    }

    const passwordMatches = await bcrypt.compare(String(password), user.password_hash)
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' })
    }

    const profile = await getProfileByUserId(user.id)
    const token = signToken(user, profile)

    return res.json({
      success: true,
      token,
      completedOnboarding: Boolean(profile?.completed_onboarding),
      user: {
        id: user.id,
        email: user.email,
        profile: profile || { full_name: 'Student', completed_onboarding: false },
        completedOnboarding: Boolean(profile?.completed_onboarding),
      },
    })
  } catch (err) {
    console.error('Login Error:', err)
    return res.status(500).json({ success: false, message: 'Internal server error during login.' })
  }
})

// Current User & Profile
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await findUserById(req.user.sub)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' })
    }

    const profile = await getProfileByUserId(user.id)
    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        profile,
        completedOnboarding: Boolean(profile?.completed_onboarding),
      },
    })
  } catch (err) {
    console.error('Auth Me Error:', err)
    return res.status(500).json({ success: false, message: 'Error retrieving user session.' })
  }
})

// ==========================================
// 3. STUDENT ONBOARDING & PROFILE ENDPOINTS
// ==========================================

// Submit First-Time Onboarding
app.post('/api/profile/onboarding', authMiddleware, async (req, res) => {
  try {
    const {
      fullName,
      college,
      degree,
      branch,
      currentYear,
      skills,
      interests,
      careerGoals,
    } = req.body || {}

    if (!fullName || !degree || !branch) {
      return res.status(400).json({
        success: false,
        message: 'Full name, degree/course, and branch/stream are required to complete onboarding.',
      })
    }

    const updated = await upsertProfile(req.user.sub, {
      fullName: String(fullName).trim(),
      college: String(college || '').trim(),
      degree: String(degree).trim(),
      branch: String(branch).trim(),
      currentYear: String(currentYear || '1st Year').trim(),
      skills: Array.isArray(skills) ? skills : [],
      interests: Array.isArray(interests) ? interests : [],
      careerGoals: String(careerGoals || '').trim(),
      completedOnboarding: true,
    })

    return res.json({
      success: true,
      message: 'Onboarding completed successfully!',
      profile: updated,
    })
  } catch (err) {
    console.error('Onboarding Error:', err)
    return res.status(500).json({ success: false, message: 'Error saving onboarding profile.' })
  }
})

// Get or Update Profile
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.user.sub)
    return res.json({ success: true, profile })
  } catch (err) {
    console.error('Get Profile Error:', err)
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' })
  }
})

app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await upsertProfile(req.user.sub, req.body || {})
    return res.json({ success: true, message: 'Profile updated successfully', profile })
  } catch (err) {
    console.error('Update Profile Error:', err)
    return res.status(500).json({ success: false, message: 'Failed to update profile.' })
  }
})

// ==========================================
// 4. CAREER EXPLORER ENDPOINTS
// ==========================================

// Search & Browse Careers
app.get('/api/careers', (req, res) => {
  const { search, domain, education, featured } = req.query
  const query = (search || '').trim().toLowerCase()

  // Requirement: Exactly 6 featured careers when search is empty or featured flag requested
  if ((featured === 'true' || !query) && (!domain || domain === 'All') && (!education || education === 'All') && req.query.featuredOnly === 'true') {
    const featuredList = careerDatabase.filter((c) => c.featured).slice(0, 6)
    return res.json({ success: true, total: featuredList.length, careers: featuredList })
  }

  let results = careerDatabase

  if (query) {
    results = results.filter((c) => {
      const fullText = [
        c.name,
        c.domain,
        c.description,
        c.degree.join(' '),
        c.streams.join(' '),
        c.skills.join(' '),
        c.tags.join(' '),
        c.tools.join(' '),
      ].join(' ').toLowerCase()
      return fullText.includes(query)
    })
  }

  if (domain && domain !== 'All') {
    results = results.filter((c) => c.domain === domain)
  }

  if (education && education !== 'All') {
    results = results.filter((c) => c.educationLevel === education)
  }

  return res.json({
    success: true,
    total: results.length,
    careers: results,
  })
})

// Career Detail
app.get('/api/careers/:id', (req, res) => {
  const career = careerDatabase.find((c) => c.id === req.params.id)
  if (!career) {
    return res.status(404).json({ success: false, message: 'Career not found.' })
  }
  return res.json({ success: true, career })
})

// Save / Shortlist Career
app.post('/api/careers/save', authMiddleware, async (req, res) => {
  try {
    const { careerId, action = 'toggle' } = req.body || {}
    if (!careerId) {
      return res.status(400).json({ success: false, message: 'careerId is required.' })
    }

    const saved = await getSavedCareers(req.user.sub)
    const isSaved = saved.some((s) => s.career_id === careerId)

    if (action === 'save' || (action === 'toggle' && !isSaved)) {
      await saveCareer(req.user.sub, careerId)
      return res.json({ success: true, saved: true, message: 'Career saved to shortlist.' })
    } else {
      await unsaveCareer(req.user.sub, careerId)
      return res.json({ success: true, saved: false, message: 'Career removed from shortlist.' })
    }
  } catch (err) {
    console.error('Save Career Error:', err)
    return res.status(500).json({ success: false, message: 'Error updating saved careers.' })
  }
})

app.get('/api/careers/user/saved', authMiddleware, async (req, res) => {
  try {
    const saved = await getSavedCareers(req.user.sub)
    const savedIds = saved.map((s) => s.career_id)
    const fullCareers = careerDatabase.filter((c) => savedIds.includes(c.id))
    return res.json({ success: true, savedIds, careers: fullCareers })
  } catch (err) {
    console.error('Get Saved Careers Error:', err)
    return res.status(500).json({ success: false, message: 'Error retrieving saved careers.' })
  }
})

// ==========================================
// 5. CAREER ASSESSMENT QUIZ ENDPOINTS
// ==========================================

// Get Assessment Questions (Dynamic based on profile)
app.get('/api/assessment/questions', authMiddleware, async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.user.sub)
    const questions = getFullAssessmentQuestions(profile || {})
    return res.json({ success: true, total: questions.length, questions })
  } catch (err) {
    console.error('Questions Error:', err)
    return res.status(500).json({ success: false, message: 'Error generating assessment questions.' })
  }
})

// Submit Assessment
app.post('/api/assessment/submit', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body || {}
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'Valid assessment answers are required.' })
    }

    const profile = await getProfileByUserId(req.user.sub)

    // Calculate transparent scoring without random numbers
    const scoreResult = calculateAssessmentScores(answers, profile || {}, careerDatabase)

    // Save persistent assessment record
    const savedRecord = await saveAssessmentRecord(req.user.sub, {
      answers,
      readinessScore: scoreResult.readinessScore,
      topCareers: scoreResult.topCareers,
      strengths: scoreResult.strengths,
      weaknesses: scoreResult.weaknesses,
      missingSkills: scoreResult.missingSkills,
      radarData: scoreResult.radarData,
    })

    return res.status(201).json({
      success: true,
      message: 'Assessment submitted and scored successfully!',
      assessment: savedRecord,
      results: scoreResult,
    })
  } catch (err) {
    console.error('Submit Assessment Error:', err)
    return res.status(500).json({ success: false, message: 'Error scoring assessment.' })
  }
})

// Get Latest Assessment
app.get('/api/assessment/latest', authMiddleware, async (req, res) => {
  try {
    const latest = await getLatestAssessment(req.user.sub)
    return res.json({ success: true, assessment: latest })
  } catch (err) {
    console.error('Latest Assessment Error:', err)
    return res.status(500).json({ success: false, message: 'Failed to retrieve assessment.' })
  }
})

// Get Assessment History
app.get('/api/assessment/history', authMiddleware, async (req, res) => {
  try {
    const history = await getAssessmentHistory(req.user.sub)
    return res.json({ success: true, total: history.length, history })
  } catch (err) {
    console.error('History Assessment Error:', err)
    return res.status(500).json({ success: false, message: 'Failed to retrieve assessment history.' })
  }
})

// ==========================================
// 6. AI CAREER RECOMMENDATION ENGINE
// ==========================================
app.post('/api/recommendations/generate', authMiddleware, async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.user.sub)
    const latestAssessment = await getLatestAssessment(req.user.sub)

    const recommendations = await generateCareerRecommendations({
      profile: profile || {},
      assessment: latestAssessment,
    })

    return res.json({
      success: true,
      recommendations,
    })
  } catch (err) {
    console.error('Recommendation Engine Error:', err)
    return res.status(500).json({ success: false, message: 'Error generating recommendations.' })
  }
})

// ==========================================
// 7. LEARNING ROADMAP & PROGRESS TRACKING
// ==========================================
app.get('/api/roadmap/:careerId', authMiddleware, async (req, res) => {
  try {
    const career = careerDatabase.find((c) => c.id === req.params.careerId) || careerDatabase[0]
    const progress = await getMilestoneProgress(req.user.sub, career.id)

    const completedMilestoneIds = progress.filter((p) => p.completed).map((p) => p.milestone_id)

    return res.json({
      success: true,
      career: {
        id: career.id,
        name: career.name,
        domain: career.domain,
        learningRoadmap: career.learningRoadmap || [],
      },
      completedMilestoneIds,
    })
  } catch (err) {
    console.error('Roadmap Error:', err)
    return res.status(500).json({ success: false, message: 'Failed to load roadmap progress.' })
  }
})

app.post('/api/roadmap/progress', authMiddleware, async (req, res) => {
  try {
    const { careerId, milestoneId, completed = true } = req.body || {}
    if (!careerId || !milestoneId) {
      return res.status(400).json({ success: false, message: 'careerId and milestoneId are required.' })
    }

    const updated = await toggleMilestone(req.user.sub, careerId, milestoneId, completed)
    return res.json({ success: true, milestone: updated })
  } catch (err) {
    console.error('Toggle Milestone Error:', err)
    return res.status(500).json({ success: false, message: 'Error updating roadmap milestone.' })
  }
})

// ==========================================
// 8. INTERNSHIPS & ENTRY-LEVEL JOBS
// ==========================================
app.get('/api/opportunities', (req, res) => {
  const { careerId, domain } = req.query

  let matched = opportunitiesDatabase

  if (careerId) {
    const filtered = opportunitiesDatabase.filter((o) => o.relatedCareerIds.includes(careerId))
    if (filtered.length > 0) {
      matched = filtered
    }
  } else if (domain) {
    matched = opportunitiesDatabase.filter((o) => o.domain === domain)
  }

  return res.json({
    success: true,
    total: matched.length,
    opportunities: matched,
  })
})

// ==========================================
// 9. PERSONALIZED DASHBOARD (ALL-IN-ONE)
// ==========================================
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const user = await findUserById(req.user.sub)
    const profile = await getProfileByUserId(req.user.sub)
    const latestAssessment = await getLatestAssessment(req.user.sub)
    const saved = await getSavedCareers(req.user.sub)

    // Parse assessment if needed
    let parsedTopCareers = []
    let parsedRadar = []
    let parsedStrengths = []
    let parsedWeaknesses = []
    let parsedMissingSkills = []
    let readinessScore = 75

    if (latestAssessment) {
      parsedTopCareers = typeof latestAssessment.top_careers === 'string'
        ? JSON.parse(latestAssessment.top_careers)
        : (latestAssessment.top_careers || [])

      parsedRadar = typeof latestAssessment.radar_data === 'string'
        ? JSON.parse(latestAssessment.radar_data)
        : (latestAssessment.radar_data || [])

      parsedStrengths = latestAssessment.strengths || []
      parsedWeaknesses = latestAssessment.weaknesses || []
      parsedMissingSkills = latestAssessment.missing_skills || []
      readinessScore = latestAssessment.readiness_score || 75
    } else {
      // Rule-based fallback if no assessment completed yet
      const defaultScoring = calculateAssessmentScores([], profile || {}, careerDatabase)
      parsedTopCareers = defaultScoring.topCareers
      parsedRadar = defaultScoring.radarData
      parsedStrengths = defaultScoring.strengths
      parsedWeaknesses = defaultScoring.weaknesses
      parsedMissingSkills = defaultScoring.missingSkills
      readinessScore = defaultScoring.readinessScore
    }

    const primaryCareer = parsedTopCareers[0] || careerDatabase[0]

    // Matched opportunities
    const matchedOpportunities = opportunitiesDatabase.filter((o) =>
      o.relatedCareerIds.includes(primaryCareer.id) || o.domain === primaryCareer.domain
    ).slice(0, 4)

    // User roadmap milestones progress
    const roadmapProgress = await getMilestoneProgress(req.user.sub, primaryCareer.id)
    const completedMilestoneIds = roadmapProgress.filter((p) => p.completed).map((p) => p.milestone_id)

    return res.json({
      success: true,
      student: {
        name: profile?.full_name || user?.email.split('@')[0] || 'Student',
        email: user?.email,
        college: profile?.college || 'Not specified',
        degree: profile?.degree || 'BCA',
        branch: profile?.branch || 'Computer Science',
        currentYear: profile?.current_year || '1st Year',
        skills: profile?.skills || [],
        interests: profile?.interests || [],
        careerGoals: profile?.career_goals || '',
        completedOnboarding: Boolean(profile?.completed_onboarding),
      },
      readinessScore,
      topCareers: parsedTopCareers,
      primaryCareer,
      radarData: parsedRadar,
      strengths: parsedStrengths,
      weaknesses: parsedWeaknesses,
      missingSkills: parsedMissingSkills,
      matchedOpportunities: matchedOpportunities.length ? matchedOpportunities : opportunitiesDatabase.slice(0, 4),
      savedCareerCount: saved.length,
      learningProgress: {
        careerId: primaryCareer.id,
        completedMilestones: completedMilestoneIds,
        totalMilestones: primaryCareer.learningRoadmap ? primaryCareer.learningRoadmap.length : 3,
      },
      hasAssessment: Boolean(latestAssessment),
    })
  } catch (err) {
    console.error('Dashboard Error:', err)
    return res.status(500).json({ success: false, message: 'Failed to load personalized dashboard.' })
  }
})

// ==========================================
// 10. STUDENT FEEDBACK ENDPOINTS
// ==========================================
app.post('/api/feedback', async (req, res) => {
  try {
    const { rating, category, feedback, name } = req.body || {}

    const numRating = Number(rating)
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating between 1 and 5 stars.',
      })
    }

    if (!feedback || !String(feedback).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your feedback comments.',
      })
    }

    let userId = null
    let userName = String(name || '').trim()
    let userEmail = ''

    // Associate with authenticated student if token is present
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET)
        userId = payload.sub
        const user = await findUserById(userId)
        const profile = await getProfileByUserId(userId)
        if (user) userEmail = user.email
        if (profile?.full_name && !userName) {
          userName = profile.full_name
        }
      } catch {
        // Token was invalid or expired, continue as anonymous
      }
    }

    const saved = await saveFeedback({
      userId,
      userName: userName || 'Anonymous Student',
      userEmail,
      rating: numRating,
      category: String(category || 'Overall Experience').trim(),
      feedback: String(feedback).trim(),
    })

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been submitted successfully.',
      feedback: saved,
    })
  } catch (err) {
    console.error('Submit Feedback Error:', err)
    return res.status(500).json({ success: false, message: 'Failed to save feedback. Please try again.' })
  }
})

app.get('/api/feedback', async (req, res) => {
  try {
    const list = await getFeedbackList(50)
    return res.json({ success: true, total: list.length, feedback: list })
  } catch (err) {
    console.error('Get Feedback Error:', err)
    return res.status(500).json({ success: false, message: 'Failed to retrieve feedback.' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BUDDY API server actively running on http://localhost:${PORT}`)
})
