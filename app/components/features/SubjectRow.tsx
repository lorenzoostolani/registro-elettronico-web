import Link from 'next/link'
import { AverageCircle } from './AverageCircle'
import { GradeNeededBadge } from './GradeNeededBadge'
import { GradeNeededMessage } from '@/lib/domain/grades/entities'

export function SubjectRow({
  subjectId,
  subjectDesc,
  average,
  period,
  needed,
}: {
  subjectId: number
  subjectDesc: string
  average: number | null
  period?: number | null
  averageVariant: 'green' | 'amber' | 'red' | 'gray'
  needed: GradeNeededMessage
}) {
  return (
    <Link href={period != null ? `/voti/${subjectId}?period=${period}` : `/voti/${subjectId}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
      >
        <AverageCircle label="" value={average} size={72} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: 'var(--text)' }}>
            {subjectDesc}
          </p>
          <div style={{ marginTop: '6px' }}>
            <GradeNeededBadge message={needed} />
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </Link>
  )
}
