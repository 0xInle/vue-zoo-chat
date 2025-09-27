<template>
  <button class="btn btn-reset">{{ text }}</button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const { text } = defineProps<{ text: string }>()
</script>

<style scoped>
.btn {
  outline: none;
  align-self: flex-end;
  padding: 10px;
  background-color: var(--btn-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  color: var(--text-color);
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  background-color: var(--text-color);
  color: var(--dark-color);
}

.btn:focus {
  background-color: var(--text-color);
  color: var(--dark-color);
}
</style>
