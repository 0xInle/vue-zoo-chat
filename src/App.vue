<template>
  <AppLogoBar @showAside="showAside" v-if="!isVisible" />
  <AppAside v-model:isVisible="isVisible" />
  <main :class="mainClasses">
    <AppMessageList v-if="answersStore.answer.length > 0" />
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
import { computed, ref } from 'vue'

const answersStore = useAnswersStore()
const isVisible = ref(false)

function showAside() {
  isVisible.value = !isVisible.value
}

const mainClasses = computed(() => [
  'main',
  answersStore.answer.length > 0 ? 'main-has-messages' : '',
])
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
}

.main-has-messages {
  justify-content: space-between;
  padding: 20px 0;
}

.flex {
  width: 100%;
}
</style>
