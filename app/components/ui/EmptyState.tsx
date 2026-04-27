export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-borderToken bg-surface p-8 text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-text2">{description}</p>
    </div>
  )
}
