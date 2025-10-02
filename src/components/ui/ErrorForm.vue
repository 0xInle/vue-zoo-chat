<template>
  <transition name="error-popup">
    <div v-if="text">{{ text }}</div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{ text?: string }>()
</script>

<style scoped>
div {
  position: absolute;
  max-width: 40%;
  top: 30px;
  padding: 20px;
  border: 1px solid var(--error-color);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(240, 85, 85, 0.3);
  color: var(--text-color);
  font-size: 14px;
  font-weight: 300;
}

.error-popup-enter-from {
  opacity: 0;
}
.error-popup-enter-active {
  transition: all 0.2s ease-in-out;
}
.error-popup-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.error-popup-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.error-popup-leave-active {
  transition: all 0.2s ease-in-out;
}
.error-popup-leave-to {
  opacity: 0;
}
</style>
