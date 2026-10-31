<template>
  <div class="post-card">
    <div class="post-card__image-wrap">
       <img
        :src="getImageUrl(post.photo)"
        :alt="post.title"
        class="post-card__img"
        @error="(e) => (e.target as HTMLImageElement).src = '/images/default-avatar.png'"
      />
    </div>
    <div class="post-card__body">
      <h3 class="post-card__title">{{ post.title }}</h3>
      <p class="post-card__excerpt">{{ post.excerpt }}</p>
      <p class="post-card__location">{{ post.location }}</p>
      <router-link :to="`/posts/${post.id}`" class="post-card__link">
        Подробнее →
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostListItem } from '../types';
import { getImageUrl } from '../utils/formatters';

defineProps<{
  post: PostListItem;
}>();
</script>

<style scoped>
.post-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 1px 10px 0px #0000001A;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 552px;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.post-card__image-wrap {
  width: 100%;
  height: 288px;
  background: #f0f0f0;
}

.post-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-card__body {
  padding: 26px 25px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.post-card__title {
  font-size: 18px;
  font-weight: 600;
  line-height: 100%;
  color: #141414;
  margin-bottom: 10px;
}

.post-card__excerpt {
  color: #868383;
  margin-bottom: 16px;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 183%;
}

.post-card__location {
  font-size: 14px;
  line-height: 183%;
  color: #141414;
  margin-bottom: 4px;
  margin-top: auto;
}

.post-card__link {
  color: #FFA902;
  font-weight: 500;
  font-size: 14px;
  line-height: 183%;
  font-family: "Poppins", sans-serif;
}
</style>
