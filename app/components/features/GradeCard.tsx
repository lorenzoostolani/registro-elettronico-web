import { GradeChip } from './GradeChip'
import { Card } from '@/app/components/ui/Card'
import { Grade } from '@/lib/domain/grades/entities'
import { formatDate } from '@/lib/utils/dates'
import clsx from 'clsx'

export function GradeCard({ grade }: { grade: Grade }) {
  return (
    <Card className={clsx(grade.cancelled && 'opacity-60', grade.underlined && 'border-[var(--red)]')}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text2">{formatDate(grade.evtDate)}</p>
          <p className={clsx('text-sm', grade.cancelled && 'line-through')}>{grade.componentDesc || 'Generico'}</p>
        </div>
        <GradeChip grade={grade} />
      </div>
      {grade.notesForFamily ? <p className="mt-2 text-sm text-text2">{grade.notesForFamily}</p> : null}
    </Card>
  )
}
