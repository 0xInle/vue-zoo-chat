<template>
  <div :class="appClasses">
    <AppMessageList v-if="answersStore.answer.length > 0" />
    <AppWelcomeContent v-else />
    <AppMessageForm />
  </div>
</template>

<script setup lang="ts">
import AppMessageForm from '@/components/AppMessageForm.vue'
import AppMessageList from '@/components/AppMessageList.vue'
import AppWelcomeContent from '@/components/AppWelcomeContent.vue'
import { useAnswersStore } from '@/stores/AnswersStore'
import { computed } from 'vue'

const answersStore = useAnswersStore()
const appClasses = computed(() => [
  'app',
  answersStore.answer.length > 0 ? 'app-has-messages' : '',
])
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
}

.app-has-messages {
  justify-content: space-between;
  padding: 30px 0;
}

.flex {
  width: 100%;
}
</style>
