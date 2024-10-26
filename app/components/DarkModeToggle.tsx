// app/components/DarkModeToggle.tsx

'use client'

import { useEffect, useState } from 'react'

const DarkModeToggle: React.FC = () => {
  // Declare state for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Set initial dark mode based on localStorage or system preference
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setIsDarkMode(false)
    }
  }, [])

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    }
    setIsDarkMode(!isDarkMode) // Update the state
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? '🌞' : '🌜'}
    </button>
  )
}

export default DarkModeToggle
