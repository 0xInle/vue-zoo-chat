<template>
  <div class="app-container" ref="appContainer">
    <div v-for="message in currentChat" class="app-answer">
      <div class="user-message" v-if="message.message">
        {{ message.message }}
      </div>
      <div
        class="ai-message"
        v-if="
          message.loading || (message.replay && message.replay.trim() !== '')
        "
      >
        <div
          v-if="!message.loading"
          v-html="message.replay ? marked(message.replay) : ''"
        ></div>
        <Loader v-else />
        <AppToolbar v-if="!message.loading" :text="message.replay ?? ''" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, type Ref, computed } from 'vue'
import { useAnswersStore } from '@/stores/AnswersStore'
import { storeToRefs } from 'pinia'
import { marked } from 'marked'
import Loader from './ui/Loader.vue'
import AppToolbar from './AppToolbar.vue'

const answersStore = useAnswersStore()
const { answer } = storeToRefs(answersStore)

const currentChat = computed(() => {
  const idx = answersStore.currentChatIndex
  if (idx === null || answersStore.answer[idx] === undefined) return []
  return answersStore.answer[idx]
})

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
  border-radius: 10px;
}

.ai-message {
  margin-bottom: 20px;
}
</style>
