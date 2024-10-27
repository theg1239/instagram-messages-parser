// app/components/DarkModeToggle.tsx

'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    const initialDarkMode = root.classList.contains('dark') || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDarkMode(initialDarkMode)
    if (initialDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.remove('dark')
      localStorage.theme = 'light'
    } else {
      root.classList.add('dark')
      localStorage.theme = 'dark'
    }
    setIsDarkMode(!isDarkMode)
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-500" />}
    </button>
  )
}

export default DarkModeToggle
