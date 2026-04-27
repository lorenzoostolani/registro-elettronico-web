export function LoadingSpinner({ label = 'Caricamento...' }: { label?: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-2 border-t-blueToken" />
      <p className="text-sm text-text2">{label}</p>
    </div>
  )
}
