<template>
  <RouterView />
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import router from './router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebaseConfig'

const userName = ref<string | null>(localStorage.getItem('userName'))
const userAvatar = ref<string | null>(localStorage.getItem('userAvatar'))

onAuthStateChanged(auth, (user) => {
  const publicPaths = ['/login', '/register', '/forgot', '/verify', '/reset']
  const currentPath = router.currentRoute.value.path

  if (user) {
    userName.value = user.displayName
    userAvatar.value = user.photoURL
    localStorage.setItem('userName', user.displayName || '')
    localStorage.setItem('userAvatar', user.photoURL || '')

    if (publicPaths.includes(currentPath)) {
      router.push('/chat')
    }
  } else {
    userName.value = null
    userAvatar.value = null
    localStorage.removeItem('userName')
    localStorage.removeItem('userAvatar')

    if (!publicPaths.includes(currentPath)) {
      router.push('/login')
    }
  }
})

provide('userName', userName)
provide('userAvatar', userAvatar)
</script>

<style></style>
