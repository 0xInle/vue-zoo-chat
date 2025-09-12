<template>
  <aside
    class="aside"
    :class="{ 'aside-visible': isVisible }"
    ref="aside"
    :inert="!isVisible"
  >
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
</template>

<script setup lang="ts">
import AppButton from './AppButton.vue'
import {
  ref,
  watch,
  defineProps,
  defineEmits,
  onMounted,
  onBeforeUnmount,
  computed,
} from 'vue'
import { useAnswersStore } from '@/stores/AnswersStore'

const answersStore = useAnswersStore()
const chatIds = computed(() => Object.keys(answersStore.answer).reverse())

function addChat() {
  answersStore.addChat()
}

const props = defineProps({
  isVisible: Boolean,
})

const emit = defineEmits()
const aside = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (aside.value && !aside.value.contains(event.target as Node)) {
    emit('update:isVisible', false)
  }
}

watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }
)

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isVisible) {
    emit('update:isVisible', false)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.aside {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 15%;
  height: calc(100vh - 40px);
  padding: 10px;
  margin: 20px 0;
  background-color: #404045;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  transform: translateX(-100%);
  transition: all 0.3s ease-in-out;
}

.aside-visible {
  transform: translateX(0);
}

.aside-btn {
  width: 100%;
  margin-bottom: 20px;
}

.aside-chat-list {
  overflow-y: auto;
  flex: 1;
  padding: 3px;
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}

.aside-chat-btn:hover {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.aside-chat-btn:focus {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.aside-chat-btn:active {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.aside-btn-text {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
