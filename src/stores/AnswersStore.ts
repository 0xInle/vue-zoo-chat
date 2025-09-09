import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export type Answer = {
  role: 'user' | 'ai'
  message?: string
  replay?: string | null
  loading?: boolean
}

export const useAnswersStore = defineStore('answersStore', () => {
  const answer = ref<Answer[][]>([])
  const currentChatIndex: Ref<number | null> = ref(null)
  const focusTextarea: Ref<boolean> = ref(false)

  function addChat() {
    answer.value.unshift([])
    currentChatIndex.value = 0
    focusTextarea.value = true
  }

  function getLastChat() {
    return answer.value.at(-1)
  }
  return {
    answer,
    addChat,
    getLastChat,
    currentChatIndex,
    focusTextarea,
  }
})
