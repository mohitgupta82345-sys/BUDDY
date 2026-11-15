// Centralized API client for BUDDY Career Companion

const configuredApiUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '')
const API_BASE = configuredApiUrl
  ? `${configuredApiUrl.replace(/\/api$/i, '')}/api`
  : '/api'

function getAuthHeader() {
  const token = localStorage.getItem('buddy_jwt_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`
    throw new Error(errorMsg)
  }
  return data
}

export const api = {
  // Authentication
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      return handleResponse(res)
    },
    register: async (fullName, email, password) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      })
      return handleResponse(res)
    },
    me: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { ...getAuthHeader() },
      })
      return handleResponse(res)
    },
  },

  // Student Profile & Onboarding
  profile: {
    get: async () => {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { ...getAuthHeader() },
      })
      return handleResponse(res)
    },
    onboarding: async (profileData) => {
      const res = await fetch(`${API_BASE}/profile/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(profileData),
      })
      return handleResponse(res)
    },
    update: async (profileData) => {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(profileData),
      })
      return handleResponse(res)
    },
  },

  // Careers
  careers: {
    list: async (params = {}) => {
      const query = new URLSearchParams(params).toString()
      const res = await fetch(`${API_BASE}/careers${query ? `?${query}` : ''}`)
      return handleResponse(res)
    },
    get: async (id) => {
      const res = await fetch(`${API_BASE}/careers/${id}`)
      return handleResponse(res)
    },
    save: async (careerId, action = 'toggle') => {
      const res = await fetch(`${API_BASE}/careers/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ careerId, action }),
      })
      return handleResponse(res)
    },
    getSaved: async () => {
      const res = await fetch(`${API_BASE}/careers/user/saved`, {
        headers: { ...getAuthHeader() },
      })
      return handleResponse(res)
    },
  },

  // Assessment Quiz
  assessment: {
    getQuestions: async () => {
      const res = await fetch(`${API_BASE}/assessment/questions`, {
        headers: { ...getAuthHeader() },
      })
      return handleResponse(res)
    },
    submit: async (answers) => {
      const res = await fetch(`${API_BASE}/assessment/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ answers }),
      })
      return handleResponse(res)
    },
    getLatest: async () => {
      const res = await fetch(`${API_BASE}/assessment/latest`, {
        headers: { ...getAuthHeader() },
      })
      return handleResponse(res)
    },
    getHistory: async () => {
      const res = await fetch(`${API_BASE}/assessment/history`, {
        headers: { ...getAuthHeader() },
      })
      return handleResponse(res)
    },
  },

  // AI Recommendation Engine
  recommendations: {
    generate: async () => {
      const res = await fetch(`${API_BASE}/recommendations/generate`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
      })
      return handleResponse(res)
    },
  },

  // Roadmap & Progress
  roadmap: {
    get: async (careerId) => {
      const res = await fetch(`${API_BASE}/roadmap/${careerId}`, {
        headers: { ...getAuthHeader() },
      })
      return handleResponse(res)
    },
    toggleMilestone: async (careerId, milestoneId, completed) => {
      const res = await fetch(`${API_BASE}/roadmap/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ careerId, milestoneId, completed }),
      })
      return handleResponse(res)
    },
  },

  // Opportunities
  opportunities: {
    list: async (params = {}) => {
      const query = new URLSearchParams(params).toString()
      const res = await fetch(`${API_BASE}/opportunities${query ? `?${query}` : ''}`)
      return handleResponse(res)
    },
  },

  // Dashboard
  dashboard: {
    get: async () => {
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { ...getAuthHeader() },
      })
      return handleResponse(res)
    },
  },

  // Student Feedback
  feedback: {
    submit: async ({ rating, category, feedback, name }) => {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ rating, category, feedback, name }),
      })
      return handleResponse(res)
    },
  },
}
