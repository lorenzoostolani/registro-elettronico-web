import { Badge } from "@/components/ui/badge";

export const GradeBadge = ({ value, display }: { value: number, display: string }) => {
  const color = value >= 6 ? "bg-blue-600" : value >= 5 ? "bg-orange-500" : "bg-red-600";
  return (
    <Badge className={`${color} text-white font-bold w-10 h-10 flex items-center justify-center rounded-full`}>
      {display}
    </Badge>
  );
};