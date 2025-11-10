import { memo, useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import TopNavigation from '@/components/layout/TopNavigation'
import FaqSection from '@/components/sections/FaqSection'
import AppDownloadSection from '@/components/sections/AppDownloadSection'
import FooterSection from '@/components/sections/FooterSection'
import { Filter, MapPin, SlidersHorizontal, Star, CheckCircle2, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api'

const useDebounce = (value, delay = 250) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Generate time slots for the next 7 days
const generateTimeSlots = () => {
  const slots = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const morningSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM']
    const afternoonSlots = ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM']
    const eveningSlots = ['06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM']
    
    const allSlots = [...morningSlots, ...afternoonSlots, ...eveningSlots]
    
    slots.push({
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      date: date.toISOString().split('T')[0],
      dateCaption: `${allSlots.length} Slots Available`,
      slots: {
        Morning: morningSlots,
        Afternoon: afternoonSlots,
        Evening: eveningSlots,
      },
    })
  }
  
  return slots
}

const daySlots = generateTimeSlots()

const DoctorCard = memo(({ doctor, expanded, onToggle, onBookAppointment, currentUser }) => {
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedTime, setSelectedTime] = useState(null)
  const slots = useMemo(() => daySlots[selectedDay], [selectedDay])

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleBook = () => {
    if (selectedTime && slots.date) {
      onBookAppointment(doctor._id, slots.date, selectedTime)
    }
  }

  const isAvailable = doctor.isAvailable !== false
  const availableText = isAvailable ? 'Available Today' : 'Not Available'

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 gap-5">
          <div className="relative h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-full border-[6px] border-[#E6F3FF] bg-[#F4F9FF]">
            {doctor.profileImage ? (
              <img
                src={doctor.profileImage}
                alt={doctor.name}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  if (!e.currentTarget.dataset.fallbackAttempted) {
                    e.currentTarget.dataset.fallbackAttempted = 'true'
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=220&h=220&fit=crop&auto=format&q=80'
                  }
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#2AA8FF]/10 text-2xl font-bold text-[#2AA8FF]">
                {doctor.name?.charAt(0) || 'D'}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#2AA8FF] text-white shadow">
              <Star className="h-3 w-3" />
            </span>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-[#102851]">Dr. {doctor.name}</h3>
              <p className="text-sm font-medium text-[#2AA8FF]">{doctor.specialization || 'General Practitioner'}</p>
              <p className="text-sm text-[#5C6169]">{doctor.experience || 'Experienced'}</p>
            </div>
            <div className="space-y-1 text-sm text-[#5C6169]">
              {doctor.location && (
                <p className="font-semibold text-[#102851]">{doctor.location}</p>
              )}
              {doctor.clinic && <p>{doctor.clinic}</p>}
              <p>
                {doctor.consultationFee ? (
                  <>
                    <span className="font-semibold text-[#3CBC74]">₹{doctor.consultationFee}</span>
                    {' '}Consultation fee at clinic
                  </>
                ) : (
                  <span className="font-semibold text-[#3CBC74]">FREE</span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {doctor.rating && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F1FFF5] px-3 py-1 text-xs font-semibold text-[#199E54]">
                  👍 {doctor.rating}%
                </span>
              )}
              {doctor.patientStories && (
                <span className="text-sm text-[#5C6169]">{doctor.patientStories} Patient Stories</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isAvailable 
              ? 'bg-[#EDFFF2] text-[#16A349]' 
              : 'bg-[#FEE2E2] text-[#DC2626]'
          }`}>
            {availableText}
          </span>
          <button
            onClick={() => onToggle(expanded ? null : doctor._id)}
            disabled={!isAvailable}
            className="inline-flex h-[48px] items-center justify-center rounded-lg bg-[#2AA8FF] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(42,168,255,0.3)] transition hover:bg-[#1896f0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {expanded ? 'Hide Slots' : isAvailable ? 'Book Appointment' : 'Not Available'}
          </button>
        </div>
      </div>

      {expanded && isAvailable && (
        <div className="border-t border-[#E6ECF5] bg-[#F8FBFF] px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE6F5] pb-4">
            <div className="flex items-center gap-3 text-sm text-[#5C6169]">
              <button
                onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                disabled={selectedDay === 0}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE6F5] bg-white text-[#2AA8FF] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F8FF] hover:text-[#2AA8FF]"
              >
                ‹
              </button>
              {daySlots.slice(selectedDay, selectedDay + 3).map((day, index) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(selectedDay + index)}
                  className={`rounded-lg px-4 py-2 text-left transition ${
                    index === 0
                      ? 'bg-white text-[#102851] shadow-[0_6px_15px_rgba(18,42,76,0.08)]'
                      : 'text-[#5C6169] hover:bg-white/50'
                  }`}
                >
                  <p className="text-sm font-medium">{day.label}</p>
                  <p className="text-xs text-[#2AA8FF]">{day.dateCaption}</p>
                </button>
              ))}
              <button
                onClick={() => setSelectedDay(Math.min(daySlots.length - 1, selectedDay + 1))}
                disabled={selectedDay >= daySlots.length - 3}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE6F5] bg-white text-[#2AA8FF] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F8FF] hover:text-[#2AA8FF]"
              >
                ›
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 text-sm text-[#102851] lg:grid-cols-3">
            {Object.entries(slots.slots).map(([session, times]) => (
              <div key={session} className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#2AA8FF]">
                  <span className="font-semibold uppercase tracking-wide">{session}</span>
                  <span className="text-[#5C6169]">{times.length} Slots Available</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {times.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        selectedTime === time
                          ? 'border-[#2AA8FF] bg-[#2AA8FF] text-white'
                          : 'border-[#E0E7F3] text-[#2AA8FF] hover:border-[#2AA8FF] hover:bg-[#2AA8FF]/10'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedTime && (
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                onClick={() => {
                  setSelectedTime(null)
                  setSelectedDay(0)
                }}
                variant="outline"
                className="border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBook}
                className="bg-[#2AA8FF] text-white hover:bg-[#1896f0]"
              >
                Book Appointment
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

const FindDoctorsPage = () => {
  const { user: currentUser } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [expandedDoctor, setExpandedDoctor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [specializationQuery, setSpecializationQuery] = useState('')
  const [filterAvailable, setFilterAvailable] = useState(false)
  const [isPendingFilters, startTransition] = useTransition()

  const debouncedSpecialization = useDebounce(specializationQuery, 250)
  const debouncedLocation = useDebounce(locationQuery, 250)
  const debouncedSearch = useDebounce(searchQuery, 250)

  const [doctors, setDoctors] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchDoctors = useCallback(
    async (pageToLoad = 1, append = false) => {
      const params = {
        page: pageToLoad,
        limit: 8,
        specialization: debouncedSpecialization || undefined,
        location: debouncedLocation || undefined,
        search: debouncedSearch || undefined,
      }

      try {
        if (append) {
          setIsLoadingMore(true)
        } else {
          setIsInitialLoading(true)
        }

        const response = await apiClient.get('/users/doctors', params)
        const items = response?.data ?? []

        setDoctors((prev) => (append ? [...prev, ...items] : items))
        setHasMore(response?.pagination?.hasMore ?? false)
        setPage(pageToLoad)
      } catch (error) {
        console.error('Failed to fetch doctors:', error)
        toast.error('Failed to load doctors', error.message || 'Please try again later.')
        if (!append) {
          setDoctors([])
        }
      } finally {
        if (append) {
          setIsLoadingMore(false)
        } else {
          setIsInitialLoading(false)
        }
      }
    },
    [debouncedLocation, debouncedSearch, debouncedSpecialization, toast]
  )

  useEffect(() => {
    fetchDoctors(1, false)
  }, [fetchDoctors])

  const handleLoadMoreDoctors = () => {
    if (!hasMore || isLoadingMore) return
    fetchDoctors(page + 1, true)
  }

  const handleBookAppointment = async (doctorId, date, time) => {
    if (!currentUser) {
      toast.warning('Login required', 'Please login to book an appointment')
      navigate('/login')
      return
    }

    if (currentUser.role !== 'patient') {
      toast.error('Access denied', 'Only patients can book appointments')
      return
    }

    try {
      await apiClient.post('/appointments', {
        patientId: currentUser._id,
        doctorId: doctorId,
        date: date,
        time: time,
        type: 'offline',
      })
      
      toast.success('Appointment booked!', `Your appointment has been scheduled for ${date} at ${time}`)
      setExpandedDoctor(null)
      // Optionally navigate to patient dashboard
      // navigate('/patient/dashboard')
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast.error('Booking failed', error.message || 'Failed to book appointment. Please try again.')
    }
  }

  const handleSearch = () => {
    // Search is handled by the query parameters
    // This function can be used for additional search logic
  }

  // Filter doctors based on availability
  const filteredDoctors = useMemo(() => {
    const source = doctors ?? []

    let filtered = source

    if (filterAvailable) {
      filtered = filtered.filter((doc) => doc.isAvailable !== false)
    }

    return filtered
  }, [doctors, filterAvailable])

  useEffect(() => {
    setExpandedDoctor(null)
  }, [debouncedSearch, debouncedLocation, debouncedSpecialization])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F1FF] via-white to-white">
      <TopNavigation />

      <main className="mx-auto mt-36 max-w-[1170px] px-6 pb-24">
        <div className="rounded-[15px] border border-[#E6ECF5] bg-white p-6 shadow-[0_6px_35px_rgba(16,40,81,0.11)]">
          <div className="grid gap-4 md:grid-cols-[1.1fr_1.1fr_auto] lg:grid-cols-[1.1fr_1.1fr_1fr_auto]">
            <div className="flex h-[56px] items-center gap-3 rounded-lg border border-[#DCE6F5] bg-[#F5F8FF] px-5">
              <MapPin className="h-5 w-5 text-[#2AA8FF]" />
              <input
                type="text"
                placeholder="Set your location"
                value={locationQuery}
                onChange={(e) =>
                  startTransition(() => {
                    setLocationQuery(e.target.value)
                  })
                }
                className="h-full w-full border-0 bg-transparent text-sm font-medium text-[#102851] placeholder:text-[#8FA3C0] focus:outline-none"
              />
            </div>
            <div className="flex h-[56px] items-center gap-3 rounded-lg border border-[#DCE6F5] bg-[#F5F8FF] px-5">
              <input
                type="text"
                placeholder="Ex. Doctor, Hospital"
                value={searchQuery}
                onChange={(e) =>
                  startTransition(() => {
                    setSearchQuery(e.target.value)
                  })
                }
                className="h-full w-full border-0 bg-transparent text-sm font-medium text-[#102851] placeholder:text-[#8FA3C0] focus:outline-none"
              />
            </div>
            <div className="hidden h-[56px] items-center gap-3 rounded-lg border border-[#DCE6F5] bg-[#F5F8FF] px-5 lg:flex">
              <input
                type="text"
                placeholder="Ex. Treatments, Speciality"
                value={specializationQuery}
                onChange={(e) =>
                  startTransition(() => {
                    setSpecializationQuery(e.target.value)
                  })
                }
                className="h-full w-full border-0 bg-transparent text-sm font-medium text-[#102851] placeholder:text-[#8FA3C0] focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="inline-flex h-[56px] items-center justify-center rounded-lg bg-[#2AA8FF] px-8 text-base font-semibold text-white shadow-[0_8px_20px_rgba(42,168,255,0.3)] transition hover:bg-[#1896f0] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isPendingFilters}
            >
              {isPendingFilters ? 'Updating…' : 'Search'}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#5C6169]">
            <button
              onClick={() => setFilterAvailable(!filterAvailable)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 transition ${
                filterAvailable
                  ? 'border-[#2AA8FF] bg-[#2AA8FF]/10 text-[#2AA8FF]'
                  : 'border-[#DCE6F5] bg-white text-[#5C6169] hover:border-[#2AA8FF]'
              }`}
            >
              <span>Available Only</span>
              {filterAvailable ? (
                <CheckCircle2 className="h-4 w-4 text-[#2AA8FF]" />
              ) : (
                <SlidersHorizontal className="h-4 w-4" />
              )}
            </button>
            <div className="flex items-center gap-2 rounded-full border border-[#DCE6F5] bg-white px-4 py-2">
              <Filter className="h-4 w-4 text-[#2AA8FF]" />
              <span>Filter</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#DCE6F5] bg-white px-4 py-2">
              <span>Sort By</span>
              <span className="font-semibold text-[#102851]">Relevance</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#102851]">
                {isInitialLoading
                  ? 'Loading doctors...'
                  : filteredDoctors.length === 0
                  ? 'No doctors found'
                  : `${filteredDoctors.length} doctor${filteredDoctors.length !== 1 ? 's' : ''} available`}
              </h2>
              <p className="text-sm text-[#5C6169]">
                Book appointments with minimum wait-time &amp; verified doctor details
              </p>
            </div>

            {isInitialLoading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="animate-pulse rounded-[18px] border border-[#E4EBF5] bg-white p-6 shadow-[0_10px_25px_rgba(18,42,76,0.08)]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-[#E7F0FF]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 rounded bg-[#E7F0FF]" />
                        <div className="h-3 w-24 rounded bg-[#F0F4FF]" />
                        <div className="h-3 w-20 rounded bg-[#F0F4FF]" />
                      </div>
                    </div>
                    <div className="mt-6 h-3 w-full rounded bg-[#F0F4FF]" />
                    <div className="mt-2 h-3 w-2/3 rounded bg-[#F0F4FF]" />
                  </div>
                ))}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F8FF]">
                  <Filter className="h-8 w-8 text-[#ABB6C7]" />
                </div>
                <p className="mt-4 text-[#5C6169]">No doctors found matching your criteria</p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setLocationQuery('')
                    setSpecializationQuery('')
                    setFilterAvailable(false)
                  }}
                  className="mt-4 bg-[#2AA8FF] text-white hover:bg-[#1896f0]"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    expanded={expandedDoctor === doctor._id}
                    onToggle={(id) => setExpandedDoctor(id)}
                    onBookAppointment={handleBookAppointment}
                    currentUser={currentUser}
                  />
                ))}
                {(hasMore || isLoadingMore) && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleLoadMoreDoctors}
                      disabled={isLoadingMore || !hasMore}
                      className="bg-[#2AA8FF] text-white hover:bg-[#1896f0]"
                    >
                      {isLoadingMore ? 'Loading…' : hasMore ? 'Load more doctors' : 'No more results'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="w-full space-y-4 lg:w-[320px]">
            <div className="rounded-[18px] border border-[#E4EBF5] bg-white p-5 shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
              <h3 className="text-base font-semibold text-[#102851]">
                Find doctors near you
              </h3>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[#5C6169]">
                {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setLocationQuery(area)}
                    className="rounded-full border border-[#DCE6F5] px-3 py-1 transition hover:border-[#2AA8FF] hover:text-[#2AA8FF]"
                  >
                    {area}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setLocationQuery('')}
                  className="flex-1 rounded-lg border border-[#DCE6F5] px-4 py-2 text-sm font-semibold text-[#2AA8FF] hover:bg-[#F5F8FF] hover:text-[#2AA8FF]"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    // Get user's current location
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(() => {
                        // In a real app, you'd reverse geocode this
                        setLocationQuery('Current Location')
                      })
                    }
                  }}
                  className="flex-1 rounded-lg bg-[#2AA8FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1896f0]"
                >
                  Use Location
                </button>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#E4EBF5] bg-white p-5 shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
              <h3 className="text-sm font-semibold text-[#2AA8FF]">Special Offer</h3>
              <p className="mt-2 text-base font-semibold text-[#102851]">
                Get a FREE Appointment with Top Doctors.
              </p>
              <p className="mt-2 text-xs uppercase tracking-wide text-[#2AA8FF]">Limited period offer</p>
            </div>
          </aside>
        </div>
      </main>

      <FaqSection />
      <AppDownloadSection />
      <FooterSection />
    </div>
  )
}

export default FindDoctorsPage
