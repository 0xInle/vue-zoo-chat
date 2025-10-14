const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { auth, db } from '@/firebaseConfig'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { onAuthStateChanged, type User } from 'firebase/auth'

export type Chat = {
  id: string
  name: string
  createdAt: any
}

export type ChatMessage = {
  id: string
  text: string
  sender: 'user' | 'llm'
  timestamp: any
}

export type ApiMessage = {
  role: 'user' | 'assistant'
  content: string | null
}

export type ApiChoice = {
  finish_reason: string | null
  native_finish_reason: string | null
  message: ApiMessage
}

export type ApiError = {
  code: number
  message: string
  metadata?: Record<string, unknown>
}

export type ApiResponse = {
  id: string
  choices: ApiChoice[]
  created: number
  model: string
  object: 'chat.completion'
  error?: ApiError
}

export const useStore = defineStore('store', () => {
  const currentUser = ref<User | null>(null)
  const chats = ref<Chat[]>([])
  const activeChatId = ref<string | null>(null)
  const messages = ref<ChatMessage[]>([])
  const loadingMessages = ref(false)
  const localizedError = ref<string | null>(null)

  let unsubscribeFromChats: Unsubscribe | null = null
  let unsubscribeFromMessages: Unsubscribe | null = null
  let unsubscribeAuth: Unsubscribe | null = null

  const isAuthenticated = computed(() => currentUser.value !== null)
  const hasChats = computed(() => chats.value.length > 0)
  const activeChatMessages = computed(() => messages.value)

  async function sendMessageToAI(userMessage: string): Promise<string | null> {
    localizedError.value = null
    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-chat-v3.1',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: userMessage,
                  },
                ],
              },
            ],
          }),
        }
      )

      const data: ApiResponse = await response.json()

      if (!response.ok && data.error) {
        const code = data.error.code
        const message = data.error.message

        let msg = 'Произошла ошибка.'
        switch (code) {
          case 401:
            msg = 'Пользователь не найден (неверный API-ключ).'
            break
          case 402:
            msg = 'Недостаточно кредитов на аккаунте.'
            break
          case 403:
            msg = 'Доступ запрещён.'
            break
          case 429:
            msg = 'Слишком много запросов. Попробуйте позже.'
            break
          case 500:
          case 502:
          case 503:
            msg = 'Сервер временно недоступен. Повторите попытку позже.'
            break
          default:
            msg = `Ошибка ${code}: ${message}.`
        }

        localizedError.value = msg
        return null
      }

      const message = data.choices[0]?.message?.content

      return message
    } catch (error) {
      localizedError.value = 'Не удалось отправить сообщение. Попробуйте позже.'
      console.error(error)
      return null
    }
  }

  function listenForChats(userId: string) {
    stopListeningForChats()

    const chatsCollectionRef = collection(db, `users/${userId}/chats`)
    const q = query(chatsCollectionRef, orderBy('createdAt', 'desc'))

    unsubscribeFromChats = onSnapshot(
      q,
      (snapshot) => {
        const newChats: Chat[] = []
        snapshot.forEach((chatDoc) => {
          const data = chatDoc.data()
          newChats.push({
            id: chatDoc.id,
            name: data.name as string,
            createdAt: data.createdAt,
          })
        })
        chats.value = newChats

        if (
          !activeChatId.value ||
          !newChats.some((chat) => chat.id === activeChatId.value)
        ) {
          if (newChats.length > 0) {
            activeChatId.value = newChats[0].id
          } else {
            activeChatId.value = null
          }
        }
      },
      (error) => {
        console.error('Ошибка при прослушивании чатов:', error)
      }
    )
  }

  function stopListeningForChats() {
    if (unsubscribeFromChats) {
      unsubscribeFromChats()
      unsubscribeFromChats = null
    }
    stopListeningForMessages()
  }

  async function createChat(): Promise<string | null> {
    if (!currentUser.value) return null

    try {
      const chatsCollectionRef = collection(
        db,
        `users/${currentUser.value.uid}/chats`
      )
      const newChatRef = await addDoc(chatsCollectionRef, {
        name: 'Новый чат',
        createdAt: serverTimestamp(),
      })
      activeChatId.value = newChatRef.id
      return newChatRef.id
    } catch (error) {
      console.error('Ошибка при создании нового чата:', error)
      return null
    }
  }

  function setActiveChat(chatId: string | null) {
    if (activeChatId.value === chatId) return

    if (chatId && chats.value.some((chat) => chat.id === chatId)) {
      activeChatId.value = chatId
    } else {
      activeChatId.value = null
    }
  }

  function stopListeningForMessages() {
    if (unsubscribeFromMessages) {
      unsubscribeFromMessages()
      unsubscribeFromMessages = null
    }
  }

  function listenForMessages(userId: string, chatId: string) {
    loadingMessages.value = true

    stopListeningForMessages()

    const messagesCollectionRef = collection(
      db,
      `users/${userId}/chats/${chatId}/messages`
    )
    const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'))

    unsubscribeFromMessages = onSnapshot(
      q,
      (snapshot) => {
        const newMessages: ChatMessage[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          newMessages.push({
            id: doc.id,
            text: String(data.text ?? ''),
            sender: data.sender === 'llm' ? 'llm' : 'user',
            timestamp: data.timestamp,
          })
        })
        messages.value = newMessages
        loadingMessages.value = false
      },
      (error) => {
        console.error('Ошибка при прослушивании сообщений:', error)
        loadingMessages.value = false
      }
    )
  }

  async function addChatMessage(text: string, sender: 'user' | 'llm') {
    if (!currentUser.value || !activeChatId.value) {
      console.error(
        'Невозможно отправить сообщение: пользователь не авторизован или не выбран активный чат.'
      )
      return
    }

    try {
      const messagesCollectionRef = collection(
        db,
        `users/${currentUser.value.uid}/chats/${activeChatId.value}/messages`
      )
      await addDoc(messagesCollectionRef, {
        text,
        sender,
        timestamp: serverTimestamp(),
      })

      const chatIndex = chats.value.findIndex(
        (c) => c.id === activeChatId.value
      )
      if (
        chatIndex !== -1 &&
        chats.value[chatIndex].name === 'Новый чат' &&
        sender === 'user'
      ) {
        const newName = text.trim() || 'Новый чат'

        const shortName =
          newName.length > 30 ? newName.slice(0, 30).trim() + '…' : newName

        chats.value[chatIndex].name = shortName

        const chatDocRef = doc(
          db,
          `users/${currentUser.value.uid}/chats`,
          activeChatId.value
        )
        await updateDoc(chatDocRef, { name: newName })
      }
    } catch (error) {
      console.error('Ошибка при добавлении сообщения в Firestore:', error)
    }
  }

  async function deleteChatById(chatId: string) {
    if (!currentUser.value) {
      console.error('Не авторизованный пользователь не может удалять чаты.')
      return
    }

    try {
      const messagesRef = collection(
        db,
        `users/${currentUser.value.uid}/chats/${chatId}/messages`
      )
      const messagesSnapshot = await getDocs(messagesRef)
      const deleteMessages = messagesSnapshot.docs.map((msgDoc) =>
        deleteDoc(msgDoc.ref)
      )
      await Promise.all(deleteMessages)

      const chatDocRef = doc(db, `users/${currentUser.value.uid}/chats`, chatId)
      await deleteDoc(chatDocRef)
    } catch (error) {
      console.error('Ошибка при удалении чата:', error)
    }
  }

  async function deleteAllChats() {
    if (!currentUser.value) return

    try {
      const chatsRef = collection(db, `users/${currentUser.value.uid}/chats`)
      const chatsSnapshot = await getDocs(chatsRef)

      const deletePromises = chatsSnapshot.docs.map((chatDoc) =>
        deleteChatById(chatDoc.id)
      )
      await Promise.all(deletePromises)

      activeChatId.value = null
    } catch (error) {
      console.error('Ошибка при удалении всех чатов:', error)
    }
  }

  async function removeEmptyChats(userId: string) {
    try {
      const chatsRef = collection(db, `users/${userId}/chats`)
      const chatsSnapshot = await getDocs(chatsRef)

      const deletePromises = chatsSnapshot.docs.map(async (chatDoc) => {
        const messagesRef = collection(
          db,
          `users/${userId}/chats/${chatDoc.id}/messages`
        )
        const msgSnap = await getDocs(messagesRef)
        if (msgSnap.empty) {
          await deleteDoc(doc(db, `users/${userId}/chats`, chatDoc.id))
        }
      })

      await Promise.all(deletePromises)
    } catch (error) {
      console.error('Ошибка при удалении пустых чатов:', error)
    }
  }

  function initAuthStateListener() {
    if (unsubscribeAuth) return Promise.resolve()

    return new Promise<void>((resolve) => {
      unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        currentUser.value = user

        if (user) {
          await removeEmptyChats(user.uid)
          listenForChats(user.uid)

          const stopWatch = watch(chats, () => {
            resolve()
            stopWatch()
          })
        } else {
          stopListeningForChats()
          resolve()
        }
      })
    })
  }

  function cleanupAllListeners() {
    if (unsubscribeAuth) {
      unsubscribeAuth()
      unsubscribeAuth = null
    }
    stopListeningForChats()
  }

  watch(
    activeChatId,
    (newChatId) => {
      if (currentUser.value && newChatId) {
        listenForMessages(currentUser.value.uid, newChatId)
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
    sendMessageToAI,
    addChatMessage,
    createChat,
    initAuthStateListener,
    cleanupAllListeners,
    setActiveChat,
    deleteAllChats,
  }
})
