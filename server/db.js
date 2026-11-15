import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, '..', 'data')
const LOCAL_DB_FILE = path.join(DATA_DIR, 'buddy_database.json')

let pool = null
let usePostgres = false

const databaseUrl = process.env.DATABASE_URL || (process.env.PGHOST ? `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || ''}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'buddy_db'}` : null)

// --- Local File Adapter Data Structure ---
function ensureLocalDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(LOCAL_DB_FILE)) {
    const initialData = {
      users: [],
      profiles: [],
      assessments: [],
      saved_careers: [],
      learning_progress: [],
      feedback: [],
    }
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(initialData, null, 2), 'utf8')
  }
}

function readLocalDb() {
  ensureLocalDb()
  try {
    const raw = fs.readFileSync(LOCAL_DB_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    if (!parsed.feedback) parsed.feedback = []
    return parsed
  } catch {
    return { users: [], profiles: [], assessments: [], saved_careers: [], learning_progress: [], feedback: [] }
  }
}

function writeLocalDb(data) {
  ensureLocalDb()
  fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(data, null, 2), 'utf8')
}

// --- Initialize DB ---
export async function initDb() {
  if (!databaseUrl) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL is required in production; local file storage is disabled.')
    }

    console.log('ℹ️ [Database] DATABASE_URL not set. Running with persistent local database adapter.')
    ensureLocalDb()
    return { type: 'local', connected: true }
  }

  let client
  try {
    const connectionUrl = new URL(databaseUrl)
    const hostname = connectionUrl.hostname.toLowerCase().replace(/^\[|\]$/g, '')
    const isLocalDatabase = ['localhost', '127.0.0.1', '::1'].includes(hostname)

    if (!isLocalDatabase) {
      connectionUrl.searchParams.set('sslmode', 'verify-full')
    }

    pool = new pg.Pool({
      connectionString: connectionUrl.toString(),
      ssl: isLocalDatabase ? false : { rejectUnauthorized: true },
      connectionTimeoutMillis: 5000,
    })

    client = await pool.connect()
    console.log('✅ [Database] Successfully connected to PostgreSQL database.')

    const schemaPath = path.join(__dirname, 'schema.sql')
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8')
      await client.query(schemaSql)
      console.log('✅ [Database] PostgreSQL schema and migrations initialized.')
    }

    client.release()
    client = null
    usePostgres = true
    return { type: 'postgresql', connected: true }
  } catch (err) {
    if (client) client.release()
    if (pool) {
      await pool.end()
      pool = null
    }
    usePostgres = false

    if (process.env.NODE_ENV === 'production') {
      console.error('❌ [Database] PostgreSQL initialization failed in production. Error code:', err.code || err.name)
      throw err
    }

    console.warn('⚠️ [Database] Could not connect to PostgreSQL. Error code:', err.code || err.name)
    console.warn('ℹ️ [Database] Falling back to local file storage for development.')
    ensureLocalDb()
    return { type: 'local', connected: true }
  }
}

export function isUsingPostgres() {
  return usePostgres
}

// Helper to generate IDs
export function generateId(prefix = 'id') {
  return crypto.randomUUID ? `${prefix}-${crypto.randomUUID()}` : `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

// --- Database Operations ---

// USERS
export async function findUserByEmail(email) {
  const cleanEmail = String(email || '').trim().toLowerCase()
  if (usePostgres) {
    const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1', [cleanEmail])
    return res.rows[0] || null
  } else {
    const db = readLocalDb()
    return db.users.find((u) => u.email.toLowerCase() === cleanEmail) || null
  }
}

export async function findUserById(id) {
  if (usePostgres) {
    const res = await pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id])
    return res.rows[0] || null
  } else {
    const db = readLocalDb()
    return db.users.find((u) => u.id === id) || null
  }
}

export async function createUser({ email, passwordHash }) {
  const id = generateId('usr')
  const cleanEmail = String(email).trim().toLowerCase()
  const now = new Date().toISOString()

  if (usePostgres) {
    const res = await pool.query(
      'INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, created_at',
      [id, cleanEmail, passwordHash, now, now]
    )
    return res.rows[0]
  } else {
    const db = readLocalDb()
    const newUser = { id, email: cleanEmail, password_hash: passwordHash, created_at: now, updated_at: now }
    db.users.push(newUser)
    writeLocalDb(db)
    return { id: newUser.id, email: newUser.email, created_at: newUser.created_at }
  }
}

// PROFILES
export async function getProfileByUserId(userId) {
  if (usePostgres) {
    const res = await pool.query('SELECT * FROM profiles WHERE user_id = $1 LIMIT 1', [userId])
    return res.rows[0] || null
  } else {
    const db = readLocalDb()
    return db.profiles.find((p) => p.user_id === userId) || null
  }
}

export async function upsertProfile(userId, profileData) {
  const now = new Date().toISOString()
  const {
    fullName = '',
    college = '',
    degree = 'BCA',
    branch = '',
    currentYear = '1st Year',
    skills = [],
    interests = [],
    careerGoals = '',
    completedOnboarding = true,
  } = profileData

  const cleanSkills = Array.isArray(skills) ? skills : []
  const cleanInterests = Array.isArray(interests) ? interests : []

  if (usePostgres) {
    const query = `
      INSERT INTO profiles (
        id, user_id, full_name, college, degree, branch, current_year,
        skills, interests, career_goals, completed_onboarding, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        college = EXCLUDED.college,
        degree = EXCLUDED.degree,
        branch = EXCLUDED.branch,
        current_year = EXCLUDED.current_year,
        skills = EXCLUDED.skills,
        interests = EXCLUDED.interests,
        career_goals = EXCLUDED.career_goals,
        completed_onboarding = EXCLUDED.completed_onboarding,
        updated_at = EXCLUDED.updated_at
      RETURNING *;
    `
    const id = generateId('prof')
    const res = await pool.query(query, [
      id,
      userId,
      fullName,
      college,
      degree,
      branch,
      currentYear,
      cleanSkills,
      cleanInterests,
      careerGoals,
      completedOnboarding,
      now,
    ])
    return res.rows[0]
  } else {
    const db = readLocalDb()
    let profile = db.profiles.find((p) => p.user_id === userId)
    if (profile) {
      profile.full_name = fullName
      profile.college = college
      profile.degree = degree
      profile.branch = branch
      profile.current_year = currentYear
      profile.skills = cleanSkills
      profile.interests = cleanInterests
      profile.career_goals = careerGoals
      profile.completed_onboarding = completedOnboarding
      profile.updated_at = now
    } else {
      profile = {
        id: generateId('prof'),
        user_id: userId,
        full_name: fullName,
        college,
        degree,
        branch,
        current_year: currentYear,
        skills: cleanSkills,
        interests: cleanInterests,
        career_goals: careerGoals,
        completed_onboarding: completedOnboarding,
        created_at: now,
        updated_at: now,
      }
      db.profiles.push(profile)
    }
    writeLocalDb(db)
    return profile
  }
}

// ASSESSMENTS
export async function saveAssessmentRecord(userId, assessmentData) {
  const id = generateId('asmt')
  const now = new Date().toISOString()
  const {
    answers = [],
    readinessScore = 75,
    topCareers = [],
    strengths = [],
    weaknesses = [],
    missingSkills = [],
    radarData = [],
  } = assessmentData

  if (usePostgres) {
    const query = `
      INSERT INTO assessments (
        id, user_id, answers, readiness_score, top_careers,
        strengths, weaknesses, missing_skills, radar_data, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `
    const res = await pool.query(query, [
      id,
      userId,
      JSON.stringify(answers),
      readinessScore,
      JSON.stringify(topCareers),
      strengths,
      weaknesses,
      missingSkills,
      JSON.stringify(radarData),
      now,
    ])
    return res.rows[0]
  } else {
    const db = readLocalDb()
    const newAssessment = {
      id,
      user_id: userId,
      answers,
      readiness_score: readinessScore,
      top_careers: topCareers,
      strengths,
      weaknesses,
      missing_skills: missingSkills,
      radar_data: radarData,
      created_at: now,
    }
    db.assessments.push(newAssessment)
    writeLocalDb(db)
    return newAssessment
  }
}

export async function getLatestAssessment(userId) {
  if (usePostgres) {
    const res = await pool.query('SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId])
    return res.rows[0] || null
  } else {
    const db = readLocalDb()
    const userAssessments = db.assessments
      .filter((a) => a.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return userAssessments[0] || null
  }
}

export async function getAssessmentHistory(userId) {
  if (usePostgres) {
    const res = await pool.query('SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC', [userId])
    return res.rows
  } else {
    const db = readLocalDb()
    return db.assessments
      .filter((a) => a.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
}

// SAVED CAREERS
export async function getSavedCareers(userId) {
  if (usePostgres) {
    const res = await pool.query('SELECT career_id, saved_at FROM saved_careers WHERE user_id = $1 ORDER BY saved_at DESC', [userId])
    return res.rows
  } else {
    const db = readLocalDb()
    return db.saved_careers.filter((s) => s.user_id === userId)
  }
}

export async function saveCareer(userId, careerId) {
  const now = new Date().toISOString()
  if (usePostgres) {
    const id = generateId('save')
    await pool.query(
      'INSERT INTO saved_careers (id, user_id, career_id, saved_at) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, career_id) DO NOTHING',
      [id, userId, careerId, now]
    )
    return { success: true, careerId }
  } else {
    const db = readLocalDb()
    const exists = db.saved_careers.some((s) => s.user_id === userId && s.career_id === careerId)
    if (!exists) {
      db.saved_careers.push({ id: generateId('save'), user_id: userId, career_id: careerId, saved_at: now })
      writeLocalDb(db)
    }
    return { success: true, careerId }
  }
}

export async function unsaveCareer(userId, careerId) {
  if (usePostgres) {
    await pool.query('DELETE FROM saved_careers WHERE user_id = $1 AND career_id = $2', [userId, careerId])
    return { success: true, careerId }
  } else {
    const db = readLocalDb()
    db.saved_careers = db.saved_careers.filter((s) => !(s.user_id === userId && s.career_id === careerId))
    writeLocalDb(db)
    return { success: true, careerId }
  }
}

// LEARNING PROGRESS
export async function getMilestoneProgress(userId, careerId) {
  if (usePostgres) {
    const res = await pool.query('SELECT milestone_id, completed, updated_at FROM learning_progress WHERE user_id = $1 AND career_id = $2', [userId, careerId])
    return res.rows
  } else {
    const db = readLocalDb()
    return db.learning_progress.filter((p) => p.user_id === userId && p.career_id === careerId)
  }
}

export async function toggleMilestone(userId, careerId, milestoneId, completed) {
  const now = new Date().toISOString()
  if (usePostgres) {
    const id = generateId('prog')
    const query = `
      INSERT INTO learning_progress (id, user_id, career_id, milestone_id, completed, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, career_id, milestone_id) DO UPDATE SET
        completed = EXCLUDED.completed,
        updated_at = EXCLUDED.updated_at
      RETURNING *;
    `
    const res = await pool.query(query, [id, userId, careerId, milestoneId, completed, now])
    return res.rows[0]
  } else {
    const db = readLocalDb()
    let item = db.learning_progress.find((p) => p.user_id === userId && p.career_id === careerId && p.milestone_id === milestoneId)
    if (item) {
      item.completed = completed
      item.updated_at = now
    } else {
      item = {
        id: generateId('prog'),
        user_id: userId,
        career_id: careerId,
        milestone_id: milestoneId,
        completed,
        updated_at: now,
      }
      db.learning_progress.push(item)
    }
    writeLocalDb(db)
    return item
  }
}

// FEEDBACK
export async function saveFeedback({ userId = null, userName = '', userEmail = '', rating, category, feedback }) {
  const now = new Date().toISOString()
  const id = generateId('fb')
  if (usePostgres) {
    const query = `
      INSERT INTO feedback (id, user_id, user_name, user_email, rating, category, feedback, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `
    const res = await pool.query(query, [id, userId, userName, userEmail, rating, category, feedback, now])
    return res.rows[0]
  } else {
    const db = readLocalDb()
    if (!db.feedback) db.feedback = []
    const item = {
      id,
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      rating: Number(rating),
      category: String(category),
      feedback: String(feedback),
      created_at: now,
    }
    db.feedback.push(item)
    writeLocalDb(db)
    return item
  }
}

export async function getFeedbackList(limit = 50) {
  if (usePostgres) {
    const res = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC LIMIT $1', [limit])
    return res.rows
  } else {
    const db = readLocalDb()
    return (db.feedback || []).slice(-limit).reverse()
  }
}
