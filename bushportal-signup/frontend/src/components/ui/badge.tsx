import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseClass = 'inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold'
  const variantClass = {
    default: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    outline: 'border border-amber-300 text-amber-800 dark:border-amber-700 dark:text-amber-200 bg-amber-50 dark:bg-transparent',
  }[variant]

  return (
    <div className={`${baseClass} ${variantClass} ${className}`}>
      {children}
    </div>
  )
}
