import { apiClient } from './client';
import type { UserInfo } from '../types';

function unwrapUser<T = UserInfo>(payload: any): T {
  if (payload && typeof payload === 'object') {
    if (payload.user && typeof payload.user === 'object') return payload.user as T;
    if (payload.data && typeof payload.data === 'object') return payload.data as T;
  }
  return payload as T;
}

export function extractPhotoUrl(user: any): string {
  if (!user || typeof user !== 'object') return '';
  const raw =
    user.photo ||
    user.avatar_url ||
    user.avatarUrl ||
    user.avatar ||
    user.image ||
    user.photo_url ||
    '';
  if (typeof raw !== 'string') return '';
  const s = raw.trim();
  if (!s || /^(null|undefined|avatar|false|0)$/i.test(s)) return '';
  return s;
}

export const userApi = {
  async getUser(): Promise<UserInfo> {
    const res = await apiClient.get('/api/user');
    return unwrapUser<UserInfo>(res.data);
  },

  async updateUser(formData: FormData): Promise<UserInfo> {
    const res = await apiClient.post('/api/user', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const user = unwrapUser<UserInfo>(res.data);

    if (!extractPhotoUrl(user) && formData.has('photo')) {
    }

    return user;
  },

  async updatePassword(password: string): Promise<{ message: string }> {
    const res = await apiClient.patch<{ message: string }>('/api/user/password', { password });
    return res.data;
  },
};

