import {
  collection,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import { type Chat, type ChatMessage } from '@/stores/store'
import { type Ref } from 'vue'

let unsubscribeFromChats: Unsubscribe | null = null
let unsubscribeFromMessages: Unsubscribe | null = null

export function listenForChats(
  userId: string,
  chats: Ref<Chat[]>,
  activeChatId: Ref<string | null>
) {
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

export function listenForMessages(
  userId: string,
  chatId: string,
  messages: Ref<ChatMessage[]>,
  loadingMessages: Ref<boolean>
) {
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

export function stopListeningForChats() {
  if (unsubscribeFromChats) {
    unsubscribeFromChats()
    unsubscribeFromChats = null
  }
  stopListeningForMessages()
}

export function stopListeningForMessages() {
  if (unsubscribeFromMessages) {
    unsubscribeFromMessages()
    unsubscribeFromMessages = null
  }
}
