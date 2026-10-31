<template>
  <div class="comment-page">
    <AppHeader title="ИСТОРИИ ВАШИХ ПУТЕШЕСТВИЙ" />

    <form class="auth-card" @submit.prevent="handleSubmit" novalidate>
      <h1 class="auth-card__title">Добавление отзыва</h1>

      <p v-if="errors.server" class="auth-card__server-error">
        {{ errors.server }}
      </p>

      <div class="form-group">
        <label class="form-label">
          <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
          Ваше имя
        </label>
        <input v-model.trim="form.author_name" type="text" class="form-input"
          :class="{ 'is-invalid': errors.author_name }" placeholder="Имя или никнейм" maxlength="255" />
        <span v-if="errors.author_name" class="form-error">{{ errors.author_name }}</span>
      </div>

      <div class="form-group">
        <label class="form-label">
          <img src="@/assets/flower.svg" alt="" class="req-icon" aria-hidden="true" />
          Отзыв
        </label>

        <div class="form-textarea-wrap">
          <textarea v-model="form.comment" class="form-textarea" :class="{ 'is-invalid': errors.comment }" rows="5"
            maxlength="600" placeholder="Добавьте текст отзыва..."></textarea>
        </div>

        <div class="form-field-footer">
          <span v-if="errors.comment" class="form-error">{{ errors.comment }}</span>
          <span v-else class="form-error-spacer"></span>

          <span class="char-counter" :class="{ 'char-counter--limit': form.comment.length >= 600 }">
            {{ form.comment.length }} / 600
          </span>
        </div>
      </div>

      <div class="auth-card__actions">
        <button type="button" class="btn btn--outline auth-card__btn auth-card__btn--outline" @click="goBack">
          ← Назад
        </button>

        <button type="submit" class="btn btn--primary auth-card__btn auth-card__btn--primary" :disabled="submitting">
          {{ submitting ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>
    </form>

    <ModalSuccess :isOpen="isSuccessModalOpen" message="Ваш отзыв успешно добавлен" @close="handleSuccessClose" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import ModalSuccess from '../components/ModalSuccess.vue';
import { postsApi } from '../api/posts.js';
import { useAuthStore } from '../stores/auth.js';
import { extractApiError } from '../utils/validators.js';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const submitting = ref(false);
const isSuccessModalOpen = ref(false);

const form = reactive({ author_name: '', comment: '' });
const errors = reactive({ author_name: '', comment: '', server: '' });

const postId = () => route.params.id as string;

onMounted(() => {
  form.author_name = authStore.state?.user?.full_name || '';
});

const validate = () => {
  errors.author_name = '';
  errors.comment = '';
  errors.server = '';

  let ok = true;

  if (!form.author_name) {
    errors.author_name = 'Напишите имя';
    ok = false;
  } else if (form.author_name.length > 255) {
    errors.author_name = 'Имя не должно превышать 255 символов';
    ok = false;
  }

  if (!form.comment.trim()) {
    errors.comment = 'Добавьте текст отзыва ';
    ok = false;
  } else if (form.comment.length > 600) {
    errors.comment = 'Отзыв не должен быть длиннее 600 символов';
    ok = false;
  }

  return ok;
};

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    submitting.value = true;
    await postsApi.addComment(postId(), {
      full_name: form.author_name,
      comment: form.comment,
    });
    isSuccessModalOpen.value = true;
  } catch (error: any) {
    errors.server = extractApiError(error, 'Не удалось добавить отзыв');
  } finally {
    submitting.value = false;
  }
};

const handleSuccessClose = () => {
  isSuccessModalOpen.value = false;
  router.push({ name: 'post-detail', params: { id: postId() } });
};

const goBack = () => {
  router.push({ name: 'post-detail', params: { id: postId() } });
};
</script>

<style scoped>
.comment-page {
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
  box-sizing: border-box;
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
  line-height: 130%;
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

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  width: 100%;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: #000000D9;
  margin-bottom: 8px;
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
  margin-top: 4px;
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

.form-textarea-wrap {
  display: flex;
}

.form-field-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-top: 4px;
  min-height: 22px;
}

.form-error {
  margin-top: 0;
  font-size: 14px;
  line-height: 22px;
  color: #FF4D4F;
  font-family: "Poppins", sans-serif;
}

.form-error-spacer {
  flex: 1;
}

.char-counter {
  margin-top: 0;
  margin-left: 10px;
  flex-shrink: 0;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  line-height: 22px;
  color: #BFBFBF;
  user-select: none;
}

.char-counter--limit {
  color: #FF4D4F;
}

.char-counter {
  align-self: flex-end;
  margin-top: 4px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  line-height: 22px;
  color: #BFBFBF;
  user-select: none;
}

.char-counter--limit {
  color: #FF4D4F;
}

@media (max-width: 900px) {
  .auth-card {
    padding: 28px 40px;
  }

  .auth-card__title {
    font-size: 26px;
  }
}
</style>
