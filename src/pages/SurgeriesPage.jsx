import { useTheme } from '@/contexts/ThemeContext'
import TopNavigation from '@/components/layout/TopNavigation'
import { surgeries } from '@/data/surgeries'
import { Clock, Calendar, DollarSign, Stethoscope } from 'lucide-react'
import FaqSection from '@/components/sections/FaqSection'
import AppDownloadSection from '@/components/sections/AppDownloadSection'
import FooterSection from '@/components/sections/FooterSection'
import { useNavigate } from 'react-router-dom'

const SurgeriesPage = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const fallbackImages = [
    'https://images.unsplash.com/photo-1580281657527-47f249e8f4ff?w=800&h=480&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=480&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?w=800&h=480&fit=crop&auto=format&q=80',
  ]
  const kneeFallback = [
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=480&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1580281657527-47f249e8f4ff?w=800&h=480&fit=crop&auto=format&q=80',
  ]

  return (
    <div className="min-h-screen" style={{ background: theme.colors.backgroundGradient }}>
      <TopNavigation />

      <main className="mx-auto mt-36 max-w-[1170px] px-6 pb-24 pt-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#102851]">Surgical Procedures</h1>
          <p className="mt-4 text-lg text-[#5C6169]">
            Expert surgical care with advanced techniques and experienced surgeons
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {surgeries.map((surgery, index) => (
            <div
              key={surgery.id}
              className="overflow-hidden rounded-[18px] border border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)] transition hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(18,42,76,0.15)]"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={surgery.image}
                  alt={surgery.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget
                    const relatedFallbacks = surgery.name.includes('Knee') ? kneeFallback : fallbackImages
                    if (!img.dataset.fallbackAttempted) {
                      img.dataset.fallbackAttempted = 'true'
                      img.src = relatedFallbacks[index % relatedFallbacks.length]
                    } else if (!img.dataset.placeholderUsed) {
                      img.dataset.placeholderUsed = 'true'
                      img.src = 'https://via.placeholder.com/800x480?text=Surgery'
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="mb-2 inline-block rounded-full bg-[#2AA8FF] px-3 py-1 text-xs font-semibold text-white">
                    {surgery.category}
                  </span>
                  <h3 className="text-xl font-bold text-white">{surgery.name}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="mb-4 text-sm text-[#5C6169]">{surgery.description}</p>

                <div className="mb-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#5C6169]">
                    <Clock className="h-4 w-4 text-[#2AA8FF]" />
                    <span className="font-medium">Duration:</span>
                    <span>{surgery.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5C6169]">
                    <Calendar className="h-4 w-4 text-[#2AA8FF]" />
                    <span className="font-medium">Recovery:</span>
                    <span>{surgery.recovery}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5C6169]">
                    <DollarSign className="h-4 w-4 text-[#2AA8FF]" />
                    <span className="font-medium">Cost:</span>
                    <span className="font-semibold text-[#102851]">{surgery.cost}</span>
                  </div>
                </div>

                <button
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2AA8FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(42,168,255,0.3)] transition hover:bg-[#1896f0]"
                  onClick={() => navigate('/find-doctors')}
                >
                  <Stethoscope className="h-4 w-4" />
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <FaqSection />
      <AppDownloadSection />
      <FooterSection />
    </div>
  )
}

export default SurgeriesPage

