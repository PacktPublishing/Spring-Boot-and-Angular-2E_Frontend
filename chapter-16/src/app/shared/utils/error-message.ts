export function extractErrorMessage(err: unknown, fallback: string): string {
  if (typeof err !== 'object' || err === null || !('error' in err)) {
    return fallback;
  }

  const message = (err as { error?: { message?: unknown } }).error?.message;
  return typeof message === 'string' ? message : fallback;
}

export function normalizeApiErrorMessage(err: unknown, fallback: string): string {
  if (typeof err !== 'object' || err === null) {
    return fallback;
  }

  const candidate = err as { message?: unknown; error?: { message?: unknown } };
  const message =
    typeof candidate.error?.message === 'string'
      ? candidate.error.message
      : typeof candidate.message === 'string'
        ? candidate.message
        : null;

  if (!message || message.includes('Http failure response for')) {
    return fallback;
  }

  return message;
}
