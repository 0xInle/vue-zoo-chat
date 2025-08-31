import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnswersStore = defineStore('answersStore', () => {
  const answer = ref([])
  return {
    answer,
  }
})
