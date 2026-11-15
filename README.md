# BUDDY — AI Career Companion 🎓🚀

**BUDDY** is a full-stack, production-ready career guidance platform designed to give students and early-career seekers clarity across every academic stream — including BCA, BBA, B.Com, B.Tech, B.Sc, B.A, B.Des, and beyond.

---

## 🌟 Key Features

### 1. Secure Authentication & Session Management
- **Full-Stack Authentication:** Real backend authentication with `bcryptjs` password hashing (salt rounds = 10) and signed JWT tokens with 7-day expiration.
- **Credential Validation:** Rejects unregistered emails and incorrect passwords with clear user feedback.
- **Route Protection:** Protects private routes (`/dashboard`, `/profile`, `/assessment`, `/results`).
- **Seamless Returning User Flow:** Remembers user session, automatically skips onboarding for returning users, and loads their personalized dashboard.

### 2. PostgreSQL with a Development Adapter
- **PostgreSQL Integration:** Uses connection pooling (`pg.Pool`) with relational tables for users, profiles, assessments, saved careers, learning progress, and feedback.
- **Automatic Schema Setup:** Executes `server/schema.sql` at startup and uses verified TLS for remote PostgreSQL connections.
- **Development-only Local Adapter:** Outside production, the app can use `data/buddy_database.json` if PostgreSQL is not configured or reachable. Production requires a working `DATABASE_URL` and stops on database errors instead of falling back to local files.

### 3. Comprehensive Student Onboarding
- First-time signup routes directly to student onboarding.
- Captures:
  - Full Name & College / University
  - Degree (BCA, BBA, B.Com, B.Sc, B.Tech, Arts, Commerce, etc.)
  - Branch / Stream & Current Year of Study
  - Interactive Skills tag selector & custom skill adder
  - Career Interests multi-select
  - Career Ambition & Goals statement

### 4. Career Explorer (24+ Pathways)
- **Featured Careers:** Displays exactly 6 featured careers when search is empty or default.
- **Comprehensive Search:** Instant search across career title, domain, degree eligibility, branch, skills, and industry tools.
- **Broad Domain Coverage:** Covers Data Science, AI Engineering, Full-Stack Development, Cybersecurity, Cloud/DevOps, Business Analysis, Corporate Finance, UI/UX Design, Marketing Strategy, Human Resources, Mechanical, Civil, Electrical Engineering, Healthcare Administration, and Public Policy.
- **Shortlisting:** One-click save to personal shortlist persisted in the database.

### 5. Multi-Dimensional Career Assessment Quiz
- **Dynamic Questions:** Automatically adapts questions to the student's declared academic degree and stream.
- **Transparent Scoring Engine:** Uses deterministic weighted scoring across 6 dimensions (Analytical, Technical, Creative, Strategic, Communication, Leadership). No random scores.
- **Comprehensive Results:** Returns Career Readiness Score, Top 3 Career Matches with percentage compatibility and rationale, Strengths, Weaknesses, and Missing Skills.
- **Action Plan Export:** One-click export of a personalized 30-day action plan (`.txt`).
- **Voluntary Retakes:** Preserves past assessment history while updating the live dashboard.

### 6. Personalized Data-Driven Dashboard
- Welcome greeting with student's actual name.
- Academic status and target career snapshot.
- Interactive **Recharts** visualizations:
  - **Radar Chart:** Multi-axial aptitude profile across dimensions.
  - **Career Comparison Matrix:** Side-by-side comparison of roles, match percentages, salaries, and required tools.
- **Strengths, Weaknesses & Missing Skills:** Clear guidance on what to improve next.
- **Interactive Roadmap Tracker:** Milestone checkboxes that sync with the backend database.
- **AI Recommendation Analysis:** Integrated with Google Gemini 2.5 API with transparent rule-based fallback.

### 7. Verified Internships & Entry-Level Jobs
- Real, verified links to reliable student platforms:
  - Internshala
  - Unstop (National student challenges & hiring tracks)
  - LinkedIn Jobs
  - Naukri Freshers Hub
  - Wellfound (AngelList startup internships)
- Official campus graduate programs (TCS NQT, Infosys Springboard, Deloitte Early Careers).

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router DOM v7, Recharts, Lucide React, Framer Motion
- **Backend:** Node.js, Express 5, JWT (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv
- **Database:** PostgreSQL (`pg`) with automatic schema setup and a development-only local adapter
- **AI Engine:** Google Gen AI SDK (`@google/genai`) with Gemini 2.5 + deterministic scoring engine

---

## 📁 Project Structure

```
HEY BUDDY/
├── server.js                     # Express API server & routes
├── server/
│   ├── db.js                     # PostgreSQL connection pool & database adapter
│   ├── schema.sql                # Complete PostgreSQL DDL schema & migrations
│   ├── careersData.js            # 24+ comprehensive career pathways
│   ├── assessmentData.js         # Core & dynamic questions and scoring engine
│   ├── opportunitiesData.js      # Verified jobs, internships & portal links
│   └── recommendationEngine.js   # Gemini AI & rule-based recommendation logic
├── src/
│   ├── App.jsx                   # Main application router & providers
│   ├── App.css                   # Custom SaaS theme & responsive layouts
│   ├── index.css                 # Global CSS & Tailwind imports
│   ├── main.jsx                  # React DOM entry point
│   ├── context/
│   │   └── AuthContext.jsx       # Auth provider, JWT state & session sync
│   ├── services/
│   │   └── api.js                # Centralized API service with Bearer auth
│   ├── components/
│   │   ├── Header.jsx            # Dynamic navigation & student profile badge
│   │   ├── Footer.jsx            # Responsive footer
│   │   └── ProtectedRoute.jsx    # Auth & Onboarding route guards
│   └── pages/
│       ├── HomePage.jsx          # Landing page with 6 featured careers & CTA
│       ├── LoginPage.jsx         # Professional login with error validation
│       ├── SignupPage.jsx        # Registration with password verification
│       ├── OnboardingPage.jsx    # Student profile onboarding form
│       ├── ExplorerPage.jsx      # Career Explorer with search & filters
│       ├── CareerDetailPage.jsx  # In-depth career blueprint & salary
│       ├── AssessmentPage.jsx    # Interactive assessment quiz
│       ├── ResultsPage.jsx       # Assessment scoring & radar analysis
│       ├── DashboardPage.jsx     # Personalized student dashboard
│       ├── SkillGapPage.jsx      # Skill gap comparison & courses
│       ├── RoadmapPage.jsx       # Milestone learning roadmap tracker
│       └── ProfilePage.jsx       # Student profile view & edit
├── .env.example                  # Environment variable template
├── .env                          # Local environment configuration
├── .gitignore                    # Excludes node_modules, .env, and local data
├── package.json                  # Scripts & dependencies
├── vite.config.js                # Vite config with API proxy
└── README.md                     # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL (optional for local development; required for production deployments)

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```env
PORT=3001
JWT_SECRET=replace-with-a-unique-random-secret

# Optional for local development; required in production
DATABASE_URL=

# Optional: Google Gemini API Key for AI features
GEMINI_API_KEY=

# Local frontend origin (Vite proxies /api to the backend)
VITE_API_BASE_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```
Replace the `JWT_SECRET` placeholder with a unique, randomly generated secret before starting the backend. Keep `.env` local and never commit it.

For deployment, set Vercel's `VITE_API_BASE_URL` to the Render backend origin (for example, `https://<your-service>.onrender.com`, without `/api`). Set Render's `FRONTEND_URL` to the Vercel frontend origin. Vercel embeds `VITE_` variables at build time, so redeploy the frontend after changing it. Multiple frontend origins may be comma-separated in `FRONTEND_URL`.

### 4. Run Development Servers
To run both backend API server and frontend client concurrently:
```bash
npm run dev:all
```

Or run them in separate terminals:
```bash
# Terminal 1: Backend API Server (Port 3001)
npm run server

# Terminal 2: Vite Frontend Dev Server (Port 5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🗄 PostgreSQL Configuration Guide

1. Create a database in PostgreSQL:
   ```sql
   CREATE DATABASE buddy_db;
   ```
2. Update `.env`:
   ```env
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/buddy_db
   ```
   For a hosted provider such as Neon, use its PostgreSQL connection string. Remote database connections require valid TLS certificates. Set `NODE_ENV=production` in production; the server will refuse to start if PostgreSQL is unavailable.
3. Restart the server (`npm run server`). BUDDY will automatically execute `server/schema.sql` and output:
   ```
   ✅ [Database] Successfully connected to PostgreSQL database.
   ✅ [Database] PostgreSQL schema and migrations initialized.
   ```

---

## 🧪 Testing & Verification

Run frontend build check:
```bash
npm run build
```

Run ESLint code verification:
```bash
npm run lint
```

---

## 🎨 Design System

- **Warm Off-White Background:** `#F8F7F2`
- **Navy Primary:** `#27364B`
- **Lavender Accent:** `#8A83D6`
- **Secondary Grey:** `#858E9C`
- **Success Mint:** `#3C7A52`
- **Typography:** `DM Sans`

---

## 📄 License
ISC License — built for students, graduates, and future thinkers.
