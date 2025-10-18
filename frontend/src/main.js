import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/style.css'
import App from './App.vue'

if (import.meta.env.DEV) {
  const { worker } = await import('@/mocks/browser')
  await worker.start({
    serviceWorker: { url: import.meta.env.BASE_URL + 'mockServiceWorker.js' }
  })
}

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')