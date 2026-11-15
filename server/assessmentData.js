// Assessment Questions and Dynamic Engine for BUDDY Career Companion

export const baseAssessmentQuestions = [
  {
    id: 'q1',
    category: 'Work Interests',
    question: 'When faced with an open-ended project, which activity gives you the most satisfaction?',
    options: [
      {
        id: 'q1-a',
        label: 'Building systems, writing algorithms, or automating technical workflows',
        dimension: 'technical',
        tags: ['technology', 'coding', 'innovation', 'systems'],
        weights: { technical: 10, analytical: 7, creative: 3, business: 2, people: 1 },
      },
      {
        id: 'q1-b',
        label: 'Digging through numbers, finding hidden patterns, and modeling predictions',
        dimension: 'analytical',
        tags: ['analytics', 'numbers', 'research', 'mathematics'],
        weights: { analytical: 10, technical: 6, business: 5, creative: 2, people: 2 },
      },
      {
        id: 'q1-c',
        label: 'Designing visual interfaces, crafting stories, or structuring user journeys',
        dimension: 'creative',
        tags: ['design', 'visual', 'creativity', 'communication'],
        weights: { creative: 10, people: 5, business: 3, technical: 2, analytical: 2 },
      },
      {
        id: 'q1-d',
        label: 'Structuring commercial strategies, leading teams, and optimizing operations',
        dimension: 'business',
        tags: ['business', 'strategy', 'planning', 'operations'],
        weights: { business: 10, strategic: 8, people: 6, analytical: 4, technical: 1 },
      },
    ],
  },
  {
    id: 'q2',
    category: 'Aptitude & Problem Solving',
    question: 'How do you approach a complex, ambiguous problem you have never seen before?',
    options: [
      {
        id: 'q2-a',
        label: 'Break it down into mathematical or logical sub-components and test hypotheses iteratively',
        dimension: 'analytical',
        tags: ['problem-solving', 'analysis', 'research'],
        weights: { analytical: 10, technical: 8, strategic: 5, people: 1, creative: 3 },
      },
      {
        id: 'q2-b',
        label: 'Talk directly to people affected, gather their viewpoints, and design an empathetic solution',
        dimension: 'people',
        tags: ['people', 'communication', 'user-focus', 'service'],
        weights: { people: 10, creative: 6, business: 5, analytical: 3, technical: 1 },
      },
      {
        id: 'q2-c',
        label: 'Build a rapid visual or physical prototype to see what works in the real world',
        dimension: 'creative',
        tags: ['creative', 'design', 'innovation', 'engineering'],
        weights: { creative: 9, technical: 7, analytical: 5, business: 3, people: 3 },
      },
      {
        id: 'q2-d',
        label: 'Assess business risks, timelines, resource costs, and create a realistic execution plan',
        dimension: 'business',
        tags: ['strategy', 'planning', 'risk', 'operations'],
        weights: { business: 10, strategic: 9, analytical: 6, people: 5, technical: 2 },
      },
    ],
  },
  {
    id: 'q3',
    category: 'Work Environment Preference',
    question: 'In which work setting do you envision yourself thriving most in your career?',
    options: [
      {
        id: 'q3-a',
        label: 'High-growth technology team tackling scalable digital systems and architectures',
        dimension: 'technical',
        tags: ['technology', 'innovation', 'scaling', 'development'],
        weights: { technical: 10, analytical: 7, creative: 4, business: 3, people: 2 },
      },
      {
        id: 'q3-b',
        label: 'Strategic corporate or consultancy hub evaluating market opportunities and metrics',
        dimension: 'business',
        tags: ['business', 'strategy', 'finance', 'consulting'],
        weights: { business: 10, strategic: 8, analytical: 7, people: 4, technical: 2 },
      },
      {
        id: 'q3-c',
        label: 'Creative studio or product team building human-centered experiences and design',
        dimension: 'creative',
        tags: ['design', 'visual', 'creative', 'user-focus'],
        weights: { creative: 10, people: 6, technical: 3, analytical: 2, business: 3 },
      },
      {
        id: 'q3-d',
        label: 'Social impact, education, community, or healthcare environment supporting human well-being',
        dimension: 'people',
        tags: ['service', 'healthcare', 'people', 'social impact'],
        weights: { people: 10, communication: 8, service: 7, creative: 4, business: 3 },
      },
    ],
  },
  {
    id: 'q4',
    category: 'Quantitative & Analytical Comfort',
    question: 'How comfortable are you working with quantitative metrics, code, or statistical analysis?',
    options: [
      {
        id: 'q4-a',
        label: 'Excited — I love programming, statistical models, mathematical logic, and datasets',
        dimension: 'technical',
        tags: ['analytics', 'coding', 'mathematics', 'technology'],
        weights: { technical: 10, analytical: 10, strategic: 5, creative: 2, people: 1 },
      },
      {
        id: 'q4-b',
        label: 'Comfortable with business dashboards, Excel charts, and interpreting KPIs',
        dimension: 'analytical',
        tags: ['analytics', 'business', 'reporting'],
        weights: { analytical: 8, business: 8, strategic: 6, technical: 4, people: 3 },
      },
      {
        id: 'q4-c',
        label: 'I prefer qualitative reasoning, conceptual ideas, visual layout, and communication',
        dimension: 'creative',
        tags: ['creative', 'communication', 'visual'],
        weights: { creative: 9, people: 8, communication: 9, business: 4, analytical: 2 },
      },
      {
        id: 'q4-d',
        label: 'I prefer working hands-on with people, negotiations, and organizational leadership',
        dimension: 'people',
        tags: ['people', 'leadership', 'organization'],
        weights: { people: 10, leadership: 9, business: 7, strategic: 6, technical: 1 },
      },
    ],
  },
  {
    id: 'q5',
    category: 'Strengths & Daily Flow',
    question: 'At the end of a busy week, which achievement would make you feel most accomplished?',
    options: [
      {
        id: 'q5-a',
        label: 'Deploying a clean, working piece of software or debugging a tricky technical issue',
        dimension: 'technical',
        tags: ['development', 'coding', 'technology', 'problem-solving'],
        weights: { technical: 10, analytical: 7, creative: 4, business: 2, people: 1 },
      },
      {
        id: 'q5-b',
        label: 'Delivering an impactful data insight that changed a crucial team decision',
        dimension: 'analytical',
        tags: ['analytics', 'research', 'strategy', 'problem-solving'],
        weights: { analytical: 10, strategic: 8, business: 6, technical: 4, people: 3 },
      },
      {
        id: 'q5-c',
        label: 'Seeing people easily navigate and compliment a user interface or brand asset I designed',
        dimension: 'creative',
        tags: ['design', 'visual', 'user-focus', 'creativity'],
        weights: { creative: 10, people: 6, visual: 8, business: 3, technical: 3 },
      },
      {
        id: 'q5-d',
        label: 'Closing a deal, mentoring a peer, or reaching an organizational milestone ahead of schedule',
        dimension: 'business',
        tags: ['business', 'people', 'leadership', 'growth'],
        weights: { business: 9, people: 9, leadership: 8, strategic: 7, analytical: 3 },
      },
    ],
  },
  {
    id: 'q6',
    category: 'Learning & Skill Growth',
    question: 'When acquiring a brand new skill, what learning method gives you the quickest breakthrough?',
    options: [
      {
        id: 'q6-a',
        label: 'Diving straight into documentation, writing code experiments, and building side projects',
        dimension: 'technical',
        tags: ['technology', 'innovation', 'research'],
        weights: { technical: 10, analytical: 7, creative: 4, business: 2, people: 1 },
      },
      {
        id: 'q6-b',
        label: 'Dissecting case studies, financial reports, and real-world business decisions',
        dimension: 'business',
        tags: ['business', 'strategy', 'finance'],
        weights: { business: 9, strategic: 8, analytical: 7, people: 4, technical: 2 },
      },
      {
        id: 'q6-c',
        label: 'Deconstructing inspiring designs, moodboards, interactive demos, and UX patterns',
        dimension: 'creative',
        tags: ['design', 'creative', 'visual'],
        weights: { creative: 10, visual: 9, technical: 3, people: 4, analytical: 2 },
      },
      {
        id: 'q6-d',
        label: 'Engaging in interactive workshops, cohort discussions, and peer mentoring',
        dimension: 'people',
        tags: ['people', 'communication', 'education', 'service'],
        weights: { people: 10, communication: 9, leadership: 6, creative: 4, business: 4 },
      },
    ],
  },
]

// Dynamic questions tailored to student educational background and stream
export function getDynamicQuestionsForProfile(profile = {}) {
  const degree = (profile.degree || '').toUpperCase()
  const branch = (profile.branch || '').toLowerCase()
  const interests = (profile.interests || []).map((i) => i.toLowerCase())

  const dynamicQuestions = []

  // Case 1: Tech / CS / Engineering (B.Tech, BCA, B.Sc CS, MCA)
  if (['BCA', 'B.TECH', 'MCA', 'B.E'].some((d) => degree.includes(d)) || branch.includes('computer') || branch.includes('it') || interests.includes('ai') || interests.includes('technology')) {
    dynamicQuestions.push({
      id: 'qd-tech',
      category: 'Technical Focus',
      question: 'Within computing and technology, which specialization sparks your deepest interest?',
      options: [
        {
          id: 'qd-tech-1',
          label: 'Data Science & Artificial Intelligence (Predictive models, neural networks, analytics)',
          dimension: 'analytical',
          tags: ['analytics', 'ai', 'technology', 'mathematics'],
          weights: { analytical: 10, technical: 9, strategic: 5, creative: 2, people: 1 },
        },
        {
          id: 'qd-tech-2',
          label: 'Software & Web Engineering (Scalable applications, clean architectures, user portals)',
          dimension: 'technical',
          tags: ['technology', 'development', 'coding', 'web'],
          weights: { technical: 10, creative: 5, analytical: 6, business: 3, people: 2 },
        },
        {
          id: 'qd-tech-3',
          label: 'Cloud Infrastructure, Security & DevOps (Server architecture, SOC operations, automation)',
          dimension: 'technical',
          tags: ['infrastructure', 'security', 'technology', 'automation'],
          weights: { technical: 9, analytical: 7, strategic: 6, business: 3, creative: 1 },
        },
        {
          id: 'qd-tech-4',
          label: 'Product Management & User Experience (Feature roadmaps, UI systems, user research)',
          dimension: 'creative',
          tags: ['design', 'strategy', 'business', 'customer'],
          weights: { creative: 8, business: 8, people: 7, technical: 4, analytical: 4 },
        },
      ],
    })
  }

  // Case 2: Business & Commerce (BBA, B.Com, MBA, Economics)
  if (['BBA', 'B.COM', 'MBA'].some((d) => degree.includes(d)) || branch.includes('commerce') || branch.includes('business') || branch.includes('finance')) {
    dynamicQuestions.push({
      id: 'qd-biz',
      category: 'Business & Finance Focus',
      question: 'Which area of enterprise and market operations aligns most with your career goals?',
      options: [
        {
          id: 'qd-biz-1',
          label: 'Financial analysis, valuation, investment models, and forecasting corporate numbers',
          dimension: 'analytical',
          tags: ['finance', 'numbers', 'analysis', 'strategy'],
          weights: { analytical: 10, business: 9, strategic: 7, technical: 3, people: 2 },
        },
        {
          id: 'qd-biz-2',
          label: 'Business analysis, process optimization, ERP systems, and requirement translation',
          dimension: 'business',
          tags: ['business', 'analytics', 'operations', 'strategy'],
          weights: { business: 10, analytical: 7, strategic: 7, technical: 4, people: 5 },
        },
        {
          id: 'qd-biz-3',
          label: 'Performance marketing, search engine optimization, brand campaigns, and growth loops',
          dimension: 'creative',
          tags: ['marketing', 'growth', 'creativity', 'communication'],
          weights: { creative: 8, business: 9, communication: 8, analytical: 5, people: 5 },
        },
        {
          id: 'qd-biz-4',
          label: 'Talent management, organizational behavior, employee experience, and corporate HR',
          dimension: 'people',
          tags: ['people', 'organization', 'management', 'service'],
          weights: { people: 10, business: 7, communication: 9, strategic: 5, analytical: 2 },
        },
      ],
    })
  }

  // Case 3: Core Engineering (Mechanical, Civil, Electrical)
  if (branch.includes('civil') || branch.includes('mechanical') || branch.includes('electrical')) {
    dynamicQuestions.push({
      id: 'qd-eng',
      category: 'Engineering Applications',
      question: 'When engineering real-world solutions, what type of system do you prefer designing?',
      options: [
        {
          id: 'qd-eng-1',
          label: 'Physical structures, construction planning, site infrastructure, and building codes',
          dimension: 'technical',
          tags: ['engineering', 'construction', 'infrastructure'],
          weights: { technical: 9, analytical: 7, strategic: 6, business: 4, people: 3 },
        },
        {
          id: 'qd-eng-2',
          label: 'Electrical circuits, power distribution grids, renewable energy, and PLC automation',
          dimension: 'technical',
          tags: ['engineering', 'electronics', 'power', 'systems'],
          weights: { technical: 10, analytical: 8, systems: 8, business: 3, people: 1 },
        },
        {
          id: 'qd-eng-3',
          label: 'Mechanical mechanisms, CAD part modeling, thermal simulations, and manufacturing lines',
          dimension: 'technical',
          tags: ['engineering', 'manufacturing', 'mechanics'],
          weights: { technical: 10, analytical: 7, creative: 5, business: 3, people: 1 },
        },
        {
          id: 'qd-eng-4',
          label: 'Robotics, sensors, embedded microcontrollers, and cyber-physical systems',
          dimension: 'technical',
          tags: ['technology', 'automation', 'electronics', 'coding'],
          weights: { technical: 10, analytical: 9, creative: 6, business: 2, people: 1 },
        },
      ],
    })
  }

  // Case 4: Arts / Humanities / Design
  if (['B.A', 'B.DES'].some((d) => degree.includes(d)) || branch.includes('arts') || branch.includes('humanities') || branch.includes('design')) {
    dynamicQuestions.push({
      id: 'qd-arts',
      category: 'Creative Expression & Human Focus',
      question: 'Where would you prefer directing your creative and analytical voice?',
      options: [
        {
          id: 'qd-arts-1',
          label: 'Digital UI/UX design, interactive prototyping, and user journey psychology',
          dimension: 'creative',
          tags: ['design', 'visual', 'user-focus', 'creativity'],
          weights: { creative: 10, people: 7, technical: 4, business: 3, analytical: 3 },
        },
        {
          id: 'qd-arts-2',
          label: 'Thought leadership articles, brand storytelling, and strategic content communications',
          dimension: 'creative',
          tags: ['communication', 'writing', 'creativity', 'marketing'],
          weights: { creative: 9, communication: 10, people: 6, business: 5, analytical: 3 },
        },
        {
          id: 'qd-arts-3',
          label: 'Public policy research, socio-economic impact studies, and governance briefs',
          dimension: 'analytical',
          tags: ['policy', 'research', 'public service', 'social impact'],
          weights: { analytical: 9, strategic: 8, people: 7, communication: 7, business: 4 },
        },
        {
          id: 'qd-arts-4',
          label: 'Human resources, campus talent mentoring, and community operations',
          dimension: 'people',
          tags: ['people', 'service', 'organization', 'communication'],
          weights: { people: 10, communication: 9, business: 6, strategic: 5, creative: 4 },
        },
      ],
    })
  }

  return dynamicQuestions
}

// Assemble full question set for user
export function getFullAssessmentQuestions(profile = {}) {
  const dynamic = getDynamicQuestionsForProfile(profile)
  return [...baseAssessmentQuestions, ...dynamic]
}

// Transparent, deterministic scoring engine
export function calculateAssessmentScores(answers = [], profile = {}, careerList = []) {
  const dimensionTotals = {
    technical: 0,
    analytical: 0,
    creative: 0,
    business: 0,
    people: 0,
    strategic: 0,
    communication: 0,
  }

  const selectedTags = []

  answers.forEach((ans) => {
    if (!ans) return
    if (ans.weights) {
      Object.entries(ans.weights).forEach(([dim, val]) => {
        if (dimensionTotals[dim] !== undefined) {
          dimensionTotals[dim] += val
        }
      })
    }
    if (Array.isArray(ans.tags)) {
      selectedTags.push(...ans.tags)
    }
  })

  // Normalize dimensions to 0 - 100
  const maxPossible = Math.max(1, answers.length * 10)
  const normalizedDimensions = {
    Analytical: Math.min(98, Math.round(50 + (dimensionTotals.analytical / maxPossible) * 45)),
    Technical: Math.min(98, Math.round(50 + (dimensionTotals.technical / maxPossible) * 45)),
    Creative: Math.min(98, Math.round(48 + (dimensionTotals.creative / maxPossible) * 45)),
    Strategic: Math.min(98, Math.round(50 + (dimensionTotals.strategic || dimensionTotals.business) / maxPossible * 45)),
    Communication: Math.min(98, Math.round(50 + (dimensionTotals.communication || dimensionTotals.people) / maxPossible * 45)),
    Leadership: Math.min(98, Math.round(48 + (dimensionTotals.business / maxPossible) * 45)),
  }

  const radarData = Object.entries(normalizedDimensions).map(([subject, score]) => ({
    subject,
    score,
  }))

  const userSkills = (profile.skills || []).map((s) => s.toLowerCase().trim())
  const userInterests = (profile.interests || []).map((i) => i.toLowerCase().trim())
  const userDegree = (profile.degree || '').toUpperCase()

  const careerScores = careerList.map((career) => {
    let score = 55

    // Tag matching from quiz
    const matchedTags = career.tags.filter((t) => selectedTags.includes(t))
    score += matchedTags.length * 4.5

    // Profile skill alignment
    const matchedSkills = career.skills.filter((sk) =>
      userSkills.some((us) => us.includes(sk.toLowerCase()) || sk.toLowerCase().includes(us))
    )
    score += matchedSkills.length * 5

    // Profile interest alignment
    const matchedInterests = career.tags.filter((t) =>
      userInterests.some((ui) => ui.includes(t) || t.includes(ui))
    )
    score += matchedInterests.length * 3.5

    // Educational degree suitability bonus
    if (career.degree && career.degree.some((d) => userDegree.includes(d.toUpperCase()))) {
      score += 6
    }

    // Missing skills
    const missingSkills = career.skills.filter((sk) =>
      !userSkills.some((us) => us.includes(sk.toLowerCase()) || sk.toLowerCase().includes(us))
    )

    // Clamp score cleanly between 72% and 96%
    const finalScore = Math.min(96, Math.max(72, Math.round(score)))

    return {
      id: career.id,
      name: career.name,
      domain: career.domain,
      score: finalScore,
      salary: career.salary,
      description: career.description,
      responsibilities: career.responsibilities,
      skills: career.skills,
      tools: career.tools,
      careerPath: career.careerPath,
      learningRoadmap: career.learningRoadmap,
      matchedSkills,
      missingSkills,
      matchedTags: matchedTags.slice(0, 4),
      reason: `Matches your high ${matchedTags[0] || 'analytical'} and ${matchedTags[1] || 'problem-solving'} responses in the assessment, combined with your ${profile.degree || 'academic'} focus.`,
    }
  })

  // Sort by score descending
  careerScores.sort((a, b) => b.score - a.score)
  const topCareers = careerScores.slice(0, 3)

  // Strengths and Weaknesses
  const sortedDimensions = Object.entries(normalizedDimensions).sort((a, b) => b[1] - a[1])
  const strengths = [
    `${sortedDimensions[0][0]} Proficiency (${sortedDimensions[0][1]}%)`,
    `${sortedDimensions[1][0]} Alignment (${sortedDimensions[1][1]}%)`,
    `${sortedDimensions[2][0]} Strengths (${sortedDimensions[2][1]}%)`,
  ]

  const weaknesses = [
    `${sortedDimensions[sortedDimensions.length - 1][0]} Development (${sortedDimensions[sortedDimensions.length - 1][1]}%)`,
    `${sortedDimensions[sortedDimensions.length - 2][0]} Opportunity (${sortedDimensions[sortedDimensions.length - 2][1]}%)`,
  ]

  const missingSkills = topCareers[0] ? topCareers[0].missingSkills.slice(0, 4) : []
  const readinessScore = Math.round((topCareers[0]?.score || 78) * 0.95)

  return {
    readinessScore,
    topCareers,
    strengths,
    weaknesses,
    missingSkills,
    radarData,
  }
}
