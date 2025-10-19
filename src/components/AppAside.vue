<template>
  <Transition name="aside">
    <aside v-if="isVisible" class="aside" ref="aside">
      <AppButton class="aside-newchat-btn" text="Новый чат" @click="addChat" />
      <ul class="aside-chat-list list-reset" ref="chatContainer">
        <li class="aside-chat-title" v-for="chat in chats" :key="chat.id">
          <button class="aside-chat-btn btn-reset" @click="selectChat(chat.id)">
            {{ chat.name }}
          </button>
        </li>
      </ul>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import AppButton from './AppButton.vue'
import { ref, defineProps, defineEmits, computed } from 'vue'
import { useStore } from '@/stores/store'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { createChat } from '@/stores/chatService'
import { setActiveChat } from '@/stores/chatService'

const store = useStore()
const emit = defineEmits()
const aside = ref<HTMLElement | null>(null)
const chats = computed(() => store.chats)

function selectChat(activeChatId: string) {
  setActiveChat(activeChatId, store)
}

function addChat() {
  createChat(store)
}

const props = defineProps({
  isVisible: Boolean,
})

onClickOutside(aside, () => emit('update:isVisible', false))

onKeyStroke('Escape', () => {
  if (props.isVisible) emit('update:isVisible', false)
})
</script>

<style scoped>
.aside {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  width: 15%;
  min-width: 200px;
  height: calc(100vh - 40px);
  padding: 10px;
  background-color: var(--form-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  transition: all 0.3s ease-in-out;
}

.aside-btn {
  width: 100%;
  max-width: 196px;
  margin: 10px 10px 10px 0;
}

.aside-chat-list {
  overflow-y: auto;
  flex: 1;
  padding: 10px;
  margin-bottom: 20px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.aside-chat-list::-webkit-scrollbar {
  display: none;
}

.aside-chat-title {
  white-space: nowrap;
}

.aside-chat-title:not(:last-child) {
  margin-bottom: 20px;
}

.aside-newchat-btn {
  outline: none;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  text-align: left;
  box-shadow: 0 0 10px rgba(var(--box-shadow-color) / 0.3);
  border-radius: 10px;
  color: var(--text-color);
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  text-align: center;
}

.aside-chat-btn {
  outline: none;
  width: 100%;
  padding: 10px;
  text-align: left;
  box-shadow: 0 0 10px rgba(var(--box-shadow-color) / 0.3);
  border-radius: 10px;
  color: var(--text-color);
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    box-shadow: 0 0 10px rgba(var(--box-shadow-hover-color) / 0.5);
  }

  &:focus {
    box-shadow: 0 0 10px rgba(var(--box-shadow-hover-color) / 0.5);
  }

  &:active {
    box-shadow: 0 0 10px rgba(var(--box-shadow-hover-color) / 0.5);
  }
}

.aside-enter-from,
.aside-leave-to {
  transform: translateX(-100%);
}
.aside-enter-to,
.aside-leave-from {
  transform: translateX(0);
}

.aside-enter-active,
.aside-leave-active {
  transition: all 0.2s ease-in-out;
}

@media (width <= 1420px) {
  .aside {
    z-index: 1;
  }
}

@media (width <= 480px) {
  .aside {
    height: calc(100vh - 20px);
  }
}
</style>
