import Link from 'next/link'
import { Card } from '@/app/components/ui/Card'
import { Badge } from '@/app/components/ui/Badge'
import { GradeNeededBadge } from './GradeNeededBadge'
import { GradeNeededMessage } from '@/lib/domain/grades/entities'

export function SubjectRow({
  subjectId,
  subjectDesc,
  average,
  averageVariant,
  needed
}: {
  subjectId: number
  subjectDesc: string
  average: number | null
  averageVariant: 'green' | 'amber' | 'red' | 'gray'
  needed: GradeNeededMessage
}) {
  return (
    <Link href={`/voti/${subjectId}`}>
      <Card hover className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-semibold">{subjectDesc}</h3>
          <p className="text-sm text-text2">Media: {average === null ? '—' : average.toFixed(2)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={averageVariant}>{averageVariant.toUpperCase()}</Badge>
          <GradeNeededBadge message={needed} />
        </div>
      </Card>
    </Link>
  )
}
