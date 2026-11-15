// BUDDY Career Recommendation Engine
// Supports both Google Gemini AI (when GEMINI_API_KEY is configured) and a transparent rule-based algorithm

import { GoogleGenAI } from '@google/genai'
import { careerDatabase } from './careersData.js'

export async function generateCareerRecommendations({ profile = {}, assessment = null }) {
  const geminiApiKey = process.env.GEMINI_API_KEY

  // If Gemini API Key is available, invoke real AI model
  if (geminiApiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey })
      const prompt = `
You are an expert career counselor analyzing a student profile for the career companion platform BUDDY.
Student Information:
- Name: ${profile.fullName || profile.name || 'Student'}
- College: ${profile.college || 'University'}
- Degree & Stream: ${profile.degree || 'BCA'} in ${profile.branch || 'Computer Science'}
- Year of Study: ${profile.currentYear || '1st Year'}
- Declared Skills: ${(profile.skills || []).join(', ') || 'General fundamentals'}
- Interests: ${(profile.interests || []).join(', ') || 'Technology, Problem Solving'}
- Career Goals: ${profile.careerGoals || 'Build a clear career path with high growth.'}
- Assessment Readiness Score: ${assessment?.readinessScore || 80}%

Available Career Paths to choose from:
${careerDatabase.map((c) => `- ${c.name} (${c.domain}): requires ${c.skills.join(', ')}`).join('\n')}

Generate a JSON response with:
1. "topCareers": Top 3 recommended careers from the list above, each with "name", "score" (integer 75-96), "reason" (2 sentences explaining why this fits their exact background), and "missingSkills" (skills they need to learn).
2. "readinessScore": integer (70-95)
3. "strengths": 3 specific student strengths
4. "weaknesses": 2 specific areas to improve
5. "personalizedActionPlan": 3 actionable next steps for the next 30 days
6. "engine": "Gemini AI"

Respond ONLY with valid JSON, no markdown codeblocks.
`
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      })

      const text = response.text ? response.text.trim() : ''
      const cleanedJson = text.replace(/^```json/i, '').replace(/```$/i, '').trim()
      const parsed = JSON.parse(cleanedJson)

      return {
        success: true,
        isAiPowered: true,
        engineType: 'Gemini AI (Real Model)',
        readinessScore: parsed.readinessScore || 85,
        topCareers: parsed.topCareers || [],
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        personalizedActionPlan: parsed.personalizedActionPlan || [],
      }
    } catch (err) {
      console.warn('⚠️ [AI Engine] Gemini API call failed or timed out:', err.message)
      console.warn('ℹ️ [AI Engine] Gracefully falling back to transparent rule-based recommendation engine.')
    }
  }

  // Fallback to transparent, deterministic rule-based engine
  const userSkills = (profile.skills || []).map((s) => s.toLowerCase().trim())
  const userInterests = (profile.interests || []).map((i) => i.toLowerCase().trim())
  const userDegree = (profile.degree || '').toUpperCase()

  const scoredCareers = careerDatabase.map((career) => {
    let score = 58

    // Match skills
    const matchedSkills = career.skills.filter((sk) =>
      userSkills.some((us) => us.includes(sk.toLowerCase()) || sk.toLowerCase().includes(us))
    )
    score += matchedSkills.length * 6

    // Match interests
    const matchedInterests = career.tags.filter((t) =>
      userInterests.some((ui) => ui.includes(t) || t.includes(ui))
    )
    score += matchedInterests.length * 4

    // Match degree
    if (career.degree.some((d) => userDegree.includes(d.toUpperCase()))) {
      score += 7
    }

    const missingSkills = career.skills.filter((sk) =>
      !userSkills.some((us) => us.includes(sk.toLowerCase()) || sk.toLowerCase().includes(us))
    )

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
      matchedSkills,
      missingSkills,
      reason: `Matches your ${profile.degree || 'undergraduate'} studies in ${profile.branch || 'academics'} with strong alignment in ${matchedInterests[0] || 'core competencies'} and ${matchedSkills[0] || 'problem-solving'}.`,
    }
  })

  scoredCareers.sort((a, b) => b.score - a.score)
  const topCareers = scoredCareers.slice(0, 3)

  const readinessScore = Math.round((topCareers[0]?.score || 80) * 0.94)

  const strengths = [
    `Foundational degree alignment with ${topCareers[0]?.domain || 'selected domain'}`,
    `Active interest in ${profile.interests?.[0] || 'emerging professional fields'}`,
    `Demonstrated curiosity in ${topCareers[0]?.skills?.[0] || 'core technologies'}`,
  ]

  const weaknesses = [
    `Practical portfolio projects for ${topCareers[0]?.name || 'target career'}`,
    `Production proficiency with ${topCareers[0]?.missingSkills?.[0] || 'industry-standard tools'}`,
  ]

  const personalizedActionPlan = [
    `Complete a dedicated 30-day foundational module for ${topCareers[0]?.skills?.[0] || 'core tools'}.`,
    `Build one hands-on portfolio project: ${topCareers[0]?.name} starter project.`,
    `Apply to curated fresher internships and entry-level programs listed in your BUDDY dashboard.`,
  ]

  return {
    success: true,
    isAiPowered: false,
    engineType: 'Transparent Deterministic Engine (No GEMINI_API_KEY configured)',
    readinessScore,
    topCareers,
    strengths,
    weaknesses,
    personalizedActionPlan,
  }
}
