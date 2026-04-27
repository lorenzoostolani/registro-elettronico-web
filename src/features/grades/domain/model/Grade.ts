export interface Grade {
  subjectId: number;
  subjectDesc: string;
  eventDate: string;
  decimalValue: number;
  displayValue: string;
  notesForFamily: string | null;
  periodDesc: string;
  weightFactor: number;
  isCancelled: boolean;
}

export interface SubjectGrades {
  subjectId: number;
  subjectName: string;
  grades: Grade[];
  average: number;
}