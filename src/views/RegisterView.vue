<template>
  <div class="auth-page">
  
    <AppHeader title="ИСТОРИИ ВАШИХ ПУТЕШЕСТВИЙ" />
  
    <form class="auth-card" @submit.prevent="handleSubmit" novalidate>
      <h1 class="auth-card__title">Регистрация</h1>
  
      <div class="form-group form-group--full">
        <label class="form-label">
          <span class="req">*</span> E-mail
        </label>
        <input v-model.trim="form.email" type="email" class="form-input" :class="{ 'is-invalid': errors.email }"
          placeholder="Email" autocomplete="email" />
        <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
      </div>
  
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">
            <span class="req">*</span> Пароль
          </label>
          <input v-model="form.password" type="password" class="form-input" :class="{ 'is-invalid': errors.password }"
            placeholder="Пароль" autocomplete="new-password" />
          <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
        </div>
  
        <div class="form-group">
          <label class="form-label">
            <span class="req">*</span> Повторите пароль
          </label>
          <input v-model="form.passwordConfirm" type="password" class="form-input"
            :class="{ 'is-invalid': errors.passwordConfirm }" placeholder="Повторите пароль"
            autocomplete="new-password" />
          <span v-if="errors.passwordConfirm" class="form-error">{{ errors.passwordConfirm }}</span>
        </div>
      </div>
  
      <div class="auth-card__actions">
        <button type="submit" class="auth-card__btn auth-card__btn--primary" :disabled="submitting">
          {{ submitting ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '../api/auth';
import { useAuthStore } from '../stores/auth';
import { isValidEmail, extractApiError } from '../utils/validators';
import AppHeader from '../components/AppHeader.vue';

const router = useRouter();
const authStore = useAuthStore();

const submitting = ref(false);

const form = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
});

const errors = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
});

watch(() => form.email, () => { errors.email = ''; });
watch(() => form.password, () => { errors.password = ''; });
watch(() => form.passwordConfirm, () => { errors.passwordConfirm = ''; });

const validate = () => {
  errors.email = '';
  errors.password = '';
  errors.passwordConfirm = '';

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
    errors.password = 'Пароль должен быть не менее 5 символов';
    ok = false;
  }

  if (!form.passwordConfirm) {
    errors.passwordConfirm = 'Повторите пароль';
    ok = false;
  } else if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = 'Пароли не совпадают';
    ok = false;
  }

  return ok;
};

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    submitting.value = true;
    const { token } = await authApi.register({
      email: form.email,
      password: form.password,
      password_confirm: form.passwordConfirm,
      password_confirmation: form.passwordConfirm,
    } as any);

    authStore.setToken(token);
    await authStore.fetchCurrentUser();
    router.push({ name: 'profile' });
  } catch (error: any) {
    errors.email = extractApiError(error, 'Ошибка регистрации');
  } finally {
    submitting.value = false;
  }
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

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
}

.form-group--full {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: flex-start;
}

.form-row .form-group {
  flex: 1;
  min-width: 0;
}

.form-label {
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: #000000D9;
  margin-bottom: 6px;
  font-family: "Poppins", sans-serif;
}

.req {
  color: #FF4D4F;
  margin-right: 2px;
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #D9D9D9;
  border-radius: 6px;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
  color: #141414;
  background: #fff;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #BFBFBF;
}

.form-input:focus {
  border-color: #F39C12;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.15);
}

.form-input.is-invalid {
  border-color: #FF4D4F;
}

.form-input.is-invalid:focus {
  border-color: #FF4D4F;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.15);
}

.form-error {
  margin-top: 4px;
  font-size: 14px;
  line-height: 22px;
  color: #FF4D4F;
  font-family: "Poppins", sans-serif;
}

.auth-card__actions {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-top: 8px;
}

.auth-card__btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 6px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.auth-card__btn--primary {
  background: #FFA902;
  color: #fff;
  border-color: #FFA902;
}

.auth-card__btn--primary:hover:not(:disabled) {
  background: #FFA902;
  border-color: #FFA902;
}

.auth-card__btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hero-header {
  width: 100%;
}

@media (max-width: 600px) {
  .auth-card {
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
