import { Grade } from '@/lib/domain/grades/entities'
import { formatDate } from '@/lib/utils/dates'

function getCardColor(grade: Grade): string {
  if (grade.cancelled) return 'var(--surface-3)'
  if (grade.decimalValue === null || grade.decimalValue === -1) return '#1565c0'
  if (grade.decimalValue >= 6) return '#2e7d32'
  return '#c62828'
}

function getDisplayValue(grade: Grade): string {
  return grade.displayValue || (grade.decimalValue !== null && grade.decimalValue !== -1 ? String(grade.decimalValue) : '—')
}

export function GradeCard({
  grade,
  weightPercent,
  onWeightPercentChange,
  rightAction,
}: {
  grade: Grade
  weightPercent?: number
  onWeightPercentChange?: (weightPercent: number) => void
  rightAction?: React.ReactNode
}) {
  const bgColor = getCardColor(grade)

  return (
    <div style={{
      background: bgColor,
      borderRadius: 'var(--radius)',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      opacity: grade.cancelled ? 0.5 : 1,
    }}>
      <div style={{
        width: '52px', height: '52px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '16px',
          fontWeight: 700,
          color: bgColor,
          textDecoration: grade.cancelled ? 'line-through' : 'none',
        }}>
          {getDisplayValue(grade)}
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#fff' }}>
          {grade.subjectDesc}{grade.componentDesc ? ` - ${grade.componentDesc}` : ''}
        </p>
        {grade.notesForFamily && (
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {grade.notesForFamily}
          </p>
        )}
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
          {formatDate(grade.evtDate)}
        </p>
      </div>

      {(onWeightPercentChange || rightAction) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
          {onWeightPercentChange && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '12px' }}>
              Peso
              <input
                aria-label="Peso voto in percentuale"
                type="number"
                min={1}
                max={300}
                step={5}
                value={Math.round(weightPercent ?? 100)}
                onChange={(event) => {
                  const next = Number(event.target.value)
                  if (!Number.isNaN(next) && next >= 1 && next <= 300) onWeightPercentChange(next)
                }}
                style={{
                  width: '64px',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.18)',
                  color: '#fff',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              />
              %
            </label>
          )}
          {rightAction}
        </div>
      )}
    </div>
  )
}
