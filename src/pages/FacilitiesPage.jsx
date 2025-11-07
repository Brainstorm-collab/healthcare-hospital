import { useTheme } from '@/contexts/ThemeContext'
import TopNavigation from '@/components/layout/TopNavigation'
import { facilities } from '@/data/facilities'
import { CheckCircle } from 'lucide-react'
import FaqSection from '@/components/sections/FaqSection'
import AppDownloadSection from '@/components/sections/AppDownloadSection'
import FooterSection from '@/components/sections/FooterSection'

const FacilitiesPage = () => {
  const theme = useTheme()

  return (
    <div className="min-h-screen" style={{ background: theme.colors.backgroundGradient }}>
      <TopNavigation />

      <main className="mx-auto mt-36 max-w-[1170px] px-6 pb-24 pt-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#102851]">Our Facilities</h1>
          <p className="mt-4 text-lg text-[#5C6169]">
            State-of-the-art facilities designed to provide the best healthcare services
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="overflow-hidden rounded-[18px] border border-[#E4EBF5] bg-white p-6 shadow-[0_10px_25px_rgba(18,42,76,0.08)] transition hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(18,42,76,0.15)]"
            >
              <div className="mb-4 text-5xl">{facility.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-[#102851]">{facility.name}</h3>
              <p className="mb-4 text-sm text-[#5C6169]">{facility.description}</p>
              <div className="flex items-center gap-2">
                {facility.available ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-[#199E54]" />
                    <span className="text-sm font-medium text-[#199E54]">Available</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-[#EF4444]" />
                    <span className="text-sm font-medium text-[#EF4444]">Not Available</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[18px] border border-[#E4EBF5] bg-white p-8 shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
          <h2 className="mb-4 text-2xl font-bold text-[#102851]">Additional Information</h2>
          <div className="space-y-4 text-[#5C6169]">
            <p>
              Our healthcare facility is equipped with modern medical equipment and staffed by experienced
              professionals dedicated to providing exceptional patient care.
            </p>
            <p>
              We continuously invest in upgrading our facilities to ensure we meet the highest standards of
              healthcare delivery.
            </p>
            <p>
              For more information about our facilities or to schedule a visit, please contact our administration
              office.
            </p>
          </div>
        </div>
      </main>

      <FaqSection />
      <AppDownloadSection />
      <FooterSection />
    </div>
  )
}

export default FacilitiesPage

