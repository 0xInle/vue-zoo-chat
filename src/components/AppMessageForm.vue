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
        <AppButton text="Отправить" @click="addMessage" />
      </form>
    </div>
  </div>
</template>

<script setup>
import AppButton from '@/components/AppButton.vue'
import { useAnswersStore } from '@/stores/AnswersStore'
import { sendMessageToAI } from '@/api/sendMessage'
import { onMounted, nextTick, ref } from 'vue'

const message = defineModel()
const answersStore = useAnswersStore()
const textarea = ref(null)

function addMessage() {
  answersStore.answer.push({ role: 'user', message: message.value })
  localStorage.setItem('messageHistory', JSON.stringify(answersStore.answer))

  const aiMessageIndex = answersStore.answer.length
  answersStore.answer.push({ role: 'ai', replay: '', loading: true })
  localStorage.setItem('messageHistory', JSON.stringify(answersStore.answer))

  sendMessageToAI(message.value).then((replay) => {
    answersStore.answer[aiMessageIndex].replay = replay
    answersStore.answer[aiMessageIndex].loading = false
    localStorage.setItem('messageHistory', JSON.stringify(answersStore.answer))
  })

  message.value = ''
}

function handleEnter(event) {
  if (event.shiftKey) {
    message.value += '\n'
    nextTick(() => {
      textarea.value.scrollTop = textarea.value.scrollHeight
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
</style>
