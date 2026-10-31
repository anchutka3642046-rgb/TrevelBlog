<template>
  <div class="home-view">
    <AppHeader />

    <main class="container home-main">
      <h2 class="section-title">Там, где мир начинается с путешествий</h2>

      <div v-if="loading" class="loading-state">
        Загрузка историй...
      </div>

      <div v-else-if="posts.length === 0" class="empty-state">
        Пока нет добавленных путешествий. Станьте первым!
      </div>

      <template v-else>
        <div class="posts-grid">
          <PostCard
            v-for="post in visiblePosts"
            :key="post.id"
            :post="post"
          />
        </div>

        <div class="home-footer">
          <button
            type="button"
            class="btn btn--primary"
            @click="handleAddTrip"
          >
            Добавить моё путешествие
          </button>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import PostCard from '../components/PostCard.vue';
import { postsApi } from '../api/posts.js';
import { useAuthStore } from '../stores/auth.js';
import type { PostListItem } from '../types/index.js';

const router = useRouter();
const authStore = useAuthStore();

const posts = ref<PostListItem[]>([]);
const loading = ref(true);

const POSTS_LIMIT = 6;
const visiblePosts = computed(() => posts.value.slice(0, POSTS_LIMIT));

const handleAddTrip = () => {
  if (authStore.isAuthenticated.value) {
    router.push('/create-post');
  } else {
    router.push({ path: '/login', query: { redirect: '/create-post' } });
  }
};

const fetchPosts = async () => {
  try {
    loading.value = true;
    const raw = await postsApi.getPosts();

    posts.value = raw.map((p: PostListItem & { country?: string; city?: string }) => ({
      ...p,
      location:
        p.location ??
        [p.country, p.city].filter(Boolean).join(', '),
    }));
  } catch (error) {
    console.error('Ошибка загрузки постов:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
.home-main {
  padding: 40px 20px 80px;
}

.section-title {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 1170px;
  max-width: 100%;
  margin: 0 auto;
  align-items: stretch;
}

.home-footer {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #777;
  font-size: 16px;
}

@media (max-width: 1200px) {
  .posts-grid {
    width: 100%;
  }
}

@media (max-width: 992px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
