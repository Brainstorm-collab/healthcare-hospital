import { Link, useLocation, useNavigate } from 'react-router-dom'
import { navLinks } from '@/data/homepage'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import UserRoleBadge from '@/components/UserRoleBadge'
import { LogOut, User as UserIcon, ChevronDown, ShieldCheck, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const TopNavigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const { totalItems } = useCart()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const getDashboardPath = () => {
    if (!user) return '/login'
    if (user.role === 'doctor') return '/doctor/dashboard'
    if (user.role === 'patient') return '/patient/dashboard'
    return '/login'
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showUserMenu])

  return (
    <div className="fixed inset-x-0 top-0 z-40">
      {/* Top Banner - Same as Home Page */}
      <div className="h-10 w-full bg-[#2AA7FF] text-xs font-medium text-white sm:text-sm">
        <div className="mx-auto flex h-full max-w-[1170px] items-center justify-center px-6 text-center">
          <p className="truncate lg:whitespace-nowrap">
            The health and well-being of our patients and their health care team will always be our priority, so we follow the best practices for cleanliness.
          </p>
        </div>
      </div>
      
      {/* Header - Same as Home Page */}
      <header className="border-b border-[#DCE6F5] bg-white/90 backdrop-blur">
        <div className={`mx-auto flex h-20 max-w-[1170px] items-center justify-between gap-4 lg:gap-8 ${
          location.pathname === '/' 
            ? 'px-4 sm:px-6' 
            : 'pl-0 pr-4 sm:pl-0 sm:pr-6 lg:pl-0 lg:pr-6'
        }`}>
          {/* Logo - Same as Home Page */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="relative flex h-10 w-10 items-center justify-center rounded bg-[#2AA8FF]">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <p className="whitespace-nowrap text-base font-bold text-[#2AA8FF]">Surya Nursing Home</p>
          </Link>

          {/* Navigation Links - Same as Home Page */}
          <div className="hidden items-center justify-end gap-8 lg:flex flex-1">
            <nav className="flex items-center gap-6 xl:gap-8 whitespace-nowrap text-sm font-normal text-[#102851] overflow-x-auto scrollbar-hide">
              {navLinks.map(({ label, href }) => {
                const isRoute = href.startsWith('/')
                const isActive = isRoute && location.pathname === href
                if (isRoute) {
                  return (
                    <Link
                      key={label}
                      to={href}
                      className={`whitespace-nowrap transition-colors hover:text-[#2AA8FF] shrink-0 ${isActive ? 'text-[#2AA8FF]' : ''}`}
                    >
                      {label}
                    </Link>
                  )
                }
                return (
                  <a
                    key={label}
                    href={href}
                    className="whitespace-nowrap transition-colors hover:text-[#2AA8FF] shrink-0"
                  >
                    {label}
                  </a>
                )
              })}
            </nav>
            
            {/* User Menu - Same as Home Page */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <UserRoleBadge />
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 rounded-lg border border-[#DCE6F5] bg-white px-4 py-2 text-sm font-semibold text-[#102851] hover:bg-[#F5F8FF] transition"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2AA8FF]/10 text-[#2AA8FF]">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <span className="max-w-[120px] truncate">{user.name?.split(' ')[0] || 'User'}</span>
                      <ChevronDown className="h-4 w-4 text-[#5C6169]" />
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)] z-50">
                        <div className="p-2">
                          <Link
                            to={getDashboardPath()}
                            onClick={() => setShowUserMenu(false)}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851] transition"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/cart"
                            onClick={() => setShowUserMenu(false)}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851] transition"
                          >
                            Cart {totalItems > 0 ? `(${totalItems})` : ''}
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Button
                  asChild
                  className="h-10 rounded-lg bg-[#2AA8FF] px-6 text-sm font-semibold text-white shadow-card hover:bg-[#1896f0]"
                >
                  <Link to="/login">Login/Signup</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button - Same as Home Page */}
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 text-[#102851] hover:text-[#102851] lg:hidden shrink-0"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] overflow-y-auto border-l border-[#E4EBF5] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E4EBF5] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-[#2AA8FF]">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-bold text-[#2AA8FF]">Surya Nursing Home</span>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="rounded p-2 text-[#102851] hover:bg-[#F5F8FF]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="px-4 py-3">
              <ul className="space-y-1">
                {navLinks.map(({ label, href }) => {
                  const isRoute = href.startsWith('/')
                  const isActive = isRoute && location.pathname === href
                  const common = `block rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-[#E7F0FF] text-[#2AA8FF]' : 'text-[#102851] hover:bg-[#F5F8FF]'
                  }`
                  return (
                    <li key={label}>
                      {isRoute ? (
                        <Link
                          to={href}
                          className={common}
                          onClick={() => setMobileOpen(false)}
                        >
                          {label}
                        </Link>
                      ) : (
                        <a
                          href={href}
                          className={common}
                          onClick={() => setMobileOpen(false)}
                        >
                          {label}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="border-t border-[#E4EBF5] px-4 py-3">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-[#DCE6F5] bg-white px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2AA8FF]/10 text-[#2AA8FF]">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <span className="truncate text-sm font-semibold text-[#102851]">
                        {user.name || 'User'}
                      </span>
                    </div>
                    <UserRoleBadge />
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg border border-[#DCE6F5] px-3 py-2 text-sm font-semibold text-[#102851] hover:bg-[#F5F8FF]"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg border border-[#DCE6F5] px-3 py-2 text-sm font-semibold text-[#102851] hover:bg-[#F5F8FF]"
                  >
                    Cart {totalItems > 0 ? `(${totalItems})` : ''}
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg border border-[#DCE6F5] px-3 py-2 text-sm font-semibold text-[#102851] hover:bg-[#F5F8FF]"
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg border border-[#DCE6F5] px-3 py-2 text-sm font-semibold text-[#102851] hover:bg-[#F5F8FF]"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Button
                  asChild
                  className="h-10 w-full rounded-lg bg-[#2AA8FF] px-6 text-sm font-semibold text-white hover:bg-[#1896f0]"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link to="/login">Login/Signup</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TopNavigation

