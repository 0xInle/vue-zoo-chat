import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Answer {
  role: 'user' | 'ai'
  message?: string
  replay?: string | null
  loading?: boolean
}

export const useAnswersStore = defineStore('answersStore', () => {
  const answer = ref<Answer[]>([])
  return {
    answer,
  }
})
