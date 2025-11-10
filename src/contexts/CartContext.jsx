// CartContext
// -----------
// Lightweight cart state persisted to localStorage.
// Exposes helpers for add/remove/update along with computed totals.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const CartContext = createContext()

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])

  // Load from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthcare_cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  // Persist
  useEffect(() => {
    localStorage.setItem('healthcare_cart', JSON.stringify(items))
  }, [items])

  // Reset cart when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setItems([])
    }
  }, [isAuthenticated])

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id)
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p))
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const removeItem = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  const setQuantity = (id, quantity) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p)))
  }

  const clear = () => setItems([])

  const totalItems = useMemo(() => items.reduce((sum, p) => sum + p.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, p) => sum + p.quantity * p.price, 0), [items])

  const value = {
    items,
    addItem,
    removeItem,
    setQuantity,
    clear,
    totalItems,
    subtotal,
    isAuthenticated, // convenience for gating
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}


