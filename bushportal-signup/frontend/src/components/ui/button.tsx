import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseClass = 'font-medium rounded-lg transition-colors disabled:opacity-50'

  const variantClass = {
    primary: 'bg-amber-600 text-white hover:bg-amber-700 disabled:cursor-not-allowed',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white',
    outline: 'border-2 border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950',
  }[variant]

  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size]

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
