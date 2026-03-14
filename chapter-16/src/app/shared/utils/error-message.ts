export function extractErrorMessage(err: unknown, fallback: string): string {
  if (typeof err !== 'object' || err === null || !('error' in err)) {
    return fallback;
  }

  const message = (err as { error?: { message?: unknown } }).error?.message;
  return typeof message === 'string' ? message : fallback;
}
