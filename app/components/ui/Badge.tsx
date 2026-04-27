import clsx from 'clsx'

type Variant = 'green' | 'red' | 'amber' | 'blue' | 'gray'

const classes: Record<Variant, string> = {
  green: 'border-[var(--green-border)] bg-[var(--green-bg)] text-[var(--green)]',
  red: 'border-[var(--red-border)] bg-[var(--red-bg)] text-[var(--red)]',
  amber: 'border-[var(--amber-border)] bg-[var(--amber-bg)] text-[var(--amber)]',
  blue: 'border-[var(--blue-border)] bg-[var(--blue-bg)] text-[var(--blue)]',
  gray: 'border-borderToken bg-surface-2 text-text2'
}

export function Badge({ children, variant = 'gray' }: { children: React.ReactNode; variant?: Variant }) {
  return <span className={clsx('rounded-full border px-2 py-1 text-xs font-semibold', classes[variant])}>{children}</span>
}
