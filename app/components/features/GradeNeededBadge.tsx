import { GradeNeededMessage } from '@/lib/domain/grades/entities'

function getStyle(type: GradeNeededMessage['type']): React.CSSProperties {
  const base: React.CSSProperties = { fontSize: '13px', margin: 0 }
  if (type === 'dont_worry') return { ...base, color: 'var(--green)' }
  if (type === 'unreachable') return { ...base, color: 'var(--red)' }
  if (type === 'not_less_than') return { ...base, color: 'var(--text-2)' }
  if (type === 'get_at_least') return { ...base, color: 'var(--text-2)' }
  return { ...base, color: 'var(--text-3)' }
}

export function GradeNeededBadge({ message }: { message: GradeNeededMessage }) {
  const style = getStyle(message.type)
  if (message.type === 'dont_worry') return <p style={style}>Puoi stare tranquillo!</p>
  if (message.type === 'calculation_error') return <p style={style}>—</p>
  if (message.type === 'unreachable') return <p style={style}>Devi prendere almeno {message.value}</p>
  if (message.type === 'not_less_than') return <p style={style}>Non prendere meno di {message.value}</p>
  return <p style={style}>Devi prendere almeno {message.value}</p>
}
