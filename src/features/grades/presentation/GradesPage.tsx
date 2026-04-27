'use client';
import { useGradesStore } from '../application/gradesStore';
import { GradeBadge } from './components/GradeBadge';
import { Card, CardContent } from "@/components/ui/card";

export default function GradesPage() {
  const { subjects } = useGradesStore();

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Voti Scrutinio</h1>
      {subjects.map((sub) => (
        <Card key={sub.subjectId} className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg uppercase text-gray-600">{sub.subjectName}</h2>
              <span className="text-2xl font-black">Media: {sub.average.toFixed(2)}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {sub.grades.map((g, i) => (
                <div key={i} className="text-center">
                  <GradeBadge value={g.decimalValue} display={g.displayValue} />
                  <p className="text-[10px] mt-1 text-gray-400">
                    {new Date(g.eventDate).toLocaleDateString('it-IT', {day:'2-digit', month:'2-digit'})}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}