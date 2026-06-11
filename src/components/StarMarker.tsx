interface StarMarkerProps {
  isPeak?: boolean
  className?: string
}

export function StarMarker({ isPeak = false, className = '' }: StarMarkerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${isPeak ? 'star-marker-peak h-6 w-6' : 'star-marker h-4 w-4'} ${className}`}
      aria-hidden="true"
    >
      <path
        fill={isPeak ? '#fde68a' : '#fbbf24'}
        d="M12 2l2.9 6.9L22 10.2l-5.5 4.8L18.2 22 12 18.1 5.8 22l1.7-7 5.5-4.8L9.1 8.9 12 2z"
      />
    </svg>
  )
}
