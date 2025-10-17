import { db } from '@/firebaseConfig'
import {
  serverTimestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { useStore, type Chat, type ChatMessage } from '@/stores/store'
import { sendMessageToAI } from '@/services/messageToAi'

export async function addChatMessage(
  text: string,
  sender: 'user' | 'llm',
  store: ReturnType<typeof useStore>
) {
  if (!store.currentUser || !store.activeChatId) {
    console.error(
      'Невозможно отправить сообщение: пользователь не авторизован или не выбран активный чат.'
    )
    return
  }

  try {
    const messagesCollectionRef = collection(
      db,
      `users/${store.currentUser.uid}/chats/${store.activeChatId}/messages`
    )
    await addDoc(messagesCollectionRef, {
      text,
      sender,
      timestamp: serverTimestamp(),
    })

    const chatIndex = store.chats.findIndex(
      (c: Chat) => c.id === store.activeChatId
    )
    if (
      chatIndex !== -1 &&
      store.chats[chatIndex].name === 'Новый чат' &&
      sender === 'user'
    ) {
      const newName = text.trim() || 'Новый чат'

      const shortName =
        newName.length > 30 ? newName.slice(0, 30).trim() + '…' : newName

      store.chats[chatIndex].name = shortName

      const chatDocRef = doc(
        db,
        `users/${store.currentUser.uid}/chats`,
        store.activeChatId
      )
      await updateDoc(chatDocRef, { name: newName })
    }
  } catch (error) {
    console.error('Ошибка при добавлении сообщения в Firestore:', error)
  }
}

export async function regenerateMessage(
  messageId: string,
  store: ReturnType<typeof useStore>
) {
  if (!store.currentUser || !store.activeChatId) return null

  const msg = store.messages.find((m: ChatMessage) => m.id === messageId)
  if (!msg) return null

  const newText = await sendMessageToAI(
    `Перегинерируй этот ${msg.text}. Отдай только 1 вариант ответа без коментариев, просто новый перегинерированый ответ.`,
    store
  )
  if (!newText) return null

  msg.text = newText

  const docRef = doc(
    db,
    `users/${store.currentUser.uid}/chats/${store.activeChatId}/messages`,
    msg.id
  )
  await updateDoc(docRef, { text: newText })

  return newText
}
