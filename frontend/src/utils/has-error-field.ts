export function hasErrorField(error: unknown): error is { data: { error: string } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'error' in error.data
  );
}
