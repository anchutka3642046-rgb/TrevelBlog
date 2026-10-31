import { apiClient } from './client';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

export const authApi = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/register', credentials);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.get('/api/logout');
  },
};
