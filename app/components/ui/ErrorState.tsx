export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-xl border border-[var(--red-border)] bg-[var(--red-bg)] p-3 text-sm text-[var(--red)]">{message}</div>
}
