import { Button } from '@/components/ui/button'
import { contactDetails, footerLinks } from '@/data/homepage'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
}

const FooterSection = () => {
  return (
    <footer className="bg-midnight text-white" id="contact">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(2,minmax(0,1fr))]">
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold text-primary">Surya Nursing Home</p>
              <p className="mt-3 max-w-md text-sm text-white/70">Sahibabad, Ghaziabad, Uttar Pradesh 201005</p>
              <div className="mt-4 space-y-2 text-sm text-white/70">
                <p>Phone: {contactDetails.phone}</p>
                <p>Email: {contactDetails.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {contactDetails.socials.map(({ label, href }) => {
                const Icon = socialIcons[label]
                return (
                  <Button
                    key={label}
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-primary hover:text-white"
                    asChild
                  >
                    <a href={href} target="_blank" rel="noreferrer">
                      <Icon className="h-5 w-5" />
                    </a>
                  </Button>
                )
              })}
            </div>
          </div>

          {footerLinks.map(({ title, links }) => (
            <div key={title} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="transition hover:text-primary">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-center text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © 2023 SuryaNursingHome.com. All Rights Reserved</p>
          <p>Design by Ajay Mongia</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection

