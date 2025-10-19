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

<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import { useStore } from '@/stores/store'
import { ref, computed, onMounted, nextTick } from 'vue'
import { addChatMessage } from '@/stores/messageService'
import { createChat } from '@/stores/chatService'
import { sendMessageToAI } from '@/services/messageToAi'

const userMessage = ref('')
const store = useStore()
const textarea = ref<HTMLTextAreaElement | null>(null)
const isLoading = ref(false)
const isDisabled = computed(() => userMessage.value === '' || isLoading.value)
const hasChats = computed(() => store.chats.length > 0)

async function addMessage() {
  if (isLoading.value) return
  const messageText = userMessage.value.trim()
  userMessage.value = ''
  isLoading.value = true

  if (!hasChats.value) {
    await createChat(store)
  }

  addChatMessage(messageText, 'user', store)
  const aiResponse = await sendMessageToAI(messageText, store)
  if (aiResponse) {
    addChatMessage(aiResponse, 'llm', store)
  }

  isLoading.value = false
}

onMounted(() => {
  textarea.value?.focus()
})

function handleEnter(event: KeyboardEvent) {
  if (event.shiftKey) {
    userMessage.value += '\n'
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

@media (width <= 480px) {
  .form-wrapper {
    margin: 0;
  }
}
</style>
