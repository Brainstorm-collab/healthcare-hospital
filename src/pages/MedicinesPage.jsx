import { useTheme } from '@/contexts/ThemeContext'
import TopNavigation from '@/components/layout/TopNavigation'
import { medicines } from '@/data/medicines'
import { ShoppingCart, Pill, AlertCircle } from 'lucide-react'
import FaqSection from '@/components/sections/FaqSection'
import AppDownloadSection from '@/components/sections/AppDownloadSection'
import FooterSection from '@/components/sections/FooterSection'

const MedicinesPage = () => {
  const theme = useTheme()

  return (
    <div className="min-h-screen" style={{ background: theme.colors.backgroundGradient }}>
      <TopNavigation />

      <main className="mx-auto mt-36 max-w-[1170px] px-6 pb-24 pt-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#102851]">Online Medicine Store</h1>
          <p className="mt-4 text-lg text-[#5C6169]">
            Order genuine medicines online with fast delivery and great discounts
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {medicines.map((medicine) => {
            const discountedPrice = medicine.price - (medicine.price * medicine.discount) / 100

            return (
              <div
                key={medicine.id}
                className="overflow-hidden rounded-[18px] border border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)] transition hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(18,42,76,0.15)]"
              >
                <div className="relative flex h-48 items-center justify-center bg-[#F7FAFF] p-6">
                  <img
                    src={medicine.image}
                    alt={medicine.name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallbackAttempted) {
                        e.currentTarget.dataset.fallbackAttempted = 'true'
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=360&h=360&fit=crop&auto=format&q=80'
                      }
                    }}
                  />
                  {medicine.prescription && (
                    <div className="absolute top-2 right-2 rounded-full bg-[#FF6B6B] px-2 py-1 text-xs font-semibold text-white">
                      Rx
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-[#102851]">{medicine.name}</h3>
                  <p className="mb-3 text-sm text-[#5C6169]">by {medicine.manufacturer}</p>

                  <div className="mb-4 flex items-center gap-3">
                    <div>
                      <span className="text-2xl font-bold text-[#102851]">₹{discountedPrice.toFixed(2)}</span>
                      <span className="ml-2 text-sm text-[#ABB6C7] line-through">₹{medicine.price}</span>
                    </div>
                    <span className="rounded-full bg-[#F1FFF5] px-2 py-1 text-xs font-semibold text-[#199E54]">
                      {medicine.discount}% OFF
                    </span>
                  </div>

                  {medicine.stock ? (
                    <div className="mb-4 flex items-center gap-2 text-sm text-[#199E54]">
                      <Pill className="h-4 w-4" />
                      <span>In Stock</span>
                    </div>
                  ) : (
                    <div className="mb-4 flex items-center gap-2 text-sm text-[#EF4444]">
                      <AlertCircle className="h-4 w-4" />
                      <span>Out of Stock</span>
                    </div>
                  )}

                  <button
                    disabled={!medicine.stock}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2AA8FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(42,168,255,0.3)] transition hover:bg-[#1896f0] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <FaqSection />
      <AppDownloadSection />
      <FooterSection />
    </div>
  )
}

export default MedicinesPage

