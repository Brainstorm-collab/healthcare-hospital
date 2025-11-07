import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme] = useState({
    colors: {
      primary: '#2AA8FF',
      primaryDark: '#2AA7FF',
      secondary: '#102851',
      background: '#FFFFFF',
      backgroundLight: '#F7FAFF',
      backgroundGradient: 'linear-gradient(81deg, #E7F0FF 9.01%, rgba(232, 241, 255, 0.47) 89.11%)',
      text: '#102851',
      textLight: '#5C6169',
      textMuted: '#ABB6C7',
      border: '#E6ECF5',
      borderLight: '#F0F0F0',
      success: '#10B981',
      error: '#EF4444',
    },
    fonts: {
      primary: 'Poppins, sans-serif',
      sizes: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      '2xl': '4rem',
    },
    shadows: {
      soft: '0 2px 8px rgba(16, 40, 81, 0.08)',
      card: '0 4px 16px rgba(16, 40, 81, 0.12)',
      large: '0 6px 35px rgba(16, 40, 81, 0.11)',
    },
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '15px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      full: '9999px',
    },
  })

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

