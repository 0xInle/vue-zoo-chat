<template>
  <div class="app-container" ref="appContainer" tabindex="-1">
    <div class="app-loader" v-if="messages.length === 0"></div>
    <div
      class="app-answer"
      v-else
      v-for="message in messages"
      :key="message.id"
    >
      <div class="user-message" v-if="message.sender === 'user'">
        {{ message.text }}
      </div>
      <div
        class="ai-message"
        v-else-if="message.sender === 'llm'"
        v-html="marked.parse(message.text)"
      ></div>
      <AppToolbar v-if="message.sender === 'llm'" :text="message.text" />
      <div class="error-message" v-if="store.localizedError">
        {{ store.localizedError }}
      </div>
    </div>
    <Loader
      class="user-loader"
      v-if="messages.length && messages[messages.length - 1].sender === 'user'"
    />
  </div>
</template>

<script setup>
import Loader from './ui/Loader.vue'
import AppToolbar from './AppToolbar.vue'
import { watch, onMounted, ref, nextTick, computed } from 'vue'
import { useStore } from '@/stores/store'
import { marked } from 'marked'

const store = useStore()
const messages = computed(() => store.activeChatMessages)
const appContainer = ref(null)

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
  messages,
  () => {
    scrollToBottom()
  },
  { deep: true }
)
</script>

<style scoped>
.app-container {
  position: relative;
  outline: none;
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
  color: var(--text-color);
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
  color: var(--icon-color);
  background-color: var(--bg-color);
  border-radius: 10px;
}

.ai-message {
  margin-bottom: 20px;
}

.error-message {
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid var(--error-color);
  border-radius: 10px;
  color: var(--error-color);
  box-shadow: 0 0 10px rgba(240, 85, 85, 0.3);
}

.user-loader {
  margin-bottom: 20px;
}

.app-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
