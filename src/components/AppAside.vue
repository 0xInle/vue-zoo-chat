<template>
  <Transition name="aside">
    <aside v-if="isVisible" class="aside" ref="aside">
      <AppButton text="Новый чат" class="aside-btn" @click="addChat" />
      <ul class="aside-chat-list list-reset" ref="chatContainer">
        <li v-for="chatId in chatIds" :key="chatId" class="aside-chat-title">
          <button
            class="aside-chat-btn btn-reset"
            @click="answersStore.currentChatId = chatId"
          >
            <div class="aside-btn-text">
              {{ answersStore.answer[chatId][0]?.message || 'Новый чат' }}
            </div>
          </button>
        </li>
      </ul>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import AppButton from './AppButton.vue'
import { ref, defineProps, defineEmits, computed } from 'vue'
import { useAnswersStore } from '@/stores/AnswersStore'
import { onClickOutside, onKeyStroke } from '@vueuse/core'

const answersStore = useAnswersStore()
const chatIds = computed(() => Object.keys(answersStore.answer).reverse())
const emit = defineEmits()
const aside = ref<HTMLElement | null>(null)

function addChat() {
  answersStore.addChat()
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
  height: calc(100vh - 40px);
  background-color: var(--form-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  /* transform: translateX(-100%); */
  transition: all 0.3s ease-in-out;
}

/* .aside-visible {
  transform: translateX(0);
} */

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
}

.aside-chat-btn:hover {
  box-shadow: 0 0 10px rgba(var(--box-shadow-hover-color) / 0.5);
}

.aside-chat-btn:focus {
  box-shadow: 0 0 10px rgba(var(--box-shadow-hover-color) / 0.5);
}

.aside-chat-btn:active {
  box-shadow: 0 0 10px rgba(var(--box-shadow-hover-color) / 0.5);
}

.aside-btn-text {
  overflow: hidden;
  text-overflow: ellipsis;
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
</style>
