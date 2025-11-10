import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { CartProvider } from '@/contexts/CartContext'
import './index.css'
import App from './App.jsx'

// Suppress harmless Google OAuth COOP warnings
if (import.meta.env.DEV) {
  const originalWarn = console.warn
  console.warn = (...args) => {
    const message = args[0]?.toString() || ''
    // Filter out Google OAuth COOP warnings
    if (message.includes('Cross-Origin-Opener-Policy') && message.includes('window.postMessage')) {
      return // Suppress this specific warning
    }
    originalWarn.apply(console, args)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <App />
              <Toaster position="top-right" richColors expand={true} />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
