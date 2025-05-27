import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import { createI18n } from 'vue-i18n';
import { createBootstrap } from 'bootstrap-vue-next';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import App from './App.vue';
import router from './router';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

const client = new QueryClient();

// Add the necessary CSS

const i18n = createI18n({
  // something vue-i18n options here ...
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VueQueryPlugin, {
  queryClient: client,
});
app.use(createBootstrap());

app.mount('#app');
