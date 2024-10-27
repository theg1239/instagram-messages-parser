// app/components/ui/input.tsx

'use client'

import React from 'react'

interface InputProps {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  className?: string
}

export const Input: React.FC<InputProps> = ({ type = 'text', placeholder, value, onChange, onKeyDown, className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={`p-2 border rounded-md focus:ring focus:ring-blue-500 ${className}`}
    />
  )
}
