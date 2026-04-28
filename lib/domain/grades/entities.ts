export interface Grade {
  subjectId: number
  subjectDesc: string
  evtId: number
  evtCode: string
  evtDate: string
  decimalValue: number | null
  displayValue: string
  notesForFamily?: string
  cancelled: boolean
  underlined: boolean
  periodPos: number
  periodDesc: string
  componentPos: number
  componentDesc: string
  weightFactor: number
}

export type GradeType = 'Scritto' | 'Orale' | 'Pratico'
export type GeneralAverageMode = 'all_grades' | 'three_type_mean'

export type GradeNeededMessage =
  | { type: 'dont_worry' }
  | { type: 'calculation_error' }
  | { type: 'unreachable' }
  | { type: 'not_less_than'; value: string }
  | { type: 'get_at_least'; value: string }

export function isValidGrade(grade: Grade): boolean {
  return !grade.cancelled && grade.decimalValue !== null && grade.decimalValue !== -1 && grade.decimalValue > 0
}

export function getGradeType(componentDesc: string): GradeType | null {
  const lower = componentDesc.trim().toLowerCase()
  if (lower === 'scritto' || lower === 'scritto/grafico') return 'Scritto'
  if (lower === 'orale') return 'Orale'
  if (lower === 'pratico') return 'Pratico'
  return null
}

export function computeArithmeticAverage(grades: Grade[]): number | null {
  const valid = grades.filter(isValidGrade)
  if (valid.length === 0) return null
  return valid.reduce((acc, g) => acc + (g.decimalValue ?? 0), 0) / valid.length
}

export function computeWeightedAverage(grades: Grade[]): number | null {
  const valid = grades.filter(isValidGrade)
  if (valid.length === 0) return null
  const weightedSum = valid.reduce((acc, g) => acc + (g.decimalValue ?? 0) * g.weightFactor, 0)
  const totalWeight = valid.reduce((acc, g) => acc + g.weightFactor, 0)
  return totalWeight === 0 ? null : weightedSum / totalWeight
}

export function computeThreeTypeAverage(grades: Grade[]): number | null {
  const written = computeWeightedAverage(grades.filter((g) => getGradeType(g.componentDesc) === 'Scritto'))
  const oral = computeWeightedAverage(grades.filter((g) => getGradeType(g.componentDesc) === 'Orale'))
  const practical = computeWeightedAverage(grades.filter((g) => getGradeType(g.componentDesc) === 'Pratico'))

  const available = [written, oral, practical].filter((v): v is number => v !== null)
  if (available.length === 0) return null
  return available.reduce((acc, value) => acc + value, 0) / available.length
}

export function computeAverage(grades: Grade[], mode: GeneralAverageMode = 'all_grades'): number | null {
  return mode === 'three_type_mean' ? computeThreeTypeAverage(grades) : computeWeightedAverage(grades)
}

export function getAverageColor(average: number | null): 'green' | 'amber' | 'red' | 'gray' {
  if (average === null) return 'gray'
  if (average >= 6) return 'green'
  if (average >= 5) return 'amber'
  return 'red'
}

export function getAverageColorVsObjective(
  average: number | null,
  objective: number
): 'green' | 'amber' | 'red' | 'gray' {
  if (average === null) return 'gray'
  if (average >= objective) return 'green'
  if (average >= objective - 1) return 'amber'
  return 'red'
}

export function computeGradeNeeded(
  objective: number,
  average: number,
  numberOfGrades: number
): GradeNeededMessage {
  if (Number.isNaN(average)) return { type: 'dont_worry' }
  if (objective > 10 || average > 10) return { type: 'calculation_error' }
  if (objective >= 10 && average < objective) return { type: 'unreachable' }

  const array = [0.75, 0.5, 0.25, 0.0]
  let index = 0
  let sommaVotiDaPrendere: number
  const votiMinimi = [0.0, 0.0, 0.0, 0.0, 0.0]
  let resto = 0.0

  try {
    do {
      index += 1
      sommaVotiDaPrendere = objective * (numberOfGrades + index) - average * numberOfGrades
    } while (sommaVotiDaPrendere / index > 10)

    let i = 0
    while (i < index) {
      votiMinimi[i] = sommaVotiDaPrendere / index + resto
      resto = 0.0
      const parteIntera = Math.floor(votiMinimi[i])
      const parteDecimale = Math.round((votiMinimi[i] - parteIntera) * 100)

      if (parteDecimale !== 25 && parteDecimale !== 50 && parteDecimale !== 75) {
        let k = 0
        let diff: number
        do {
          diff = votiMinimi[i] - (parteIntera + array[k])
          k += 1
        } while (diff < 0)
        votiMinimi[i] -= diff
        resto = diff
      }

      if (votiMinimi[i] > 10) {
        const diff2 = votiMinimi[i] - 10
        votiMinimi[i] = 10.0
        resto += diff2
      }
      i += 1
    }

    if (votiMinimi[0] <= 0) return { type: 'dont_worry' }

    if (votiMinimi[0] <= objective) {
      return { type: 'not_less_than', value: votiMinimi[0].toFixed(2) }
    }

    const nonZero = votiMinimi.filter((v) => v !== 0.0)
    if (nonZero.length > 3) return { type: 'unreachable' }
    return { type: 'get_at_least', value: nonZero.map((v) => v.toFixed(2)).join(', ') }
  } catch {
    return { type: 'unreachable' }
  }
}

export function extractStudentId(ident: string): string {
  return ident.replace(/\D/g, '')
}
