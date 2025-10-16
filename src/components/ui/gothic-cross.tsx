interface GothicCrossProps {
  size?: number
  className?: string
}

export function GothicCross({ size = 24, className = "" }: GothicCrossProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L13.5 6H16L13.5 8L14.5 11.5H12V21H11V11.5H8.5L9.5 8L7 6H9.5L12 2Z" />
      <path d="M12 2C12 2 11 4 10 6H8L10 7.5L9 10.5H12V22H12V10.5H15L14 7.5L16 6H14C13 4 12 2 12 2Z" opacity="0.5" />
    </svg>
  )
}

export default GothicCross
