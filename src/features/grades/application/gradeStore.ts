import { create } from 'zustand';
import { Grade, SubjectGrades } from '../domain/model/Grade';

interface GradesState {
  subjects: SubjectGrades[];
  setGrades: (grades: Grade[]) => void;
}

export const useGradesStore = create<GradesState>((set) => ({
  subjects: [],
  setGrades: (grades) => {
    const subjectMap = new Map<number, SubjectGrades>();

    grades.forEach((g) => {
      if (!subjectMap.has(g.subjectId)) {
        subjectMap.set(g.subjectId, {
          subjectId: g.subjectId,
          subjectName: g.subjectDesc,
          grades: [],
          average: 0,
        });
      }
      subjectMap.get(g.subjectId)!.grades.push(g);
    });

    const subjects = Array.from(subjectMap.values()).map(s => {
      const valid = s.grades.filter(v => !v.isCancelled && v.decimalValue > 0);
      const avg = valid.length ? valid.reduce((acc, curr) => acc + curr.decimalValue, 0) / valid.length : 0;
      return { ...s, average: avg };
    });

    set({ subjects });
  },
}));