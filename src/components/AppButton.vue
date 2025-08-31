<template>
  <button class="btn btn-reset">{{ text }}</button>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
})
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
