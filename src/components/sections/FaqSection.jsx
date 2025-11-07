import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { faqs, hotline } from '@/data/homepage'
import { HeartHandshake } from 'lucide-react'

const FaqSection = () => {
  return (
    <section className="bg-white py-24" id="faqs">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative">
          <div className="overflow-hidden rounded-[32px] bg-white shadow-card">
            <img
              src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=720&h=500&fit=crop&auto=format&q=80"
              alt="Patient support and answers"
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                if (!e.currentTarget.dataset.fallbackAttempted) {
                  e.currentTarget.dataset.fallbackAttempted = 'true'
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1576765607924-b9de3d6a23f0?w=720&h=500&fit=crop&auto=format&q=80'
                }
              }}
            />
          </div>
          <Card className="absolute -bottom-8 left-6 flex items-center gap-3 rounded-2xl border-none bg-white px-5 py-4 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-midnight">{hotline.value} {hotline.label}</p>
              <p className="text-xs text-gray-500">Trusted & experienced senior care</p>
            </div>
          </Card>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Get Your Answer</p>
          <h2 className="mt-3 text-3xl font-semibold text-midnight">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-[#F7FAFF] px-6">
            {faqs.map(({ question, answer }, index) => (
              <AccordionItem key={question} value={`item-${index}`} className="border-none">
                <AccordionTrigger className="text-left text-base font-semibold text-midnight">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600">{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default FaqSection

