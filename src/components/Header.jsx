import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, LogOut, Menu, X } from 'lucide-react'

export function Header() {
  const { isAuthenticated, user, profile, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/')
  }

  const studentName = profile?.full_name || (user?.email ? user.email.split('@')[0] : 'Student')
  const initial = studentName.charAt(0).toUpperCase()

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className="navbar-wrapper sticky top-0 z-50 bg-[#f8f7f2]/90 backdrop-blur-md border-b border-[#eae8e0]">
      <div className="navbar-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with generous right margin so Home link never overlaps */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link className="brand inline-flex items-center gap-2.5 text-2xl font-black tracking-tight text-[#27364b] mr-2" to="/" onClick={closeMenu}>
            <span className="brand-icon w-9 h-9 rounded-xl bg-[#27364b] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              B
            </span>
            <span className="font-extrabold tracking-tight">
              BUDDY<span className="text-[#8a83d6]">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7" aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-bold text-[#27364b] border-b-2 border-[#8a83d6] pb-0.5'
                  : 'text-sm font-semibold text-[#687386] hover:text-[#27364b] transition'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/explorer"
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-bold text-[#27364b] border-b-2 border-[#8a83d6] pb-0.5'
                  : 'text-sm font-semibold text-[#687386] hover:text-[#27364b] transition'
              }
            >
              Explorer
            </NavLink>
            <NavLink
              to="/assessment"
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-bold text-[#27364b] border-b-2 border-[#8a83d6] pb-0.5'
                  : 'text-sm font-semibold text-[#687386] hover:text-[#27364b] transition'
              }
            >
              Assessment
            </NavLink>
            <NavLink
              to="/skill-gap"
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-bold text-[#27364b] border-b-2 border-[#8a83d6] pb-0.5'
                  : 'text-sm font-semibold text-[#687386] hover:text-[#27364b] transition'
              }
            >
              Skill Gap
            </NavLink>
            <NavLink
              to="/roadmap"
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-bold text-[#27364b] border-b-2 border-[#8a83d6] pb-0.5'
                  : 'text-sm font-semibold text-[#687386] hover:text-[#27364b] transition'
              }
            >
              Roadmap
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? 'text-sm font-bold text-[#5d56a5] bg-[#eeedf8] px-2.5 py-1 rounded-lg'
                    : 'text-sm font-bold text-[#5d56a5] hover:bg-[#eeedf8] px-2.5 py-1 rounded-lg transition'
                }
              >
                Dashboard
              </NavLink>
            )}
          </nav>
        </div>

        {/* Desktop Header Actions (No duplicate Dashboard button) */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl bg-white border border-[#e5e0d7] px-3 py-1.5 text-xs font-semibold text-[#27364b] shadow-sm hover:border-[#8a83d6] transition"
                title="View Student Profile"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#27364b] text-[11px] font-bold text-white">
                  {initial}
                </span>
                <span className="max-w-[130px] truncate">{studentName}</span>
              </Link>

              <button
                type="button"
                className="flex items-center gap-1.5 rounded-xl border border-[#dfe3e8] bg-white px-3 py-1.5 text-xs font-semibold text-[#687386] hover:text-red-600 hover:border-red-200 transition"
                onClick={handleLogout}
                title="Sign out"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-[#27364b] hover:text-[#8a83d6] transition px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#27364b] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#1d2b3d] transition"
              >
                Get started <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="text-xs font-bold text-[#5d56a5] bg-[#eeedf8] px-2.5 py-1 rounded-lg"
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl border border-[#e0dad0] bg-white text-[#27364b] hover:bg-[#eeedf8] transition"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#eae8e0] bg-[#f8f7f2] px-5 py-5 space-y-4 shadow-lg animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-2.5">
            <Link
              to="/"
              onClick={closeMenu}
              className="px-3 py-2 rounded-xl text-sm font-bold text-[#27364b] hover:bg-[#eeedf8] transition"
            >
              Home
            </Link>
            <Link
              to="/explorer"
              onClick={closeMenu}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#475467] hover:bg-[#eeedf8] transition"
            >
              Career Explorer
            </Link>
            <Link
              to="/assessment"
              onClick={closeMenu}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#475467] hover:bg-[#eeedf8] transition"
            >
              Skills Assessment Quiz
            </Link>
            <Link
              to="/skill-gap"
              onClick={closeMenu}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#475467] hover:bg-[#eeedf8] transition"
            >
              Skill Gap Analyzer
            </Link>
            <Link
              to="/roadmap"
              onClick={closeMenu}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#475467] hover:bg-[#eeedf8] transition"
            >
              Learning Roadmaps
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="px-3 py-2 rounded-xl text-sm font-bold text-[#5d56a5] bg-[#eeedf8] transition"
              >
                Personalized Dashboard
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-[#eae8e0]">
            {isAuthenticated ? (
              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-xs font-semibold text-[#27364b] hover:text-[#5d56a5]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#27364b] text-xs font-bold text-white">
                    {initial}
                  </span>
                  <div>
                    <span className="block font-bold">{studentName}</span>
                    <span className="text-[10px] text-[#858e9c]">View Profile & Settings</span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center py-2.5 rounded-xl border border-[#dfe3e8] bg-white text-xs font-semibold text-[#27364b]"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="w-full text-center py-2.5 rounded-xl bg-[#27364b] text-xs font-semibold text-white shadow-sm"
                >
                  Create Student Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
export default Header
