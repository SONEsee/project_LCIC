import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './nuxt.config'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia) 