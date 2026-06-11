import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.25)]',
  secondary:
    'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-100 border border-slate-600/60',
  ghost:
    'bg-transparent hover:bg-cyan-950/40 text-cyan-300 border border-cyan-800/40',
  danger:
    'bg-red-950/50 hover:bg-red-900/50 text-red-200 border border-red-700/40',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
