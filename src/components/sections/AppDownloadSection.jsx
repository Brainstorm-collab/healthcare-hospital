import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { appScreens } from '@/data/homepage'
import { ArrowRight, Send } from 'lucide-react'

const AppDownloadSection = () => {
  return (
    <section className="bg-[#F0F6FF] py-24" id="app">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1fr_1fr]">
        <div className="order-2 flex justify-center lg:order-1">
          <div className="relative flex w-full max-w-[420px] justify-center">
            <Card className="absolute left-0 top-1/2 w-40 -translate-y-1/2 rounded-3xl border-none bg-white p-4 text-left shadow-card">
              <p className="text-sm font-semibold text-midnight">Hello, Robin</p>
              <p className="mt-1 text-xs text-gray-500">1 Appointment scheduled for today</p>
            </Card>
            {appScreens.map((src, index) => (
              <div
                key={src}
                className={`relative h-[420px] w-[210px] overflow-hidden rounded-[32px] bg-white shadow-card transition ${
                  index === 0 ? '-rotate-2 translate-y-8' : 'rotate-3'
                }`}
              >
                <img
                  src={src}
                  alt="App screen"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallbackAttempted) {
                      e.currentTarget.dataset.fallbackAttempted = 'true'
                      const fallbackImages = [
                        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=320&h=640&fit=crop',
                        'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=320&h=640&fit=crop',
                      ]
                      e.currentTarget.src = fallbackImages[index % fallbackImages.length] || 'https://via.placeholder.com/320?text=App'
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 space-y-6 lg:order-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Download the Surya Nursing Home App</p>
          <h2 className="text-3xl font-semibold text-midnight">Get the link to download the app</h2>
          <p className="text-gray-600">
            Stay connected with your doctors, manage appointments, track prescriptions, and access health records on the go.
          </p>
          <form className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 rounded-full bg-white px-1 py-1 shadow-inner">
              <Input
                type="tel"
                placeholder="Enter phone number"
                className="h-12 rounded-full border-none bg-transparent text-base"
              />
            </div>
            <Button size="lg" className="h-12 rounded-full px-8 shadow-card">
              <Send className="h-5 w-5" />
              Send SMS
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button variant="outline" className="h-12 rounded-full border-gray-300 px-6 text-sm font-semibold text-midnight hover:text-midnight">
              Google Play
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-12 rounded-full border-gray-300 px-6 text-sm font-semibold text-midnight hover:text-midnight">
              App Store
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppDownloadSection

