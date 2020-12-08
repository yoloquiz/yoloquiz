import '@/assets/styles/index.css';

import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import notify from '@/plugins/notify';

createApp(App)
  .use(store)
  .use(router)
  .use(notify)
  .mount('#app');
