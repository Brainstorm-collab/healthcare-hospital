import { Card } from '@/components/ui/card'
import { stats } from '@/data/homepage'

const FamiliesSection = () => {
  return (
    <section
      className="py-24"
      style={{ background: 'linear-gradient(81deg, #E7F0FF 9.01%, rgba(232, 241, 255, 0.47) 89.11%)' }}
      id="families"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Caring for the health of you and your family</p>
          <h2 className="mt-3 text-3xl font-semibold text-midnight">Our Families</h2>
          <p className="mt-5 max-w-2xl text-gray-600">
            We work with you to develop individualized care plans, including management of chronic diseases. If we cannot assist, we can provide referrals or advice about the type of practitioner you require.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="flex flex-col gap-2 rounded-3xl border-none bg-white px-6 py-8 text-left shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-2xl font-semibold text-midnight">{value}</p>
              <p className="text-sm text-gray-600">{label}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FamiliesSection

