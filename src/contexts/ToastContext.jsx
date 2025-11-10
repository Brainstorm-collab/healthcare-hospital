// ToastContext
// ------------
// Thin wrapper around 'sonner' to keep usage consistent across the app.
import { createContext, useContext } from 'react'
import { toast } from 'sonner'

const ToastContext = createContext()

const TOAST_DURATION = {
  short: 3500,
  long: 4000,
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    // Fallback to direct sonner if context not available
    return {
      success: (message, description) =>
        toast.success(message, { description, duration: TOAST_DURATION.short }),
      error: (message, description) =>
        toast.error(message, { description, duration: TOAST_DURATION.long }),
      info: (message, description) =>
        toast.info(message, { description, duration: TOAST_DURATION.short }),
      warning: (message, description) =>
        toast.warning(message, { description, duration: TOAST_DURATION.short }),
    }
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const showToast = {
    success: (message, description) => {
      toast.success(message, {
        description,
        duration: TOAST_DURATION.short,
        className: 'toast-success',
      })
    },
    error: (message, description) => {
      toast.error(message, {
        description,
        duration: TOAST_DURATION.long,
        className: 'toast-error',
      })
    },
    info: (message, description) => {
      toast.info(message, {
        description,
        duration: TOAST_DURATION.short,
        className: 'toast-info',
      })
    },
    warning: (message, description) => {
      toast.warning(message, {
        description,
        duration: TOAST_DURATION.short,
        className: 'toast-warning',
      })
    },
  }

  return (
    <ToastContext.Provider value={showToast}>
      {children}
    </ToastContext.Provider>
  )
}

