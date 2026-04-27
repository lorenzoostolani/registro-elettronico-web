export function PageHeader({
  title,
  subtitle,
  action
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle ? <p className="text-sm text-text2">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
