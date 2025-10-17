import { db } from '@/firebaseConfig'
import {
  serverTimestamp,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { useStore, type Chat } from '@/stores/store'

export async function createChat(
  store: ReturnType<typeof useStore>
): Promise<string | null> {
  if (!store.currentUser) return null

  try {
    const chatsCollectionRef = collection(
      db,
      `users/${store.currentUser.uid}/chats`
    )
    const newChatRef = await addDoc(chatsCollectionRef, {
      name: 'Новый чат',
      createdAt: serverTimestamp(),
    })
    store.activeChatId = newChatRef.id
    return newChatRef.id
  } catch (error) {
    console.error('Ошибка при создании нового чата:', error)
    return null
  }
}

export async function deleteChatById(
  chatId: string,
  store: ReturnType<typeof useStore>
) {
  if (!store.currentUser) {
    console.error('Не авторизованный пользователь не может удалять чаты.')
    return
  }

  try {
    const messagesRef = collection(
      db,
      `users/${store.currentUser.uid}/chats/${chatId}/messages`
    )
    const messagesSnapshot = await getDocs(messagesRef)
    const deleteMessages = messagesSnapshot.docs.map((msgDoc) =>
      deleteDoc(msgDoc.ref)
    )
    await Promise.all(deleteMessages)

    const chatDocRef = doc(db, `users/${store.currentUser.uid}/chats`, chatId)
    await deleteDoc(chatDocRef)
  } catch (error) {
    console.error('Ошибка при удалении чата:', error)
  }
}

export async function deleteAllChats(store: ReturnType<typeof useStore>) {
  if (!store.currentUser) return

  try {
    const chatsRef = collection(db, `users/${store.currentUser.uid}/chats`)
    const chatsSnapshot = await getDocs(chatsRef)

    const deletePromises = chatsSnapshot.docs.map((chatDoc) =>
      deleteChatById(chatDoc.id, store)
    )
    await Promise.all(deletePromises)

    store.activeChatId = null
  } catch (error) {
    console.error('Ошибка при удалении всех чатов:', error)
  }
}

export async function removeEmptyChats(userId: string) {
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

export function setActiveChat(
  chatId: string | null,
  store: ReturnType<typeof useStore>
) {
  if (store.activeChatId === chatId) return

  if (chatId && store.chats.some((chat: Chat) => chat.id === chatId)) {
    store.activeChatId = chatId
  } else {
    store.activeChatId = null
  }
}
