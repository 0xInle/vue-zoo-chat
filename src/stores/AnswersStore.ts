import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export type Answer = {
  role: 'user' | 'ai'
  message?: string
  replay?: string | null
  loading?: boolean
}

export const useAnswersStore = defineStore('answersStore', () => {
  const answer = ref<Record<string, Answer[]>>({})
  const currentChatId: Ref<string | null> = ref(null)
  const focusTextarea: Ref<boolean> = ref(false)
  const chatCounter = ref(0)

  function addChat() {
    chatCounter.value++
    const id = `Chat${chatCounter.value}`
    answer.value[id] = []
    currentChatId.value = id
    focusTextarea.value = true
    return id
  }

  function getLastChat() {
    const keys = Object.keys(answer.value)
    return keys.length ? answer.value[keys[keys.length - 1]] : null
  }

  return {
    answer,
    addChat,
    getLastChat,
    currentChatId,
    focusTextarea,
    chatCounter,
  }
})
