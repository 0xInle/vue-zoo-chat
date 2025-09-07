<template>
  <button class="btn btn-reset">{{ text }}</button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const { text } = defineProps<{ text: string }>()
</script>

<style scoped>
.btn {
  align-self: flex-end;
  padding: 10px;
  background-color: #71717a;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
}
</style>
