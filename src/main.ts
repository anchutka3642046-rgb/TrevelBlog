import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import './assets/styles/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); 


import router from './router/index.js';

window.addEventListener('auth:logout', () => {
  if (router.currentRoute.value.name !== 'login') {
    router.push({ name: 'login' });
  }
});

app.use(router);
app.mount('#app');
