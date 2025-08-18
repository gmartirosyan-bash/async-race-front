export default function (error: unknown, fallbackMessage: string = 'Something went wrong'): string {
  console.error('API Error', error);

  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'No response from server. Please check your internet connection.';
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
}
