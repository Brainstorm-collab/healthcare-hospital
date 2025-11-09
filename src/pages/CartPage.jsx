import TopNavigation from '@/components/layout/TopNavigation'
import { useCart } from '@/contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Trash2, CreditCard, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import FooterSection from '@/components/sections/FooterSection'
import { useToast } from '@/contexts/ToastContext'

const CartPage = () => {
  const { items, setQuantity, removeItem, subtotal, clear, isAuthenticated } = useCart()
  const navigate = useNavigate()
  const [showPayment, setShowPayment] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [orderReference, setOrderReference] = useState('')
  const toast = useToast()

  const startPayment = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (items.length === 0) return
    setPaymentSuccess(false)
    setOrderReference('')
    setShowPayment(true)
  }

  const confirmPayment = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 1200))
    setPaymentSuccess(true)
    const reference = `ORD-${Date.now().toString().slice(-6)}`
    setOrderReference(reference)
    clear()
    setIsProcessing(false)
    toast.success('Payment successful', `Your order ${reference} has been placed.`)
  }

  const handleCloseDialog = (open) => {
    setShowPayment(open)
    if (!open) {
      setIsProcessing(false)
      setPaymentSuccess(false)
      setOrderReference('')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNavigation />
      <main className="mx-auto mt-36 max-w-[1170px] px-6 pb-24 pt-8">
        <h1 className="mb-6 text-3xl font-bold text-[#102851]">Your Cart</h1>

        {items.length === 0 ? (
          <div className="rounded-lg border border-[#E4EBF5] bg-white p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#2AA8FF]/10 text-[#2AA8FF]">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <p className="text-[#5C6169]">Your cart is empty.</p>
            <Button className="mt-4 bg-[#2AA8FF] text-white hover:bg-[#1896f0]" onClick={() => navigate('/medicines')}>
              Browse Medicines
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-lg border border-[#E4EBF5] bg-white p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=160&h=160&fit=crop&auto=format&q=80'
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#102851]">{item.name}</p>
                    <p className="text-xs text-[#5C6169]">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded border border-[#DCE6F5] p-1 hover:bg-[#F5F8FF]"
                      onClick={() => setQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="h-4 w-4 text-[#102851]" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      className="rounded border border-[#DCE6F5] p-1 hover:bg-[#F5F8FF]"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4 text-[#102851]" />
                    </button>
                  </div>
                  <button
                    className="rounded border border-red-200 p-2 text-red-600 hover:bg-red-50"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-lg border border-[#E4EBF5] bg-white p-5">
              <p className="mb-3 text-sm text-[#5C6169]">Subtotal</p>
              <p className="mb-6 text-2xl font-bold text-[#102851]">₹{subtotal.toFixed(2)}</p>
              <Button className="w-full bg-[#2AA8FF] text-white hover:bg-[#1896f0]" onClick={startPayment}>
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Pay
              </Button>
              <p className="mt-3 text-xs text-[#5C6169]">This is a demo checkout. No real payment is processed.</p>
            </div>
          </div>
        )}
      </main>

      <FooterSection />

      <Dialog open={showPayment} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#102851]">{paymentSuccess ? 'Payment Successful' : 'Confirm Payment'}</DialogTitle>
            <DialogDescription className="text-[#5C6169]">
              {paymentSuccess
                ? `Your order ${orderReference} has been placed on ${new Date().toLocaleString()}.`
                : 'This is a demo payment. Confirm to place your order.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            {paymentSuccess ? (
              <Button onClick={() => setShowPayment(false)} className="bg-[#2AA8FF] text-white hover:bg-[#1896f0]">
                Close
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowPayment(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={confirmPayment}
                  disabled={isProcessing}
                  className="bg-[#2AA8FF] text-white hover:bg-[#1896f0]"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CartPage


