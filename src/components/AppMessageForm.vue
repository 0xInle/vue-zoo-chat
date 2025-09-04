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
import { onMounted, nextTick, ref, computed, type Ref } from 'vue'

const message: Ref<string> = ref('')
const answersStore = useAnswersStore()
const textarea: Ref<HTMLTextAreaElement | null> = ref(null)

const isLoading = ref(false)
const isDisabled = computed(() => message.value === '' || isLoading.value)

function addMessage(localizedMessage?: string): void {
  isLoading.value = true

  answersStore.answer.push({ role: 'user', message: message.value })
  localStorage.setItem('messageHistory', JSON.stringify(answersStore.answer))

  const aiMessageIndex = answersStore.answer.length
  answersStore.answer.push({ role: 'ai', replay: '', loading: true })
  localStorage.setItem('messageHistory', JSON.stringify(answersStore.answer))

  sendMessageToAI(message.value).then((replay) => {
    answersStore.answer[aiMessageIndex].replay = replay
    answersStore.answer[aiMessageIndex].loading = false
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
  const localHistory = localStorage.getItem('messageHistory')
  if (localHistory) answersStore.answer = JSON.parse(localHistory)
})
</script>

<style scoped>
.form {
  flex-direction: column;
}

.form-wrapper {
  margin: 0 auto;
  background-color: #404045;
  border: 1px solid #404045;
  border-radius: 20px;
  padding: 10px 20px;
  width: 100%;
  max-width: 800px;
}

.form-text {
  resize: none;
  outline: none;
  background-color: transparent;
  border: none;
  color: #fff;
  margin-bottom: 10px;
  white-space: pre-wrap;
}

:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
