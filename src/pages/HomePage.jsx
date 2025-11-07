import HeroSection from '@/components/sections/HeroSection'
import SpecializationsSection from '@/components/sections/SpecializationsSection'
import MedicalSpecialistsSection from '@/components/sections/MedicalSpecialistsSection'
import PatientCareSection from '@/components/sections/PatientCareSection'
import LatestNewsSection from '@/components/sections/LatestNewsSection'
import FamiliesSection from '@/components/sections/FamiliesSection'
import FaqSection from '@/components/sections/FaqSection'
import AppDownloadSection from '@/components/sections/AppDownloadSection'
import FooterSection from '@/components/sections/FooterSection'

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HeroSection />
      <SpecializationsSection />
      <MedicalSpecialistsSection />
      <PatientCareSection />
      <LatestNewsSection />
      <FamiliesSection />
      <FaqSection />
      <AppDownloadSection />
      <FooterSection />
    </div>
  )
}

export default HomePage


