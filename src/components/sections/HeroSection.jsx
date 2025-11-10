import {
  navLinks,
  promotions,
  quickLinks,
} from '@/data/homepage'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Menu,
  Search,
  Stethoscope,
  User2,
  ShieldCheck,
  Check,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import LoginPromptDialog from '@/components/auth/LoginPromptDialog'

const HeroSection = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

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
    <section
      className="relative min-h-[980px] md:min-h-[1100px] lg:min-h-[1300px] overflow-visible"
      style={{ background: 'linear-gradient(81deg, #E7F0FF 9.01%, rgba(232, 241, 255, 0.47) 89.11%)' }}
    >
      <div className="absolute inset-x-0 top-0 z-30 h-10 w-full bg-[#2AA7FF] text-xs font-medium text-white sm:text-sm">
        <div className="mx-auto flex h-full max-w-[1170px] items-center justify-center px-6 text-center">
          <p className="truncate lg:whitespace-nowrap">
            The health and well-being of our patients and their health care team will always be our priority, so we follow the best practices for cleanliness.
          </p>
        </div>
      </div>

      <header className="absolute inset-x-0 top-10 z-20 mx-auto flex h-20 max-w-[1170px] items-center justify-between gap-4 px-6 lg:gap-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded bg-[#2AA8FF]">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <p className="whitespace-nowrap text-base font-bold text-[#2AA8FF]">Surya Nursing Home</p>
        </div>

        <div className="hidden items-center justify-end gap-8 lg:flex">
          <nav className="flex items-center gap-8 whitespace-nowrap text-sm font-normal text-[#102851]">
            {navLinks.map(({ label, href }) => {
              const isRoute = href.startsWith('/')
              if (isRoute) {
                return (
                  <Link key={label} to={href} className="whitespace-nowrap transition-colors hover:text-[#2AA8FF]">
                    {label}
                  </Link>
                )
              }

              return (
                <a key={label} href={href} className="whitespace-nowrap transition-colors hover:text-[#2AA8FF]">
                  {label}
                </a>
              )
            })}
          </nav>
          {isAuthenticated && user ? (
            <div className="relative user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-lg border border-[#DCE6F5] bg-white px-4 py-2 text-sm font-semibold text-[#102851] hover:bg-[#F5F8FF] transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2AA8FF]/10 text-[#2AA8FF]">
                  <UserIcon className="h-4 w-4" />
                </div>
                <span className="max-w-[100px] truncate">{user.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown className="h-4 w-4 text-[#5C6169]" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)] z-50">
                  <div className="p-2">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setShowUserMenu(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-[#102851] hover:bg-[#F5F8FF] transition"
                    >
                      Dashboard
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
          ) : (
            <Button
              asChild
              className="h-10 rounded-lg bg-[#2AA8FF] px-6 text-sm font-semibold text-white shadow-card hover:bg-[#1896f0]"
            >
              <Link to="/login">Login/Signup</Link>
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 text-[#102851] hover:text-[#102851] lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {/* Mobile Drawer (Hero header) */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
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
                ✕
              </button>
            </div>
            <nav className="px-4 py-3">
              <ul className="space-y-1">
                {navLinks.map(({ label, href }) => (
                  <li key={label}>
                    {href.startsWith('/') ? (
                      <Link
                        to={href}
                        className="block rounded-md px-3 py-2 text-sm font-medium text-[#102851] transition hover:bg-[#F5F8FF]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="block rounded-md px-3 py-2 text-sm font-medium text-[#102851] transition hover:bg-[#F5F8FF]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-[1170px] px-6 pb-10 lg:pb-[400px] pt-[136px]">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_520px]">
          <div className="space-y-4">
            <p className="max-w-[663px] text-[22px] font-medium leading-[1.2] tracking-[0.02em] text-[#102851]">
              Skip the travel! Take Online
            </p>
            <h1 className="max-w-[663px] text-[44px] font-semibold leading-[1.15] tracking-[0.01em] text-[#102851] sm:text-[48px] lg:text-[56px]">
              <span className="text-[#102851]">Doctor </span>
              <span className="text-[#2AA8FF]">Consultation</span>
            </h1>
            <p className="max-w-[570px] text-[16px] leading-[28px] tracking-[0.02em] text-[#5C6169] lg:text-[18px]">
              Connect instantly with a 24x7 specialist or choose to video visit a particular doctor.
            </p>
            <div className="flex flex-col gap-4 pt-1 sm:flex-row" id="consult-now-btn">
              <Button
                className="h-12 w-[177px] rounded-lg bg-[#2AA8FF] px-9 text-base font-medium tracking-[0.02em] text-white shadow-card hover:bg-[#1896f0]"
                onClick={() => {
                  if (isAuthenticated && user) {
                    navigate('/find-doctors')
                  } else {
                    setShowLoginPrompt(true)
                  }
                }}
              >
                Consult Now
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-4 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <span
                    key={item}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#2AA8FF]/15 text-xs font-semibold text-[#2AA8FF]">
                    24/7
                  </span>
                ))}
              </div>
              <p className="text-[#5C6169]">
                Talk with our certified doctors anytime, anywhere.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-3">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className={`h-2.5 rounded-full transition ${
                    dot === 0 ? 'w-8 bg-[#2AA8FF]' : 'w-2.5 bg-[#BCD8E9]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative flex justify-end">
            <div className="relative h-full w-full max-w-[520px]">
              <img
                src="/7804e5f2776e41d6b125a1ff07effac37d6ff11b.png"
                alt="Medical specialists"
                className="mx-auto h-[440px] w-full object-contain"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/520x440?text=Doctors';
                }}
              />
              <div className="absolute top-48 right-2 flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-[0_6px_12px_rgba(16,40,81,0.11)]">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-[#2AA8FF] text-white">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium text-[#102851]">Regular Checkup</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 lg:mt-0 lg:absolute lg:inset-x-0 lg:top-[624px] z-30 py-6">
          <div className="mx-auto max-w-[1170px] px-0 lg:px-6">
            <div className="rounded-[15px] border border-[#E6ECF5] bg-white p-5 shadow-[0_6px_35px_rgba(16,40,81,0.11)]">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex h-[50px] items-center gap-3 rounded-lg border border-[#F0F0F0] bg-[#FAFBFE] px-5">
                  <Search className="h-5 w-5 shrink-0 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Ex. Doctor, Hospital"
                    className="h-full w-full border-0 bg-transparent text-sm font-normal text-[#102851] placeholder:text-[#ABB6C7] focus:outline-none"
                  />
                </div>
                <div className="flex h-[50px] items-center gap-3 rounded-lg border border-[#F0F0F0] bg-[#FAFBFE] px-5">
                  <Stethoscope className="h-5 w-5 shrink-0 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Ex. Surgeon, Cardiologist"
                    className="h-full w-full border-0 bg-transparent text-sm font-normal text-[#102851] placeholder:text-[#ABB6C7] focus:outline-none"
                  />
                </div>
                <div className="flex h-[50px] items-center gap-3 rounded-lg border border-[#F0F0F0] bg-[#FAFBFE] px-5">
                  <MapPin className="h-5 w-5 shrink-0 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Set your location"
                    className="h-full w-full border-0 bg-transparent text-sm font-normal text-[#102851] placeholder:text-[#ABB6C7] focus:outline-none"
                  />
                </div>
                <Button className="h-[50px] w-full rounded-lg bg-[#2AA8FF] text-base font-medium tracking-[0.02em] text-white shadow-card hover:bg-[#1896f0] lg:w-[121px]">
                  Search
                </Button>
              </div>

              <div className="mt-6">
                <p className="text-center text-[20px] font-medium leading-[30px] tracking-[0.02em] text-[#102851]">
                  You may be looking for
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {quickLinks.map(({ label, icon: Icon, isActive }) => (
                    <div
                      key={label}
                      className={`flex min-h-[112px] w-full flex-col items-center justify-center gap-3 rounded-lg border ${
                        isActive
                          ? 'border-[#2AA8FF] bg-[#2AA8FF]/8'
                          : 'border-[#F0F0F0] bg-[#FAFBFE]'
                      } transition hover:shadow-soft`}
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                          isActive ? 'bg-[#2AA8FF] text-white' : 'bg-white text-[#2AA8FF]'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span
                        className={`text-sm sm:text-base leading-[1.4] tracking-[0.02em] ${
                          isActive ? 'font-semibold text-[#2AA8FF]' : 'font-normal text-[#ABB6C7]'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 lg:mt-0 lg:absolute lg:inset-x-0 lg:top-[calc(624px+380px)] z-40">
          <div className="mx-auto max-w-[1170px] px-0 lg:px-6">
            <div className="rounded-[15px] border border-[#E6ECF5] bg-white p-6 shadow-[0_6px_35px_rgba(16,40,81,0.11)]">
              <div className="grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {promotions.map(({ title, description, action, image }, index) => (
                  <div
                    key={`${title}-${index}`}
                    className="relative overflow-hidden rounded-[16px] md:rounded-[20px] border border-[#E6ECF5] bg-white p-5 md:p-6 shadow-soft"
                  >
                    <div className="max-w-[75%] md:max-w-[60%] space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#2AA8FF]">{title}</p>
                      <h3 className="text-lg font-semibold text-[#102851]">{description}</h3>
                      <Button
                        variant="outline"
                        className="h-8 rounded-lg border-[#2AA8FF] bg-white px-4 text-xs font-semibold text-[#2AA8FF] hover:bg-[#2AA8FF] hover:text-white"
                      >
                        {action}
                      </Button>
                    </div>
                    <img
                      src={image}
                      alt={title}
                      className="absolute -right-2 bottom-0 h-24 w-24 md:h-32 md:w-32 rounded-full object-cover shadow-soft"
                      onError={(e) => {
                        if (!e.currentTarget.dataset.fallbackAttempted) {
                          e.currentTarget.dataset.fallbackAttempted = 'true'
                          const fallbackImages = [
                            'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop',
                          ]
                          e.currentTarget.src = fallbackImages[index % fallbackImages.length] || 'https://via.placeholder.com/128?text=Offer'
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 pt-4">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className={`h-2.5 rounded-full transition ${
                      dot === 1 ? 'w-8 bg-[#2AA8FF]' : 'w-2.5 bg-[#BCD8E9]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        message="Please log in to consult with doctors."
      />
    </section>
  )
}

export default HeroSection

