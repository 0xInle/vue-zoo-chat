import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { type User } from 'firebase/auth'

import {
  stopListeningForMessages,
  listenForMessages,
} from '@/stores/chatListeners'

export type Chat = {
  id: string
  name: string
  createdAt: string
}

export type ChatMessage = {
  id: string
  text: string
  sender: 'user' | 'llm'
  timestamp: string
}

export const useStore = defineStore('store', () => {
  const currentUser = ref<User | null>(null)
  const chats = ref<Chat[]>([])
  const activeChatId = ref<string | null>(null)
  const messages = ref<ChatMessage[]>([])
  const loadingMessages = ref(false)
  const localizedError = ref<string | null>(null)

  const isAuthenticated = computed(() => currentUser.value !== null)
  const hasChats = computed(() => chats.value.length > 0)
  const activeChatMessages = computed(() => messages.value)

  watch(
    activeChatId,
    (newChatId) => {
      if (currentUser.value && newChatId) {
        listenForMessages(
          currentUser.value.uid,
          newChatId,
          messages,
          loadingMessages
        )
      } else {
        stopListeningForMessages()
      }
    },
    { immediate: true }
  )

  return {
    currentUser,
    chats,
    activeChatId,
    messages,
    isAuthenticated,
    hasChats,
    activeChatMessages,
    loadingMessages,
    localizedError,
  }
})
