import clsx from 'clsx'

export function Card({
  children,
  className,
  hover = false
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-borderToken bg-surface p-4 shadow-sm',
        hover && 'transition hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  )
}
