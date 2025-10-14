<template>
  <div class="app-toolbar">
    <button class="app-icon-btn btn-reset" @click="handleCopy" tabindex="-1">
      <IconCopy class="app-icon-copy" v-if="!copied" />
    </button>
    <IconCheck v-if="copied" style="margin-left: -10px; margin-right: 8px" />
    <button
      class="app-icon-btn btn-reset"
      tabindex="-1"
      @click="regenerateReplay(text)"
    >
      <IconRegenerate />
    </button>
  </div>
</template>

<script setup lang="ts">
import IconCopy from '@/assets/icons/icon-copy.svg'
import IconCheck from '@/assets/icons/icon-check.svg'
import IconRegenerate from '@/assets/icons/icon-regenerate.svg'
import { defineProps } from 'vue'
import { useClipboard } from '@vueuse/core'
import { marked } from 'marked'

const props = defineProps<{ text: string }>()
const { copy, copied } = useClipboard()

async function handleCopy() {
  const html = await marked.parse(props.text)
  const temp = document.createElement('div')
  temp.innerHTML = html
  const plainText = temp.textContent || temp.innerText || ''

  copy(plainText)
}

function regenerateReplay(text: string) {
  console.log('Тут будет логика регенерации ответа.')
}
</script>

<style scoped>
.app-toolbar {
  display: flex;
  max-height: 16px;
  margin-bottom: 20px;
}

.app-icon-btn {
  color: var(--text-color);
}

.app-icon-btn:not(:last-child) {
  margin-right: 10px;
}
</style>
