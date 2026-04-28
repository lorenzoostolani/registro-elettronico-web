export async function handleAuthFailure() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } finally {
    window.location.href = '/login?reason=session_expired'
  }
}

export async function fetchGradesWithAuthGuard() {
  const response = await fetch('/api/grades', { cache: 'no-store' })
  const data = await response.json()

  if (response.status === 401 || response.status === 403 || data?.forceLogout) {
    await handleAuthFailure()
    return null
  }

  return data
}
