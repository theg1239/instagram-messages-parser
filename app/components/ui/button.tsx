// app/components/ui/button.tsx

'use client'

import React from 'react'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ type = 'button', onClick, disabled, className, children }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}
