<template>
  <header class="hero-header">
    <div class="hero-header__top container">
      <router-link to="/" class="logo">
        <span class="logo__icon">
          <img :src="logoIcon" alt="Travel" width="40" height="20" />
        </span>
        <span class="logo__text">Travel</span>
      </router-link>

      <div class="user-nav">
        <div v-if="authStore.isAuthenticated.value" class="user-menu" ref="menuRef">
          <button class="user-menu__trigger" type="button" @click.stop="toggleMenu">
            <img v-if="avatarUrl && !avatarError" :src="avatarUrl" alt="avatar" class="user-menu__avatar"
              @error="avatarError = true" />
            <span v-else class="user-menu__avatar user-menu__avatar--stub">
              {{ initials }}
            </span>

            <span class="user-menu__name">{{ displayName }}</span>

            <svg class="user-menu__arrow" :class="{ 'user-menu__arrow--up': isMenuOpen }" width="14" height="11"
              viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.78239 1.40794C6.18199 0.864124 6.99446 0.864124 7.39406 1.40794L11.4805 6.96914C11.9658 7.62956 11.4942 8.56128 10.6746 8.56128H2.5018C1.68226 8.56128 1.21068 7.62956 1.69597 6.96914L5.78239 1.40794Z"
                fill="white" />
            </svg>
          </button>

          <div v-if="isMenuOpen" class="user-menu__dropdown" @click.stop>
            <div class="user-card">
              <img v-if="avatarUrl && !avatarError" :src="avatarUrl" alt="avatar" class="user-card__avatar"
                @error="avatarError = true" />
              <span v-else class="user-card__avatar user-card__avatar--stub">
                {{ initials }}
              </span>

              <p class="user-card__name">{{ profile.full_name || displayName }}</p>
              <p v-if="profile.city" class="user-card__city">{{ profile.city }}</p>
              <p v-if="profile.bio" class="user-card__bio">{{ profile.bio }}</p>
              <p v-if="profileLoading" class="user-card__loading">Загрузка…</p>
            </div>

            <div class="user-menu__actions">
              <router-link to="/profile" class="user-menu__item" @click="isMenuOpen = false">
                Профиль
              </router-link>
              <button class="user-menu__item user-menu__item--logout" type="button" @click="handleLogout">
                Выйти
              </button>
            </div>
          </div>
        </div>

        <router-link v-else to="/login" class="login-link">Войти</router-link>
      </div>
    </div>

    <div class="hero-header__content container">
      <h1 class="hero-header__title">{{ title }}</h1>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { userApi, extractPhotoUrl } from '../api/user';
import logoIcon from '../assets/logoIcon.svg';

withDefaults(
  defineProps<{ title?: string }>(),
  { title: 'ТАМ, ГДЕ МИР НАЧИНАЕТСЯ С ПУТЕШЕСТВИЙ' }
);

const authStore = useAuthStore();
const router = useRouter();

const isMenuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const avatarError = ref(false);

const BACKEND_URL = 'https://travelblog.skillbox.cc';

const currentUser = computed(() => authStore.state?.user ?? null);

interface ProfileData {
  full_name?: string;
  city?: string;
  country?: string;
  bio?: string;
  photo?: string;
}

const profile = ref<ProfileData>({});
const profileLoading = ref(false);

const displayName = computed(
  () => profile.value.full_name || currentUser.value?.full_name || 'Мой профиль'
);

const avatarUrl = computed(() => {
  const raw =
    extractPhotoUrl(profile.value as any) ||
    extractPhotoUrl(currentUser.value as any) ||
    '';

  if (!raw) return '';
  if (raw.startsWith('blob:') || raw.startsWith('data:')) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${BACKEND_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
});

const initials = computed(() => {
  const name = (displayName.value || '').trim();
  const parts = name.split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'U';
});

watch(avatarUrl, () => { avatarError.value = false; });

const fetchProfile = async () => {
  if (!authStore.isAuthenticated.value) return;
  try {
    profileLoading.value = true;
    const data: any = await userApi.getUser();
    profile.value = data || {};
    if (data) authStore.setUser(data);
  } catch (e) {
    console.error('Не удалось загрузить профиль:', e);
  } finally {
    profileLoading.value = false;
  }
};

const toggleMenu = async () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) await fetchProfile();
};

const handleLogout = async () => {
  isMenuOpen.value = false;
  await authStore.logout();
  router.push({ name: 'home' });
};

const handleClickOutside = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  if (authStore.isAuthenticated.value && !currentUser.value) {
    authStore.fetchCurrentUser();
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.hero-header {
  background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)),
    url('/woman-traveler-with-backpack-walking-yasaka-pagoda-sannen-zaka-street-kyoto-japan 1.png') center/cover no-repeat;
  color: #fff;
  padding-bottom: 60px;
  min-height: 422px;
  width: 100%;
}

.hero-header__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  max-width: 1134px;
  border-bottom: 1px solid #ffffff99;
  height: 100px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  font-size: 20px;
}

.logo__text {
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 33.88px;
  line-height: 100%;
  letter-spacing: 14.5%;
}

.user-menu {
  position: relative;
}

.user-menu__trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
}

.user-menu__avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  background: #FEF3E2;
  flex-shrink: 0;
}

.user-menu__avatar--stub {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #F39C12;
}

.user-menu__name {
  font-size: 16px;
  line-height: 183%;
  white-space: nowrap;
  color: #FFFFFF;
}

.user-menu__arrow {
  color: #fff;
  transition: transform 0.2s ease;
}

.user-menu__arrow--up {
  transform: rotate(180deg);
}

.user-menu__dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  z-index: 100;
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #EEE;
}

.user-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  background: #FEF3E2;
  margin-bottom: 10px;
}

.user-card__avatar--stub {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #F39C12;
}

.user-card__name {
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px;
  word-break: break-word;
}

.user-card__city {
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  color: #868383;
  margin: 0 0 4px;
}

.user-card__bio {
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: #595959;
  margin: 0;
  word-break: break-word;
}

.user-card__loading {
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  color: #BFBFBF;
  margin: 6px 0 0;
}

.user-menu__actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-menu__item {
  padding: 6px 8px;
  border-radius: 4px;
  text-align: left;
  font-weight: 400;
  font-size: 13px;
  line-height: 140%;
  color: #262626;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  font-family: "Poppins", sans-serif;
}

.user-menu__item:hover {
  background: #F5F5F5;
}

.login-link {
  color: #fff;
  text-decoration: none;
  font-weight: 400;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
}

.hero-header__content {
  text-align: center;
  margin-top: 108px;
}

.hero-header__title {
  font-size: 48px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 100%;
}
</style>
