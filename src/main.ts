import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { auth } from './firebaseConfig'

import './normalize.css'
import './theme.css'

const app = createApp(App)

app.provide('firebaseAuth', auth)
app.use(createPinia())
app.use(router)
app.mount('#app')
