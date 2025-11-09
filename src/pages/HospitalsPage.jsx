import { useTheme } from '@/contexts/ThemeContext'
import TopNavigation from '@/components/layout/TopNavigation'
import { hospitals } from '@/data/hospitals'
import { Star, MapPin, Calendar, Users } from 'lucide-react'
import FaqSection from '@/components/sections/FaqSection'
import AppDownloadSection from '@/components/sections/AppDownloadSection'
import FooterSection from '@/components/sections/FooterSection'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

const HospitalsPage = () => {
  const theme = useTheme()
  const [selectedHospital, setSelectedHospital] = useState(null)

  return (
    <div className="min-h-screen" style={{ background: theme.colors.backgroundGradient }}>
      <TopNavigation />

      <main className="mx-auto mt-36 max-w-[1170px] px-6 pb-24 pt-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#102851]">Find Best Hospitals</h1>
          <p className="mt-4 text-lg text-[#5C6169]">
            Discover top-rated hospitals with advanced facilities and expert medical care
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {hospitals.map((hospital, index) => (
            <div
              key={hospital.id}
              className="overflow-hidden rounded-[18px] border border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)] transition hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(18,42,76,0.15)]"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallbackAttempted) {
                      e.currentTarget.dataset.fallbackAttempted = 'true'
                      const hospitalFallbacks = [
                        'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=480&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1576765974028-006fce9ce6cf?w=800&h=480&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=480&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1581594693700-8c8d5a7014a1?w=800&h=480&fit=crop&auto=format&q=80',
                      ]
                      e.currentTarget.src = hospitalFallbacks[index % hospitalFallbacks.length]
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">{hospital.name}</h3>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold text-[#102851]">{hospital.rating}</span>
                  <span className="text-sm text-[#5C6169]">({hospital.reviews} reviews)</span>
                </div>

                <div className="mb-4 space-y-2 text-sm text-[#5C6169]">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#2AA8FF]" />
                    <span>{hospital.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#2AA8FF]" />
                    <span>Established: {hospital.established}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#2AA8FF]" />
                    <span>{hospital.beds} Beds</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="mb-2 text-sm font-semibold text-[#102851]">Specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-[#E7F0FF] px-3 py-1 text-xs font-medium text-[#2AA8FF]"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className="w-full rounded-lg bg-[#2AA8FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(42,168,255,0.3)] transition hover:bg-[#1896f0] hover:text-white"
                  onClick={() => setSelectedHospital(hospital)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Details Modal */}
      <Dialog open={!!selectedHospital} onOpenChange={(open) => !open && setSelectedHospital(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedHospital && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-[#102851]">{selectedHospital.name}</DialogTitle>
                <DialogDescription className="text-[#5C6169]">
                  {selectedHospital.location} • Established {selectedHospital.established} • {selectedHospital.beds} Beds
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <img
                  src={selectedHospital.image}
                  alt={selectedHospital.name}
                  className="h-48 w-full rounded-lg object-cover"
                  onError={(e) => {
                    const fallbacks = [
                      'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=480&fit=crop&auto=format&q=80',
                      'https://images.unsplash.com/photo-1576765974028-006fce9ce6cf?w=800&h=480&fit=crop&auto=format&q=80',
                    ]
                    e.currentTarget.src = fallbacks[0]
                  }}
                />
                <div className="space-y-3 text-sm">
                  <p className="text-[#102851] font-semibold">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.specialties.map((s, i) => (
                      <span key={i} className="rounded-full bg-[#E7F0FF] px-3 py-1 text-xs font-medium text-[#2AA8FF]">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-[#5C6169]">
                    This hospital is equipped with modern facilities and expert medical staff to provide comprehensive
                    care across multiple specialties.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <FaqSection />
      <AppDownloadSection />
      <FooterSection />
    </div>
  )
}

export default HospitalsPage

