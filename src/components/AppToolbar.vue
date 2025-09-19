<template>
  <div class="app-toolbar">
    <button
      class="app-icon-btn btn-reset"
      @click="copyToClipboard(text)"
      tabindex="-1"
    >
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
import { ref, defineProps } from 'vue'

const props = defineProps<{ text: string }>()

const copied = ref(false)

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 1000)
  })
}

function regenerateReplay(text: string) {
  console.log('Тут будет логика регенерации ответа.')
}
</script>

<style scoped>
.app-toolbar {
  display: flex;
  max-height: 16px;
}

.app-icon-btn {
  color: #fff;
}

.app-icon-btn:not(:last-child) {
  margin-right: 10px;
}
</style>
