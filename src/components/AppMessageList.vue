<template>
  <div class="app-container" ref="appContainer">
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, type Ref } from 'vue'
import { useAnswersStore } from '@/stores/AnswersStore'
import { storeToRefs } from 'pinia'
import { marked } from 'marked'
import Loader from './ui/Loader.vue'

const answersStore = useAnswersStore()
const { answer } = storeToRefs(answersStore)

const appContainer: Ref<HTMLDivElement | null> = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    const container = appContainer.value
    if (container)
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
  })
}

onMounted(() => {
  scrollToBottom()
})

watch(
  answer,
  () => {
    scrollToBottom()
  },
  { deep: true }
)
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.app-container::-webkit-scrollbar {
  display: none;
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

.user-message {
  width: 50%;
  margin-left: auto;
  max-width: 50%;
  padding: 10px;
  max-width: fit-content;
  background-color: #404045;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  border-radius: 10px;
}
</style>
