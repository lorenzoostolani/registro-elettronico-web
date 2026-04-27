import { Grade } from '@/lib/domain/grades/entities'
import clsx from 'clsx'

export function GradeChip({ grade }: { grade: Grade }) {
  const value = grade.decimalValue
  const colorClass =
    value === null || value <= 0
      ? 'bg-surface-2 text-text2'
      : value >= 6
        ? 'bg-[var(--green-bg)] text-[var(--green)]'
        : value >= 5
          ? 'bg-[var(--amber-bg)] text-[var(--amber)]'
          : 'bg-[var(--red-bg)] text-[var(--red)]'

  return <span className={clsx('rounded-lg px-3 py-1 text-lg font-bold', colorClass)}>{grade.displayValue}</span>
}
