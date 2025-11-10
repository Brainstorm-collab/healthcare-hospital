import { useTheme } from '@/contexts/ThemeContext'
import TopNavigation from '@/components/layout/TopNavigation'
import { CheckCircle, Database, Users, Calendar, FileText, Shield } from 'lucide-react'
import FaqSection from '@/components/sections/FaqSection'
import AppDownloadSection from '@/components/sections/AppDownloadSection'
import FooterSection from '@/components/sections/FooterSection'

/**
 * SoftwareForProviderPage
 * -----------------------
 * Marketing-style page describing SaaS features/benefits for healthcare providers.
 * Purely presentational; driven by static `features`/`benefits` arrays.
 */
const SoftwareForProviderPage = () => {
  const theme = useTheme()

  const features = [
    {
      icon: <Database className="h-8 w-8 text-[#2AA8FF]" />,
      title: 'Electronic Health Records',
      description: 'Comprehensive patient records management system',
    },
    {
      icon: <Calendar className="h-8 w-8 text-[#2AA8FF]" />,
      title: 'Appointment Scheduling',
      description: 'Automated scheduling and patient reminders',
    },
    {
      icon: <Users className="h-8 w-8 text-[#2AA8FF]" />,
      title: 'Patient Management',
      description: 'Complete patient lifecycle management',
    },
    {
      icon: <FileText className="h-8 w-8 text-[#2AA8FF]" />,
      title: 'Billing & Invoicing',
      description: 'Automated billing and payment processing',
    },
    {
      icon: <Shield className="h-8 w-8 text-[#2AA8FF]" />,
      title: 'HIPAA Compliant',
      description: 'Secure and compliant with healthcare regulations',
    },
  ]

  const benefits = [
    'Streamlined workflow management',
    'Reduced administrative overhead',
    'Improved patient satisfaction',
    'Real-time analytics and reports',
    'Cloud-based secure storage',
    '24/7 technical support',
  ]

  return (
    <div className="min-h-screen" style={{ background: theme.colors.backgroundGradient }}>
      <TopNavigation />

      <main className="mx-auto mt-36 max-w-[1170px] px-6 pb-24 pt-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#102851]">Healthcare Provider Software</h1>
          <p className="mt-4 text-lg text-[#5C6169]">
            Comprehensive practice management solution for healthcare providers
          </p>
        </div>

        {/* --- Hero benefit section --- */}
        <div className="mb-12 overflow-hidden rounded-[18px] border border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
          <div className="grid gap-8 p-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#102851]">Why Choose Our Software?</h2>
              <p className="mb-6 text-[#5C6169]">
                Our comprehensive healthcare management system is designed to streamline your practice operations,
                improve patient care, and boost your practice efficiency.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-[#5C6169]">
                    <CheckCircle className="h-5 w-5 text-[#2AA8FF]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center bg-[#F7FAFF] rounded-lg">
              <div className="text-center">
                <div className="mb-4 text-5xl font-bold text-[#2AA8FF]">99.9%</div>
                <div className="text-lg font-semibold text-[#102851]">Uptime Guarantee</div>
                <div className="mt-2 text-sm text-[#5C6169]">Reliable cloud infrastructure</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Feature grid --- */}
        <div className="mb-12">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#102851]">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-[18px] border border-[#E4EBF5] bg-white p-6 shadow-[0_10px_25px_rgba(18,42,76,0.08)] transition hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(18,42,76,0.15)]"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-[#102851]">{feature.title}</h3>
                <p className="text-sm text-[#5C6169]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- Call-to-action --- */}
        <div className="rounded-[18px] border border-[#E4EBF5] bg-white p-8 shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-[#102851]">Ready to Get Started?</h2>
            <p className="mb-6 text-[#5C6169]">
              Contact our sales team to schedule a demo and learn more about our solutions
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button className="rounded-lg bg-[#2AA8FF] px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(42,168,255,0.3)] transition hover:bg-[#1896f0]">
                Schedule a Demo
              </button>
              <button className="rounded-lg border border-[#2AA8FF] bg-white px-8 py-3 text-sm font-semibold text-[#2AA8FF] transition hover:bg-[#E7F0FF] hover:text-[#2AA8FF]">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </main>

      <FaqSection />
      <AppDownloadSection />
      <FooterSection />
    </div>
  )
}

export default SoftwareForProviderPage

