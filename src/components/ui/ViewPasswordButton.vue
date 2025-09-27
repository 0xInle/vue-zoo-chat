<template>
  <button type="button" class="btn-eye btn-reset" @click="$emit('toggle')">
    <IconEyeClose class="icon icon-mr" v-if="showPassword" />
    <IconEyeOpen class="icon icon-mr" v-else />
  </button>
</template>

<script setup>
import IconEyeOpen from '../../assets/icons/icon-eye-open.svg'
import IconEyeClose from '../../assets/icons/icon-eye-Close.svg'
import { defineProps } from 'vue'

const props = defineProps({ showPassword: Boolean })
</script>

<style scoped>
.btn-eye {
  outline: none;
  width: 16px;
  height: 16px;
  transition: all 0.2s ease-in-out;
}

.btn-eye:hover .icon {
  transform: scale(1.1);
}

.btn-eye:focus .icon {
  transform: scale(1.1);
}

.icon {
  color: var(--text-color);
}
</style>
