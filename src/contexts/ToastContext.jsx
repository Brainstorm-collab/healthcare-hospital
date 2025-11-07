import { createContext, useContext } from 'react'
import { toast } from 'sonner'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    // Fallback to direct sonner if context not available
    return {
      success: (message, description) => toast.success(message, { description }),
      error: (message, description) => toast.error(message, { description }),
      info: (message, description) => toast.info(message, { description }),
      warning: (message, description) => toast.warning(message, { description }),
    }
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const showToast = {
    success: (message, description) => {
      toast.success(message, {
        description,
        duration: 3000,
        className: 'toast-success',
      })
    },
    error: (message, description) => {
      toast.error(message, {
        description,
        duration: 4000,
        className: 'toast-error',
      })
    },
    info: (message, description) => {
      toast.info(message, {
        description,
        duration: 3000,
        className: 'toast-info',
      })
    },
    warning: (message, description) => {
      toast.warning(message, {
        description,
        duration: 3000,
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

