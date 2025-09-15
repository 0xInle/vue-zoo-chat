import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import ForgotPassword from '@/views/Forgot.vue'
import Register from '@/views/Register.vue'
import Chat from '@/views/Chat.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login, alias: '/' },
    { path: '/forgot', component: ForgotPassword },
    { path: '/register', component: Register },
    { path: '/chat', component: Chat },
  ],
})

export default router
