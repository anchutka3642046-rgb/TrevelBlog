<template>
  <div class="auth-page">

    <AppHeader title="ИСТОРИИ ВАШИХ ПУТЕШЕСТВИЙ" />

    <form class="auth-card" @submit.prevent="handleSubmit" novalidate>
      <h1 class="auth-card__title">Вход в профиль</h1>

      <p v-if="errors.server" class="auth-card__server-error">
        {{ errors.server }}
      </p>

      <div class="form-group">
        <label class="form-label">
          <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
          Логин
        </label>
        <input v-model.trim="form.email" type="email" class="form-input"
          :class="{ 'is-invalid': errors.email || serverFailed }" placeholder="Email" autocomplete="email" />
        <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label class="form-label">
          <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
          Пароль
        </label>
        <input v-model="form.password" type="password" class="form-input"
          :class="{ 'is-invalid': errors.password || serverFailed }" placeholder="Пароль"
          autocomplete="current-password" />
        <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
      </div>

      <div class="auth-card__actions">
        <router-link to="/register" class="btn btn--outline auth-card__btn auth-card__btn--outline">
          Зарегистрироваться
        </router-link>

        <button type="submit" class="btn btn--primary auth-card__btn auth-card__btn--primary" :disabled="submitting">
          {{ submitting ? 'Вход...' : 'Войти' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '../api/auth';
import { useAuthStore } from '../stores/auth';
import { isValidEmail } from '../utils/validators';
import AppHeader from '../components/AppHeader.vue';

const router = useRouter();
const authStore = useAuthStore();

const submitting = ref(false);
const serverFailed = ref(false);

const form = reactive({ email: '', password: '' });
const errors = reactive({ email: '', password: '', server: '' });

const validate = () => {
  errors.email = '';
  errors.password = '';
  errors.server = '';
  serverFailed.value = false;

  let ok = true;

  if (!form.email) {
    errors.email = 'Введите e-mail';
    ok = false;
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Некорректный e-mail';
    ok = false;
  }

  if (!form.password) {
    errors.password = 'Введите пароль';
    ok = false;
  } else if (form.password.length < 5) {
    errors.password = 'Минимум 5 символов';
    ok = false;
  }

  return ok;
};

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    submitting.value = true;
    const { token } = await authApi.login({ email: form.email, password: form.password });
    authStore.setToken(token);
    await authStore.fetchCurrentUser();
    router.push({ name: 'home' });
  } catch (error: any) {
    errors.server = extractApiError(error, 'Неверный e-mail или пароль');
    serverFailed.value = true;
  } finally {
    submitting.value = false;
  }
};

const extractApiError = (error: any, fallback: string) => {
  const data = error?.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    return Array.isArray(first) ? (first[0] as string) : fallback;
  }
  return data?.message || data?.error || fallback;
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #E5E5EA;
  align-items: center;
}

.auth-card {
  background: #ffffff;
  border-radius: 10px;
  width: 100%;
  max-width: 1172px;
  max-height: 739px;
  padding: 28px 238px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 30px;
}

.auth-card__title {
  text-align: center;
  font-size: 36px;
  line-height: 100%;
  font-weight: 600;
  margin-bottom: 20px;
  color: #141414;
  font-family: "Poppins", sans-serif;
}

.auth-card__server-error {
  color: #E74C3C;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  line-height: 100%;
  text-align: center;
  margin: -10px 0 20px 0;
}

.auth-card__actions {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 10px;
  width: 100%;
}

.auth-card__btn {
  border-radius: 10px;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  line-height: 13px;
  font-weight: 600;
  height: 51px;
  padding: 26px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.auth-card__btn--outline {
  background: #fff;
  color: #FFA902;
  border: 2px solid #FFA902;
  width: auto;
}

.auth-card__btn--outline:hover {
  background: #f5f5f5;
}

.auth-card__btn--primary {
  background: #F39C12;
  color: #fff;
  border: 1px solid #F39C12;
}

.auth-card__btn--primary:hover:not(:disabled) {
  background: #e08e0b;
  border-color: #e08e0b;
}

.auth-card__btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-label {
  margin-bottom: 8px;
}

.hero-header {
  width: 100%;
}

@media (max-width: 900px) {
  .auth-card {
    padding: 28px 40px;
  }
}
</style>
