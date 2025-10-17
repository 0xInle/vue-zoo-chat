import { useStore } from '@/stores/store'
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { type Unsubscribe } from 'firebase/firestore'
import { removeEmptyChats } from './chatService'
import { listenForChats, stopListeningForChats } from '@/stores/chatListeners'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'

let unsubscribeAuth: Unsubscribe | null = null

export function initAuthStateListener(store: ReturnType<typeof useStore>) {
  if (unsubscribeAuth) return Promise.resolve()

  return new Promise<void>((resolve) => {
    unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      store.currentUser = user

      const { chats, activeChatId } = storeToRefs(store)

      if (user) {
        await removeEmptyChats(user.uid)
        listenForChats(user.uid, chats, activeChatId)

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

export function cleanupAllListeners() {
  if (unsubscribeAuth) {
    unsubscribeAuth()
    unsubscribeAuth = null
  }
  stopListeningForChats()
}
