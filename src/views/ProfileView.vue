<template>
  <div class="profile-view">
    <AppHeader title="ИСТОРИИ ВАШИХ ПУТЕШЕСТВИЙ" />
  
    <main class="container main-content">
      <div v-if="loading" class="loading">Загрузка профиля...</div>
      <div v-else class="profile-card">
  
        <template v-if="!isEditing">
          <aside class="profile-photo">
            <img v-if="displayPhoto && !avatarError" :src="displayPhoto" @error="onAvatarError" alt="Фото профиля"
              class="profile-photo__img" />
            <div v-else class="profile-photo__img profile-photo__img--stub">
              {{ initials }}
            </div>
  
            <button type="button" class="profile-photo__btn" @click="startEditing">
              <svg width="24" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Изменить фото
            </button>
          </aside>
  
          <div class="profile-info">
            <div class="profile-info__head">
              <h2 class="profile-info__name">{{ form.full_name || 'Имя не указано' }}</h2>
              <button type="button" class="profile-info__edit" aria-label="Редактировать профиль" @click="startEditing">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
            </div>
  
            <div class="profile-info__row">
              <span class="profile-info__label">Город</span>
              <p class="profile-info__value">{{ form.city || '—' }}</p>
            </div>
  
            <div class="profile-info__row">
              <span class="profile-info__label">О себе</span>
              <p class="profile-info__value profile-info__value--bio">
                {{ form.bio || 'Пока ничего не рассказано' }}
              </p>
            </div>
          </div>
        </template>
  
        <template v-else>
          <aside class="profile-photo">
            <img v-if="displayPhoto && !avatarError" :src="displayPhoto" @error="onAvatarError" alt="Фото профиля"
              class="profile-photo__img" />
            <div v-else class="profile-photo__img profile-photo__img--stub">
              {{ initials }}
            </div>
  
            <input ref="photoInputRef" type="file" accept="image/png, image/jpeg" class="profile-photo__input"
              @change="handlePhotoChange" />
  
            <button type="button" class="profile-photo__btn" @click="photoInputRef?.click()">
              <svg width="24" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Изменить фото
            </button>
          </aside>
  
          <form class="profile-form" @submit.prevent="handleSaveAll" novalidate>
  
            <div class="form-group">
              <label class="form-label">
                <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
                Ф. И. О.
              </label>
              <input v-model.trim="form.full_name" type="text" class="form-input"
                :class="{ 'is-invalid': errors.full_name }" placeholder="Фамилия Имя Отчество" />
              <span v-if="errors.full_name" class="form-error">{{ errors.full_name }}</span>
            </div>
  
            <div class="form-group">
              <label class="form-label">
                <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
                Город
              </label>
              <input v-model.trim="form.city" type="text" class="form-input" placeholder="Город" />
            </div>
  
            <div class="form-group">
              <label class="form-label">О себе</label>
              <div class="form-textarea-wrap">
                <textarea v-model="form.bio" class="form-textarea" :class="{ 'is-invalid': errors.bio }" rows="4"
                  maxlength="600" placeholder="Расскажите о себе..."></textarea>
              </div>
              <span class="form-counter" :class="{ 'form-counter--limit': form.bio.length >= 600 }">
                {{ form.bio.length }} / 600
              </span>
              <span v-if="errors.bio" class="form-error">{{ errors.bio }}</span>
            </div>
  
            <h3 class="profile-form__subtitle">Смена пароля</h3>
  
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
                  Новый пароль
                </label>
                <input v-model="password" type="password" class="form-input" :class="{ 'is-invalid': errors.password }"
                  placeholder="Оставьте пустым, если не меняете" autocomplete="new-password" />
                <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
              </div>
  
              <div class="form-group">
                <label class="form-label">
                  <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
                  Повторите пароль
                </label>
                <input v-model="passwordConfirm" type="password" class="form-input"
                  :class="{ 'is-invalid': errors.passwordConfirm }" placeholder="Повторите новый пароль"
                  autocomplete="new-password" />
                <span v-if="errors.passwordConfirm" class="form-error">{{ errors.passwordConfirm }}</span>
              </div>
            </div>
  
            <div class="form-actions">
              <button type="button" class="btn btn--outline" @click="cancelEditing">
                Назад
              </button>
              <button type="submit" class="btn btn--primary" :disabled="submitting">
                {{ submitting ? 'Сохранение...' : 'Сохранить' }}
              </button>
            </div>
          </form>
        </template>
      </div>
  
    </main>
  
    <ModalSuccess :isOpen="isSuccessModalOpen" message="Данные успешно сохранены" @close="isSuccessModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import ModalSuccess from '../components/ModalSuccess.vue';
import { userApi, extractPhotoUrl } from '../api/user.js';
import { useAuthStore } from '../stores/auth.js';
import { extractApiError } from '../utils/validators.js';

const BACKEND_URL = 'https://travelblog.skillbox.cc';

const authStore = useAuthStore();

const loading = ref(true);
const submitting = ref(false);
const isSuccessModalOpen = ref(false);
const isEditing = ref(false);

const photoInputRef = ref<HTMLInputElement | null>(null);
const photoFile = ref<File | null>(null);
const previewPhoto = ref('');
const avatarError = ref(false);

const password = ref('');
const passwordConfirm = ref('');

const form = reactive({
  full_name: '',
  city: '',
  country: '',
  bio: '',
});

const errors = reactive({
  full_name: '',
  password: '',
  passwordConfirm: '',
  bio: '',
});

const snapshot = reactive({ full_name: '', city: '', country: '', bio: '' });

const startEditing = () => {
  Object.assign(snapshot, form);
  isEditing.value = true;
};

const cancelEditing = () => {
  Object.assign(form, snapshot);
  isEditing.value = false;
  errors.full_name = '';
  errors.bio = '';
  errors.password = '';
  errors.passwordConfirm = '';
  password.value = '';
  passwordConfirm.value = '';

  if (photoFile.value) {
    photoFile.value = null;
    if (photoInputRef.value) photoInputRef.value.value = '';
    previewPhoto.value = serverPhotoUrl.value;
  }
};

const serverPhotoUrl = ref('');

const displayPhoto = computed(() => previewPhoto.value || '');

const initials = computed(() => {
  const name = (form.full_name || '').trim();
  const parts = name.split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'U';
});

const normalizePhotoUrl = (raw: string): string => {
  if (!raw) return '';
  if (raw.startsWith('blob:') || raw.startsWith('data:')) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${BACKEND_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
};

const loadUser = async () => {
  try {
    loading.value = true;
    const user: any = await userApi.getUser();
    form.full_name = user.full_name || '';
    form.city = user.city || '';
    form.country = user.country || '';
    form.bio = user.bio || '';

    const photo = extractPhotoUrl(user);
    previewPhoto.value = normalizePhotoUrl(photo);
    serverPhotoUrl.value = previewPhoto.value;
    avatarError.value = false;

    authStore.setUser(user);
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
  } finally {
    loading.value = false;
  }
};

const onAvatarError = () => {
  avatarError.value = true;
  previewPhoto.value = '';
};

const handlePhotoChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
    alert('Допустимы только PNG, JPG или WEBP');
    input.value = '';
    return;
  }

  try {
    const compressed = await compressImage(file, 800, 0.8);

    if (compressed.size > 1.5 * 1024 * 1024) {
      alert('Файл слишком большой даже после сжатия');
      input.value = '';
      return;
    }

    photoFile.value = compressed;

    if (previewPhoto.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewPhoto.value);
    }
    previewPhoto.value = URL.createObjectURL(compressed);
    avatarError.value = false;
  } catch (err) {
    console.error(err);
    alert('Не удалось обработать изображение');
    input.value = '';
  }
};


const validate = () => {
  errors.full_name = '';
  errors.password = '';
  errors.passwordConfirm = '';
  errors.bio = '';

  let ok = true;

  if (!form.full_name) {
    errors.full_name = 'Поле «Ф. И. О.» обязательно';
    ok = false;
  }

  if (password.value || passwordConfirm.value) {
    if (password.value.length < 5) {
      errors.password = 'Пароль должен быть не менее 5 символов';
      ok = false;
    }
    if (password.value !== passwordConfirm.value) {
      errors.passwordConfirm = 'Пароли не совпадают';
      ok = false;
    }
  }

  return ok;
};

const saveUserInfo = async () => {
  const data = new FormData();
  data.append('full_name', form.full_name);
  data.append('city', form.city);
  data.append('country', form.country);
  data.append('bio', form.bio);
  if (photoFile.value) data.append('photo', photoFile.value);
  return userApi.updateUser(data);
};

const savePassword = async () => {
  if (!password.value) return;
  await userApi.updatePassword(password.value);
};

const handleSaveAll = async () => {
  if (!validate()) return;

  try {
    submitting.value = true;

    const updatedUser: any = await saveUserInfo();

    authStore.setUser(updatedUser);

    const serverPhoto = normalizePhotoUrl(extractPhotoUrl(updatedUser));
    if (serverPhoto) {
      previewPhoto.value = serverPhoto;
      avatarError.value = false;
    }

    photoFile.value = null;
    if (photoInputRef.value) photoInputRef.value.value = '';
    if (password.value) {
      await savePassword();
      password.value = '';
      passwordConfirm.value = '';
    }

    isSuccessModalOpen.value = true;
    isEditing.value = false;
    serverPhotoUrl.value = previewPhoto.value;
  } catch (error: any) {
    errors.full_name = extractApiError(error, 'Не удалось сохранить данные');
  } finally {
    submitting.value = false;
  }
};

const compressImage = (file: File, maxSize = 800, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas недоступен'));

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Не удалось сжать изображение'));
          resolve(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Не удалось прочитать файл'));
    };

    img.src = url;
  });
};

onMounted(loadUser);
</script>

<style scoped>
.main-content {
  padding: 40px 20px 80px;
  display: flex;
  justify-content: center;
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: #777;
}

.profile-card {
  border-radius: 10px;
  width: 100%;
  max-width: 1172px;
  padding: 30px;
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.profile-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 240px;
  height: 287px;
}

.profile-photo__img {
  width: 240px;
  height: 240px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  background: #D9D9D9;
}

.profile-photo__input {
  display: none;
}

.profile-photo__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  padding: 6px 12px;
  /* border: 1px solid #F39C12; */
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #FFA902;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.15s ease;
}

.profile-photo__btn:hover {
  background: #FEF3E2;
}

.profile-info {
  flex: 1;
  min-width: 0;
  font-family: "Poppins", sans-serif;
}

.profile-info__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.profile-info__name {
  margin: 0;
  font-size: 36px;
  line-height: 100%;
  font-weight: 600;
  color: #141414;
  font-family: "Poppins", sans-serif;
}

.profile-info__edit {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: #BFBFBF;
  cursor: pointer;
  transition: color 0.15s ease;
}

.profile-info__edit:hover {
  color: #FFA902;
}

.profile-info__row {
  margin-bottom: 18px;
}

.profile-info__label {
  display: block;
  font-size: 14px;
  line-height: 22px;
  color: #8C8C8C;
  margin-bottom: 4px;
}

.profile-info__value {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  color: #262626;
  white-space: pre-line;
}

.profile-info__value--bio {
  max-width: 760px;
}

.form-counter--limit {
  color: #FF4D4F;
}

.profile-form {
  flex: 1;
  min-width: 0;
}

.profile-form__subtitle {
  font-size: 18px;
  line-height: 22px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #2c3e50;
  font-family: "Poppins", sans-serif;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.form-label {
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: #000000D9;
  margin-bottom: 6px;
  font-family: "Poppins", sans-serif;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
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

.form-input {
  height: 40px;
  border-radius: 2px;
}

.form-textarea {
  resize: vertical;
  min-height: 90px;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #BFBFBF;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #F39C12;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.15);
}

.form-input.is-invalid,
.form-textarea.is-invalid {
  border-color: #FF4D4F;
  background: #FFF1F0;
}

.form-input.is-invalid:focus,
.form-textarea.is-invalid:focus {
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  gap: 12px;
}

.form-textarea-wrap {
  position: relative;
  display: flex;
}

.form-counter {
  position: absolute;
  right: 12px;
  bottom: -22px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  line-height: 22px;
  color: #BFBFBF;
  pointer-events: none;
  user-select: none;
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  .profile-photo {
    width: 100%;
    align-items: center;
  }

  .profile-info__head {
    flex-direction: row;
    align-items: center;
  }

  .profile-info__name {
    font-size: 22px;
    line-height: 28px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>