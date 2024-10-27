// app/components/ui/avatar.tsx

'use client'

import React from 'react'

interface AvatarProps {
  className?: string
  children: React.ReactNode
}

export const Avatar: React.FC<AvatarProps> = ({ className, children }) => {
  return (
    <div className={`flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-full ${className}`}>
      {children}
    </div>
  )
}

interface AvatarFallbackProps {
  children: React.ReactNode
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children }) => {
  return (
    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
      {children}
    </span>
  )
}
