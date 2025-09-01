<template>
  <div
    :class="['app', answersStore.answer.length > 0 ? 'app-has-messages' : '']"
  >
    <div
      class="app-container"
      v-if="answersStore.answer.length > 0"
      ref="appContainer"
    >
      <div
        class="app-answer"
        v-for="(message, idx) in answersStore.answer"
        :key="idx"
      >
        <div class="user-message" v-if="message.message">
          {{ message.message }}
        </div>
        <div class="ai-message">
          <div
            v-if="!message.loading"
            v-html="message.replay ? marked(message.replay) : ''"
          ></div>
          <Loader v-else />
        </div>
      </div>
    </div>
    <div class="app-welcome-message flex" v-else>
      <h1 class="app-title">Добро пожаловать.</h1>
      <h2 class="app-subtitle">Чем я могу вам сегодня помочь?</h2>
    </div>
    <AppMessageForm />
  </div>
</template>

<script setup>
import Loader from '@/components/ui/Loader.vue'
import AppMessageForm from '@/components/AppMessageForm.vue'
import { useAnswersStore } from '@/stores/AnswersStore'
import { ref, onUpdated } from 'vue'
import { marked } from 'marked'

const answersStore = useAnswersStore()
const appContainer = ref()

onUpdated(() => {
  const scrollContainer = appContainer.value
  if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight
})
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

.app-container {
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
  padding-right: 10px;
  flex-direction: column;
  overflow-y: auto;
}

.app-answer {
  margin-bottom: 50px;
  font-size: 14px;
  line-height: 1.5;
  color: #fff;
}

.app-answer:last-child {
  margin-bottom: 0;
}

.flex {
  width: 100%;
}

.app-welcome-message {
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.app-title {
  margin: 0;
  margin-bottom: 30px;
  color: #fff;
  font-size: 24px;
  font-weight: 400;
}

.app-subtitle {
  margin: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
}

.user-message {
  width: 50%;
  margin-left: auto;
  max-width: 50%;
  padding: 10px 20px;
  max-width: fit-content;
  background-color: #404045;
  border-radius: 20px;
}
</style>
