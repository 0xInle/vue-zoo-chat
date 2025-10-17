<template>
  <div class="app-toolbar">
    <button class="app-icon-btn btn-reset" @click="handleCopy">
      <IconCopy class="app-icon-copy" v-if="!copied" />
    </button>
    <IconCheck v-if="copied" style="margin-left: -10px; margin-right: 8px" />
    <button class="app-icon-btn btn-reset" @click="regenerateReplay()">
      <IconRegenerate
        :class="['app-icon-regenerate', { rotating: isRotating }]"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import IconCopy from '@/assets/icons/icon-copy.svg'
import IconCheck from '@/assets/icons/icon-check.svg'
import IconRegenerate from '@/assets/icons/icon-regenerate.svg'
import { useClipboard } from '@vueuse/core'
import { marked } from 'marked'
import { useStore } from '@/stores/store'
import { defineProps, ref } from 'vue'
import { regenerateMessage } from '@/stores/messageService'

const props = defineProps<{ text: string; messageId: string }>()
const { copy, copied } = useClipboard()
const store = useStore()
const isRotating = ref(false)

async function handleCopy() {
  const html = await marked.parse(props.text)
  const temp = document.createElement('div')
  temp.innerHTML = html
  const plainText = temp.textContent || temp.innerText || ''

  copy(plainText)
}

async function regenerateReplay() {
  isRotating.value = true
  await regenerateMessage(props.messageId, store)
  isRotating.value = false
}
</script>

<style scoped>
.app-toolbar {
  display: flex;
  max-height: 16px;
  margin-bottom: 20px;
}

.app-icon-btn {
  outline: none;
  color: var(--btn-color);
  transition: all 0.2s ease-in-out;
}

.app-icon-btn:not(:last-child) {
  margin-right: 10px;
}

.app-icon-btn {
  &:hover {
    color: var(--text-color);
    transform: scale(1.1);
  }

  &:focus {
    color: var(--text-color);
    transform: scale(1.1);
  }
}

.rotating {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
