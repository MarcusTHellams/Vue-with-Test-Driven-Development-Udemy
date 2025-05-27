import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import { createI18n } from 'vue-i18n';
import { createBootstrap } from 'bootstrap-vue-next';

// Add the necessary CSS

const i18n = createI18n({
  // something vue-i18n options here ...
});

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(createBootstrap());

app.mount('#app');
