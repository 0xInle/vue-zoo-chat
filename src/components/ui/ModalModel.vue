<template>
  <div class="modal-backdrop" @click="closeModelModal">
    <div class="modal" @click.stop>
      <div class="modal-title">Маберите модель</div>
      <div class="modal-btn-container">
        <AppButton
          class="modal-btn"
          @click="flipModel('deepSeek')"
          text="DeepSeek Chat v3.1"
        />
        <AppButton
          class="modal-btn"
          @click="flipModel('openAi')"
          text="OpenAI GPT-4o"
        />
        <AppButton
          class="modal-btn"
          @click="flipModel('nvidia')"
          text="NVIDIA Nemotron 9B"
        />
        <AppButton
          class="modal-btn"
          @click="flipModel('google')"
          text="Google Gemma 2B"
        />
        <AppButton
          class="modal-btn"
          @click="flipModel('longCat')"
          text="Meituan LongCat-Flash-Chat"
        />
        <AppButton
          class="modal-btn"
          @click="flipModel('glmAir')"
          text="Z.AI GLM-4.5-Air"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import AppButton from '../AppButton.vue'
import { useStore } from '@/stores/store'

const store = useStore()

const props = defineProps({
  isOpenModelModal: Boolean,
})

const emit = defineEmits(['closeModelModal'])

function closeModelModal() {
  emit('closeModelModal')
}

const modals = {
  deepSeek: 'deepseek/deepseek-chat-v3.1',
  openAi: 'openai/gpt-oss-20b',
  nvidia: 'nvidia/nemotron-nano-9b-v2',
  google: 'google/gemma-3n-e2b-it:free',
  longCat: 'meituan/longcat-flash-chat',
  glmAir: 'z-ai/glm-4.5-air',
}

function flipModel(type: keyof typeof modals) {
  store.model = modals[type]
  closeModelModal()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  width: 20%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 10px;
  background-color: var(--bg-page-color);
}

.modal-title {
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--text-color);
}

.modal-btn-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.modal-btn {
  width: 100%;
}
</style>
