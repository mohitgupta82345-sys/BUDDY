import { Link } from 'react-router-dom'
import { Sparkles, ShieldCheck } from 'lucide-react'

export function Footer() {
  return (
    <footer className="site-footer bg-[#f4f2ea] border-t border-[#eae8e0] mt-16 text-[#27364b]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#e2ddd4]">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#27364b] text-white flex items-center justify-center font-bold text-base shadow-sm">
                B
              </span>
              <span className="text-xl font-black tracking-tight">
                BUDDY<span className="text-[#8a83d6]">.</span>
              </span>
            </div>
            <p className="text-xs text-[#687386] leading-relaxed">
              Your personalized AI career companion. Transforming career exploration through transparent aptitude scoring, skill-gap guidance, and tailored learning roadmaps.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#e0dad0] px-2.5 py-1 text-[11px] font-semibold text-[#3c7a52]">
              <ShieldCheck size={13} />
              <span>Independent & Student-First</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#858e9c] mb-3">
              Platform Pathways
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#52607a]">
              <li>
                <Link to="/explorer" className="hover:text-[#8a83d6] transition">Career Explorer (24+ Pathways)</Link>
              </li>
              <li>
                <Link to="/assessment" className="hover:text-[#8a83d6] transition">Career Assessment Quiz</Link>
              </li>
              <li>
                <Link to="/skill-gap" className="hover:text-[#8a83d6] transition">Skill Gap Analyzer</Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-[#8a83d6] transition">Milestone Learning Roadmaps</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#8a83d6] transition">Personalized Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Academic Degrees & Domains */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#858e9c] mb-3">
              Supported Streams
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#52607a]">
              <li>
                <Link to="/explorer?search=BCA" className="hover:text-[#8a83d6] transition">BCA & Computer Applications</Link>
              </li>
              <li>
                <Link to="/explorer?search=B.Tech" className="hover:text-[#8a83d6] transition">B.Tech & Core Engineering</Link>
              </li>
              <li>
                <Link to="/explorer?search=BBA" className="hover:text-[#8a83d6] transition">BBA & Business Management</Link>
              </li>
              <li>
                <Link to="/explorer?search=B.Com" className="hover:text-[#8a83d6] transition">B.Com & Corporate Finance</Link>
              </li>
              <li>
                <Link to="/explorer?search=Design" className="hover:text-[#8a83d6] transition">B.Des & Visual Design</Link>
              </li>
            </ul>
          </div>

          {/* Transparency & Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#858e9c] mb-3">
              Data & Transparency
            </h4>
            <p className="text-[11px] text-[#687386] leading-relaxed mb-3">
              Salary ranges represent estimated Indian fresher compensation (LPA) compiled from reliable industry benchmarks (Glassdoor, AmbitionBox, NASSCOM).
            </p>
            <p className="text-[11px] text-[#687386] leading-relaxed">
              Assessment scoring is deterministic based on weighted aptitude dimensions. AI recommendation analysis uses Google Gemini only when configured.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#858e9c] gap-3">
          <p>© {new Date().getFullYear()} BUDDY Platform. All rights reserved. Built for students & future thinkers.</p>
          <div className="flex items-center gap-2 font-medium text-[#5d56a5]">
            <Sparkles size={14} />
            <span>Less Confusion · More Clarity · A Better Future</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
