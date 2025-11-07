import { Card } from '@/components/ui/card'
import { patientBenefits, supportChannels } from '@/data/homepage'
import { CheckCircle2 } from 'lucide-react'

const PatientCareSection = () => {
  return (
    <section
      className="py-24"
      style={{ background: 'linear-gradient(81deg, #E7F0FF 9.01%, rgba(232, 241, 255, 0.47) 89.11%)' }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-[520px]">
            <div className="grid gap-4">
              <img
                src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=700&h=400&fit=crop"
                alt="Doctor with patient consultation"
                className="h-64 w-full rounded-[28px] object-cover"
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src !== e.currentTarget.dataset.fallback) {
                    e.currentTarget.dataset.fallback = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=700&h=400&fit=crop'
                    e.currentTarget.src = e.currentTarget.dataset.fallback
                  }
                }}
              />
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=700&h=400&fit=crop"
                alt="Doctors with elderly patient in wheelchair"
                className="h-52 w-3/4 rounded-[28px] object-cover"
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src !== e.currentTarget.dataset.fallback) {
                    e.currentTarget.dataset.fallback = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=700&h=400&fit=crop'
                    e.currentTarget.src = e.currentTarget.dataset.fallback
                  }
                }}
              />
            </div>

            <div className="absolute -left-6 top-6 w-40">
              {supportChannels.map(({ title, description, icon: Icon }) => (
                <Card key={title} className="flex items-start gap-3 rounded-2xl border-none bg-white px-4 py-3 shadow-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{title}</p>
                    <p className="text-xs text-gray-600">{description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Helping patients from around the globe!</p>
          <h2 className="text-3xl font-semibold text-midnight">Patient Caring</h2>
          <p className="max-w-xl text-gray-600">
            Our goal is to deliver quality of care in a courteous, respectful, and compassionate manner. We hope you will allow us to care for you and strive to be the first and best choice for healthcare.
          </p>
          <ul className="space-y-3">
            {patientBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm font-medium text-midnight">
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default PatientCareSection

