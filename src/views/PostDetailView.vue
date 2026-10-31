<template>
  <div class="post-detail-view">
    <AppHeader title="ИСТОРИИ ВАШИХ ПУТЕШЕСТВИЙ" />
  
    <main class="container main-content" v-if="post">
      <article class="post-card-full">
        <img class="post-card-image" v-if="imageUrl" :src="imageUrl" :alt="post.title" @error="onImageError" />
        <div v-else class="post-image-stub">{{ post.title }}</div>
  
        <div class="post-card-full__body">
          <h1 class="post-card-full__title">{{ post.title }}</h1>
  
          <div class="post-card-full__description">
            {{ post.description }}
          </div>
          <section class="comments-section">
  
            <div v-if="post.comments.length === 0" class="no-comments">
              Пока нет отзывов. Оставьте своё первое впечатление!
            </div>
  
            <ul v-else class="comments-list">
              <li v-for="(comment, index) in post.comments" :key="index" class="comment-item">
                <div class="comment-item__header">
                  <span class="comment-item__author">{{ comment.author_name }}</span>
                  <span v-if="comment.created_at" class="comment-item__date">
                    {{ formatDate(comment.created_at) }}
                  </span>
                </div>
  
                <p class="comment-item__text">{{ comment.comment }}</p>
              </li>
            </ul>
  
            <div class="actions-panel">
              <button class="btn btn--outline" @click="$router.push('/')">
                ← Назад
              </button>
              <button v-if="authStore.isAuthenticated?.value" class="btn btn--primary"
                @click="$router.push({ name: 'add-comment', params: { id: post.id } })">
                Ваше впечатление об этом месте
              </button>
            </div>
          </section>
        </div>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import { postsApi } from '../api/posts.js';
import { useAuthStore } from '../stores/auth.js';
import type { PostDetail } from '../types/index.js';
import { resolveImageUrl } from '../utils/url';

const route = useRoute();
const authStore = useAuthStore();

const post = ref<PostDetail | null>(null);
const imageError = ref(false);

const imageUrl = computed(() => {
  if (imageError.value) return '';
  const p: any = post.value;
  if (!p) return '';
  const raw = p.image ?? p.image_url ?? p.photo ?? p.picture ?? p.images?.[0] ?? '';
  return resolveImageUrl(raw);
});

const onImageError = () => { imageError.value = true; };

const loadPost = async () => {
  const postId = route.params.id as string;
  try {
    post.value = await postsApi.getPostById(postId);
  } catch (e) {
    console.error('Ошибка получения поста:', e);
  }
};

const formatDate = (isoStr: string) => {
  const d = new Date(isoStr);
  return d.toLocaleDateString('ru-RU');
};

onMounted(() => {
  loadPost();
});
</script>

<style scoped>
.main-content {
  width: 100%;
  margin: 0;
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.post-card-full {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  max-width: 1172px;
}

.post-card-full__image-box {
  width: 100%;
  min-height: 450px;
  overflow: hidden;
}

.post-card-full__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-card-full__body {
  padding: 30px 102px;
}

.post-card-full__title {
  font-size: 36px;
  line-height: 100%;
  font-weight: 700;
  margin-bottom: 15px;
  color: #141414;
}

.post-card-image {
  width: 100%;
}

.post-card-full__description {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #000000;
  margin-bottom: 35px;
  white-space: pre-line;
}

.comments-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 35px;
}

.comment-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 30px;
}

.comment-item__header {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 5px;
}

.comment-item__author {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: #000000;
}

.comment-item__date {
  font-size: 14px;
  line-height: 24px;
  color: #868383;
}

.comment-item__text {
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  line-height: 24px;
}

.actions-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 25px;
  font-size: 18px;
}

.overlay-container {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
}

.form-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.form-title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 25px;
  font-weight: 700;
}

.char-counter {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}
</style>
