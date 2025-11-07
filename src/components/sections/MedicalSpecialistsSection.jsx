import { Card } from '@/components/ui/card'
import { specialists as specialistsData } from '@/data/homepage'

const MedicalSpecialistsSection = () => {
  return (
    <section className="bg-white py-24" id="doctors">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-midnight">Our Medical Specialist</h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Meet our experienced doctors who are dedicated to providing exceptional care.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {specialistsData.map(({ name, department, image }, index) => {
            const fallbackImages = [
              'https://images.unsplash.com/photo-1594824476969-4f671d2e5746?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=400&q=80',
            ]
            return (
              <Card
                key={name}
                className="relative overflow-hidden rounded-3xl border-none bg-[#F7FAFF] px-6 pb-8 pt-10 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="mx-auto mb-6 h-40 w-40 overflow-hidden rounded-full border-[6px] border-white bg-white shadow-card">
                  <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallbackAttempted) {
                        e.currentTarget.dataset.fallbackAttempted = 'true'
                        e.currentTarget.src = fallbackImages[index % fallbackImages.length] || 'https://via.placeholder.com/400?text=Doctor'
                      }
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-midnight">{name}</h3>
                <p className="text-sm font-medium text-primary">{department}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MedicalSpecialistsSection

