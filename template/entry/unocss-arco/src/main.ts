import ArcoVue from '@arco-design/web-vue'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import '@arco-design/web-vue/dist/arco.css'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ArcoVue)
app.mount('#app')
