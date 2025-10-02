<template>
  <div class="logo-content">
    <img :src="state === 'dark' ? lightLogo : darkLogo" alt="Логотип" />
    <div class="title">Zoo</div>
  </div>
</template>

<script setup>
import { useColorMode } from '@vueuse/core'

const { state } = useColorMode()
const lightLogo = '../../public/logo.png'
const darkLogo = '../../public/logo-dark.png'
</script>

<style scoped>
.logo-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  & img {
    display: block;
    height: 42px;
    margin-right: 20px;
  }
}

.logo {
  display: block;
  height: 42px;
  margin-right: 20px;
}

.title {
  font-size: 36px;
  font-weight: 900;
  color: var(--text-color);
  line-height: 1;
}
</style>
