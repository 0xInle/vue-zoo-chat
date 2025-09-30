import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { LocalizedError } from '@/api/sendMessage'

export type Answer = {
  role: 'user' | 'ai'
  message?: string
  replay?: string | null
  error?: LocalizedError | null
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

  function clearHistory() {
    Object.keys(answer.value).forEach((key: string) => {
      delete answer.value[key]
    })
    currentChatId.value = null
    chatCounter.value = 0
    localStorage.removeItem('messageHistory')
  }

  return {
    answer,
    addChat,
    getLastChat,
    clearHistory,
    currentChatId,
    focusTextarea,
    chatCounter,
  }
})
