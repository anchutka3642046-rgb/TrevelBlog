<template>
  <div class="create-post-view">
    <AppHeader title="ИСТОРИИ ВАШИХ ПУТЕШЕСТВИЙ" />

    <main class="container main-content">
      <div class="form-card">
        <h2 class="form-title">Добавление истории о путешествии</h2>

        <form class="form-wrapper" @submit.prevent="handleSubmit">
          <div class="upload-box" role="button" tabindex="0" @click="fileInputRef?.click()"
            @keydown.enter="fileInputRef?.click()" @keydown.space.prevent="fileInputRef?.click()">
            <input type="file" ref="fileInputRef" class="upload-box__input" accept="image/png, image/jpeg"
              @change="handleFileChange" />

            <svg class="upload-box__icon" width="11" height="11" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V4m0 0L7 9m5-5l5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" stroke="currentColor"
                stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="upload-box__label">
              {{ selectedFileName || 'Загрузите ваше фото' }}
            </span>
          </div>
          <div class="form-group">
            <label class="form-label">
              <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
              Заголовок
            </label>
            <input v-model.trim="form.title" type="text" class="form-input" :class="{ 'is-invalid': errors.title }"
              placeholder="Заголовок" maxlength="255" />
            <span v-if="errors.title" class="form-error">{{ errors.title }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
                Страна
              </label>
              <input v-model.trim="form.country" type="text" class="form-input"
                :class="{ 'is-invalid': errors.country }" placeholder="Страна" maxlength="255" />
              <span v-if="errors.country" class="form-error">{{ errors.country }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">
                <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
                Город
              </label>
              <input v-model.trim="form.city" type="text" class="form-input" :class="{ 'is-invalid': errors.city }"
                placeholder="Город" maxlength="255" />
              <span v-if="errors.city" class="form-error">{{ errors.city }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
              Описание
            </label>
            <textarea v-model="form.description" class="form-textarea" :class="{ 'is-invalid': errors.description }"
              placeholder="Добавьте описание вашей истории..." rows="6" maxlength="2000"></textarea>
            <div class="char-counter">{{ form.description.length }} / 2000</div>
            <span v-if="errors.description" class="form-error">{{ errors.description }}</span>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn--outline" @click="$router.push('/')">
              ← Назад
            </button>
            <button type="submit" class="btn btn--primary" :disabled="submitting">
              {{ submitting ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </main>

    <ModalSuccess :isOpen="isSuccessModalOpen" message="Ваша история успешно добавлена" @close="handleSuccessClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import ModalSuccess from '../components/ModalSuccess.vue';
import { postsApi } from '../api/posts.js';
import { compressImage } from '../utils/image';
import { extractApiError } from '../utils/validators';

const router = useRouter();

const fileInputRef = ref<HTMLInputElement | null>(null);
const photoFile = ref<File | null>(null);
const selectedFileName = ref('');
const previewUrl = ref('');
const submitting = ref(false);
const isSuccessModalOpen = ref(false);

const form = reactive({ title: '', country: '', city: '', description: '' });
const errors = reactive({
  photo: '',
  title: '',
  country: '',
  city: '',
  description: '',
  general: '',
});

const resetPhoto = (input?: HTMLInputElement) => {
  if (previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = '';
  photoFile.value = null;
  selectedFileName.value = '';
  if (input) input.value = '';
};

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  errors.photo = '';

  if (!file) {
    resetPhoto(input);
    return;
  }

  if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
    errors.photo = 'Допустимы только PNG, JPG или WEBP';
    resetPhoto(input);
    return;
  }

  try {
    const compressed = await compressImage(file, 1200, 0.75);

    if (previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value);
    }

    photoFile.value = compressed;
    selectedFileName.value = compressed.name;
    previewUrl.value = URL.createObjectURL(compressed);
  } catch (e) {
    console.error(e);
    errors.photo = 'Не удалось обработать изображение';
    resetPhoto(input);
  }
};

const validateForm = () => {
  Object.keys(errors).forEach((k) => ((errors as any)[k] = ''));
  let ok = true;

  if (!photoFile.value) { errors.photo = 'Загрузите фотографию'; ok = false; }
  if (!form.title) { errors.title = 'Заполните заголовок'; ok = false; }
  if (!form.country) { errors.country = 'Укажите страну'; ok = false; }
  if (!form.city) { errors.city = 'Укажите город'; ok = false; }
  if (!form.description.trim()) { errors.description = 'Добавьте описание'; ok = false; }

  return ok;
};

const buildFormData = () => {
  const data = new FormData();
  data.append('title', form.title);
  data.append('description', form.description);
  data.append('country', form.country);
  data.append('city', form.city);
  if (photoFile.value) data.append('photo', photoFile.value);
  return data;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    submitting.value = true;
    await postsApi.createPost(buildFormData());
    isSuccessModalOpen.value = true;
  } catch (error: any) {
    console.error('Ошибка создания поста:', error);

    const status = error.response?.status;

    if (status === 413) {
      errors.general = 'Фото слишком большое. Выберите файл меньше 2 МБ.';
    } else if (status === 401) {
      errors.general = 'Сессия истекла, войдите заново.';
    } else if (!error.response) {
      errors.general = 'Сервер не принял запрос. Возможно, файл слишком большой.';
    } else {
      errors.general = extractApiError(error, 'Не удалось сохранить пост');
    }
  } finally {
    submitting.value = false;
  }
};

const handleSuccessClose = () => {
  isSuccessModalOpen.value = false;
  router.push({ name: 'home' });
};
</script>


<style scoped>
.main-content {
  padding: 40px 20px 80px;
  display: flex;
  justify-content: center;
  min-width: 1134px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  width: 100%;
}

.form-card {
  max-width: 695px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-title {
  text-align: center;
  font-size: 38px;
  font-weight: 600;
  line-height: 100%;
  margin-bottom: 20px;
  font-family: "Poppins", sans-serif;
  color: #141414;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  line-height: 22%;
  font-weight: 400;
  font-family: "Poppins", sans-serif;
  color: #000000D9;
  margin-bottom: 8px;
}

.req-icon {
  width: 10px;
  height: 10px;
  display: inline-block;
  flex-shrink: 0;
  color: #FF4D4F;
}

.form-wrapper {
  min-width: 651px;
  width: 100%;
}


.form-input {
  height: 32px;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #9c9c9c;
  opacity: 1;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  line-height: 150%;
}

.form-input.is-invalid,
.form-textarea.is-invalid {
  border-color: #e74c3c;
}

.upload-box {
  width: 100%;
  max-width: 200px;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  padding: 5px 17px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 5px;
  background: #fff;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.2s ease, background 0.2s ease;
  align-self: flex-start;
}

.upload-box:hover {
  border-color: #f39c12;
  background: #fffdf8;
}

.upload-box:focus-visible {
  outline: 2px solid #f39c12;
  outline-offset: 2px;
}

.upload-box.is-invalid {
  border-color: #e74c3c;
}

.upload-box.has-file .upload-box__label {
  color: #141414;
  font-weight: 500;
}

.upload-box__input {
  display: none;
}

.upload-box__icon {
  color: #00000040;
  flex-shrink: 0;
  width: 11px;
  height: 11px;
}

.upload-box__label {
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400px;
  line-height: 22%;
  color: #000000D9;
  text-align: left;
  flex: 1;
}

.upload-box__hint {
  font-size: 12px;
  color: #999;
  margin-left: auto;
  white-space: nowrap;
}

.form-error {
  font-size: 12px;
  color: #e74c3c;
  margin-bottom: 4px;
}


.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.char-counter {
  color: #00000040;
  text-align: right;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
