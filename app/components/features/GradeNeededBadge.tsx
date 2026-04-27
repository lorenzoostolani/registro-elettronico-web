import { GradeNeededMessage } from '@/lib/domain/grades/entities'
import { Badge } from '@/app/components/ui/Badge'

export function GradeNeededBadge({ message }: { message: GradeNeededMessage }) {
  if (message.type === 'dont_worry') return <Badge variant="green">Sei in regola 🎉</Badge>
  if (message.type === 'calculation_error') return <Badge variant="gray">Errore nel calcolo</Badge>
  if (message.type === 'unreachable') return <Badge variant="red">Obiettivo irraggiungibile</Badge>
  if (message.type === 'not_less_than') return <Badge variant="amber">Non prendere meno di {message.value}</Badge>
  return <Badge variant="blue">Prendi almeno: {message.value}</Badge>
}
