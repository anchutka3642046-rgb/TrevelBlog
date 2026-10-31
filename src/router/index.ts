import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth'; 
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/posts/:id',
      name: 'post-detail',
      component: () => import('../views/PostDetailView.vue'),
    },
    {
      path: '/create-post',
      name: 'create-post',
      component: () => import('../views/CreatePostView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/posts/:id/comment',
      name: 'add-comment',
      component: () => import('../views/AddCommentView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return { name: 'login' };
  }

  if (to.meta.guestOnly && auth.isAuthenticated.value) {
    return { name: 'home' };
  }

});

export default router;
