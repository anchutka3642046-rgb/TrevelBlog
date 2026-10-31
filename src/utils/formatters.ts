export const BACKEND_URL = 'https://travelblog.skillbox.cc';

export const getImageUrl = (path?: string | null): string => {
  if (!path) return '/images/default-placeholder.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};
