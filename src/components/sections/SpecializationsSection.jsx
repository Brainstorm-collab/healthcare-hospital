import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { specializations } from '@/data/homepage'

const SpecializationsSection = () => {
  return (
    <section
      className="relative z-0 mt-32 py-24"
      style={{ background: 'linear-gradient(81deg, #E7F0FF 9.01%, rgba(232, 241, 255, 0.47) 89.11%)' }}
      id="specialisations"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-midnight">Find By Specialisation</h2>
          <p className="text-sm text-gray-600 sm:text-base">
            Search specialists across departments and book appointments that suit your schedule.
          </p>
        </div>
        <div className="grid w-full gap-5 md:grid-cols-2 lg:grid-cols-4">
          {specializations.map(({ name, icon: Icon }) => (
            <Card
              key={name}
              className="group flex h-full flex-col items-center gap-3 rounded-3xl border-none bg-white px-8 py-10 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                <Icon className="h-7 w-7" />
              </div>
              <p className="text-lg font-semibold text-midnight">{name}</p>
            </Card>
          ))}
        </div>
        <Button size="lg" variant="ghost" className="h-12 rounded-full border border-primary/30 px-8 text-primary hover:bg-primary/10 hover:text-primary">
          View All
        </Button>
      </div>
    </section>
  )
}

export default SpecializationsSection

