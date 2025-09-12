<template>
  <AppLogoBar @showAside="showAside" v-if="!isVisible" />
  <AppAside v-model:isVisible="isVisible" />
  <main class="main">
    <AppMessageList v-if="answersStore.currentChatId" />
    <AppWelcomeContent v-else />
    <AppMessageForm />
  </main>
  <AppProfileBar />
</template>

<script setup lang="ts">
import AppLogoBar from '@/components/AppLogoBar.vue'
import AppAside from '@/components/AppAside.vue'
import AppMessageList from '@/components/AppMessageList.vue'
import AppWelcomeContent from '@/components/AppWelcomeContent.vue'
import AppMessageForm from '@/components/AppMessageForm.vue'
import AppProfileBar from '@/components/AppProfileBar.vue'
import { useAnswersStore } from '@/stores/AnswersStore'
import { ref } from 'vue'

const answersStore = useAnswersStore()
const isVisible = ref(false)

function showAside() {
  isVisible.value = !isVisible.value
}
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}

.flex {
  width: 100%;
}
</style>
