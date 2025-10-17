<template>
  <AppLogoBar @showAside="showAside" v-if="!isVisible" />
  <AppAside v-model:isVisible="isVisible" />

  <main class="main">
    <Loader v-if="isInitialLoading" />
    <AppWelcomeContent v-else-if="showWelcome" />
    <AppMessageList v-else />
    <AppMessageForm v-if="!isInitialLoading" />
  </main>

  <AppProfileBar />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Loader from '@/components/ui/Loader.vue'
import AppLogoBar from '@/components/AppLogoBar.vue'
import AppAside from '@/components/AppAside.vue'
import AppMessageList from '@/components/AppMessageList.vue'
import AppWelcomeContent from '@/components/AppWelcomeContent.vue'
import AppMessageForm from '@/components/AppMessageForm.vue'
import AppProfileBar from '@/components/AppProfileBar.vue'
import { useStore } from '@/stores/store'
import {
  initAuthStateListener,
  cleanupAllListeners,
} from '@/stores/authService'

const store = useStore()
const isVisible = ref(false)
const isInitialLoading = ref(true)

const hasMessages = computed(() => store.messages.length > 0)
const showWelcome = computed(
  () => !isInitialLoading.value && !hasMessages.value
)

onMounted(async () => {
  await initAuthStateListener(store)
  isInitialLoading.value = false
})

onMounted(async () => {
  await initAuthStateListener(store)

  if (store.activeChatId && store.currentUser) {
    await new Promise<void>((resolve) => {
      const stopWatch = watch(
        () => store.activeChatMessages,
        () => {
          resolve()
          stopWatch()
        },
        { deep: true }
      )
    })
  }

  isInitialLoading.value = false
})

function showAside() {
  isVisible.value = !isVisible.value
}

onUnmounted(() => {
  cleanupAllListeners()
})
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

.loader {
  margin-top: auto;
  margin-bottom: auto;
}

.flex {
  width: 100%;
}
</style>
