import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  href?: string
  showText?: boolean
  collapsed?: boolean
  size?: number
}

export function Logo({ href = '/', showText = true, collapsed = false, size = 32 }: LogoProps) {
  const content = (
    <div className="flex items-center gap-2 font-bold text-xl">
      <div
        className="rounded-lg bg-primary flex items-center justify-center text-primary-foreground overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image
          src="/travo-logo.png"
          alt="Travo"
          width={size}
          height={size}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showText && !collapsed && <span>Travo</span>}
    </div>
  )

  if (!href) {
    return content
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  )
}

