<template>
  <div v-if="isOpenClearHistiry" class="modal-backdrop">
    <div class="modal">
      <div class="modal-title">Вы уверены, что хотите удалить всю историю?</div>
      <div class="modal-subtitle">
        Данные будут удалены без возможности восстановления.
      </div>
      <div class="modal-btn-container">
        <AppButton class="modal-btn" text="Да" @click="clearHistory" />
        <AppButton class="modal-btn" text="Нет" @click="closeModal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from '../AppButton.vue'
import { defineEmits, defineProps } from 'vue'
import { useAnswersStore } from '@/stores/AnswersStore'

const store = useAnswersStore()

const props = defineProps({
  isOpenClearHistiry: Boolean,
})

const emit = defineEmits(['closeModal'])

function clearHistory() {
  store.clearHistory()
  emit('closeModal')
}

function closeModal() {
  emit('closeModal')
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

.modal-subtitle {
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--text-color);
}

.modal-btn-container {
  display: flex;
  width: 100%;
  gap: 20px;
}

.modal-btn {
  width: 100%;
}
</style>
