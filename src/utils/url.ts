const BACKEND_URL = 'https://travelblog.skillbox.cc';

export function resolveImageUrl(raw?: string | null): string {
  if (!raw) return '';
  const s = String(raw).trim();
  if (!s || /^(null|undefined|false|0)$/i.test(s)) return '';
  if (s.startsWith('blob:') || s.startsWith('data:')) return s;
  if (/^https?:\/\//i.test(s)) return s;
  return `${BACKEND_URL}${s.startsWith('/') ? '' : '/'}${s}`;
}
