import { reactive, computed } from 'vue';
import { authApi } from '../api/auth';
import { userApi } from '../api/user';
import type { UserInfo } from '../types';

interface AuthState {
  token: string | null;
  user: UserInfo | null;
  loading: boolean;
}

const state = reactive<AuthState>({
  token: localStorage.getItem('auth_token'),
  user: null,
  loading: false,
});

export const useAuthStore = () => {
  const isAuthenticated = computed(() => !!state.token);

  const setToken = (newToken: string | null) => {
    state.token = newToken;
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
    } else {
      localStorage.removeItem('auth_token');
      state.user = null;
    }
  };

  const setUser = (userData: UserInfo | null) => {
    state.user = userData;
  };

  const updateUser = (data: Partial<UserInfo>) => {
    if (state.user) {
      state.user = { ...state.user, ...data };
    }
  };

  const fetchCurrentUser = async () => {
    if (!state.token) return;
    try {
      state.loading = true;
      state.user = await userApi.getUser();
    } catch {
      setToken(null);
    } finally {
      state.loading = false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
    } finally {
      setToken(null);
    }
  };

  return {
    state,
    isAuthenticated,
    setToken,
    setUser,
    updateUser,
    fetchCurrentUser,
    logout,
  };
};
