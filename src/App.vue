<template>
  <RouterView />
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import router from './router'
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './firebaseConfig'

const userName = ref<string | null>(localStorage.getItem('userName'))
const userAvatar = ref<string | null>(localStorage.getItem('userAvatar'))

onAuthStateChanged(auth, (user) => {
  if (user) {
    userName.value = user.displayName
    userAvatar.value = user.photoURL
    localStorage.setItem('userName', user.displayName || '')
    localStorage.setItem('userAvatar', user.photoURL || '')
    if (router.currentRoute.value.path === '/login') {
      router.push('/chat')
    }
  } else {
    userName.value = null
    userAvatar.value = null
    localStorage.removeItem('userName')
    localStorage.removeItem('userAvatar')
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
  }
})

async function signInWithGoogle() {
  if (auth.currentUser) {
    userName.value = auth.currentUser.displayName
    userAvatar.value = auth.currentUser.photoURL
    router.push('/chat')
    return
  }

  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    userName.value = user.displayName
    userAvatar.value = user.photoURL
    localStorage.setItem('userName', user.displayName || '')
    localStorage.setItem('userAvatar', user.photoURL || '')
    router.push('/chat')
  } catch (error) {
    console.error(error)
  }
}

function logout() {
  auth.signOut()
  userName.value = null
  userAvatar.value = null
  router.push('/login')
}

provide('login', signInWithGoogle)
provide('logout', logout)
provide('userName', userName)
provide('userAvatar', userAvatar)
</script>

<style></style>
