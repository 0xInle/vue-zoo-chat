<template>
  <div class="flex">
    <div class="form-wrapper">
      <form class="form flex" @submit.prevent>
        <textarea
          class="form-text"
          placeholder="Сообщение"
          rows="3"
          v-model="message"
          ref="textarea"
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
import { useAnswersStore } from '@/stores/AnswersStore'
import { sendMessageToAI } from '@/api/sendMessage'
import { onMounted, nextTick, ref, computed, type Ref, watch } from 'vue'

const message: Ref<string> = ref('')
const answersStore = useAnswersStore()
const textarea: Ref<HTMLTextAreaElement | null> = ref(null)

const isLoading = ref(false)
const isDisabled = computed(() => message.value === '' || isLoading.value)

function addMessage(): void {
  if (!answersStore.currentChatId) {
    answersStore.addChat()
  }

  const id = answersStore.currentChatId
  if (!id) return

  let currentChat = answersStore.answer[id]
  if (!currentChat) {
    answersStore.addChat()
    const keys = Object.keys(answersStore.answer)
    answersStore.currentChatId = keys[keys.length - 1] ?? null
    currentChat = answersStore.answer[answersStore.currentChatId!]
  }

  if (!currentChat) return

  isLoading.value = true

  currentChat.push({ role: 'user', message: message.value })
  localStorage.setItem('messageHistory', JSON.stringify(answersStore.answer))

  const aiMessageIndex = currentChat.length
  currentChat.push({ role: 'ai', replay: '', loading: true })
  localStorage.setItem('messageHistory', JSON.stringify(answersStore.answer))

  sendMessageToAI(message.value).then((result) => {
    if (typeof result === 'string') {
      currentChat[aiMessageIndex].replay = result
    } else if (result && result.type === 'error') {
      currentChat[aiMessageIndex].error = result
    } else {
      currentChat[aiMessageIndex].error = {
        text: 'Неизвестная ошибка',
        type: 'error',
      }
    }

    currentChat[aiMessageIndex].loading = false
    isLoading.value = false
    localStorage.setItem('messageHistory', JSON.stringify(answersStore.answer))
  })

  message.value = ''
}

function handleEnter(event: KeyboardEvent): void {
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

onMounted(() => {
  textarea.value?.focus()

  const localHistory = localStorage.getItem('messageHistory')
  if (localHistory) {
    answersStore.answer = JSON.parse(localHistory)

    const length = Object.keys(answersStore.answer).length
    answersStore.chatCounter = length
  }

  answersStore.currentChatId = null
})

watch(
  () => answersStore.focusTextarea,
  (val) => {
    if (val) {
      nextTick(() => {
        textarea.value?.focus()
        answersStore.focusTextarea = false
      })
    }
  }
)
</script>

<style scoped>
.form {
  flex-direction: column;
}

.form-wrapper {
  margin: 0 auto;
  background-color: var(--bg-color);
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
