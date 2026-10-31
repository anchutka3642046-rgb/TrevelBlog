export const isValidEmail = (value: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value);
};

export const extractApiError = (error: any, fallback: string): string => {
  const data = error?.response?.data;
  if (!data) return fallback;

  if (data.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first.length) return String(first[0]);
    if (typeof first === 'string') return first;
  }

  return data.message || data.error || fallback;
};
