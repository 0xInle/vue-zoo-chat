<template>
  <div class="flex">
    <div class="form-wrapper">
      <form class="form flex" @submit.prevent>
        <textarea
          class="form-text"
          placeholder="Сообщение"
          rows="3"
          ref="textarea"
          v-model="userMessage"
          @keydown.enter.prevent="handleEnter"
        ></textarea>
        <AppButton
          text="Отправить"
          @click="addMessage"
          :disabled="isDisabled"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import AppButton from '@/components/AppButton.vue'
import { useStore } from '@/stores/store'
import { ref, computed, onMounted } from 'vue'

const userMessage = ref('')
const store = useStore()
const textarea = ref(null)
const isLoading = ref(false)
const isDisabled = computed(() => userMessage.value === '' || isLoading.value)
const hasChats = computed(() => store.chats.length > 0)
const sendMessageToAI = store.sendMessageToAI

async function addMessage() {
  const messageText = userMessage.value.trim()
  userMessage.value = ''

  if (!hasChats.value) {
    const firstMessage = userMessage.value.trim() || 'Новый чат'
    await store.createChat(firstMessage)
  }

  store.addChatMessage(messageText, 'user')
  const aiResponse = await sendMessageToAI(messageText)
  if (aiResponse) {
    store.addChatMessage(aiResponse, 'llm')
  }
}

onMounted(() => {
  textarea.value?.focus()
})

function handleEnter(event) {
  if (event.shiftKey) {
    message.value += '\n'
    nextTick(() => {
      const el = textarea.value
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    })
  } else {
    addMessage()
  }
}
</script>

<style scoped>
.form {
  flex-direction: column;
}

.form-wrapper {
  margin: 0 auto;
  background-color: var(--form-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px 20px;
  width: 100%;
  max-width: 800px;
}

.form-text {
  resize: none;
  outline: none;
  background-color: transparent;
  border: none;
  color: var(--text-color);
  margin-bottom: 10px;
  white-space: pre-wrap;
}

:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
