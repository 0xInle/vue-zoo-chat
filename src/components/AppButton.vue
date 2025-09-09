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
  background-color: #71717a;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  background-color: #fff;
  color: #000;
}

.btn:focus {
  background-color: #fff;
  color: #000;
}
</style>
