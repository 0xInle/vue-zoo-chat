<template>
  <div class="profile-container">
    <div class="profile-controls flex">
      <div class="profile-avatar">СБ</div>
      <Transition name="dropdown">
        <div class="profile-dropdown" v-if="isOpen" ref="target" tabindex="0">
          <ul class="profile-list list-reset">
            <li class="profile-item">
              <AppButton class="profile-btn-action" text="Очистить историю" />
            </li>
            <li class="profile-item">
              <AppButton class="profile-btn-action" text="Контакты" />
            </li>
            <li class="profile-item">
              <AppButton
                class="profile-btn-action profile-btn-action--red"
                text="Выход"
              />
            </li>
          </ul>
        </div>
      </Transition>
      <div
        class="profile-name flex"
        @click="toggleDropdown"
        tabindex="0"
        @keydown.enter.prevent="toggleDropdown"
      >
        Сергей Бирюков
        <IconDot class="profile-icon profile-icon-dot" />
      </div>
      <button class="profile-btn profile-btn-theme btn-reset">
        <IconSun class="profile-icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import IconSun from '@/assets/icons/icon-sun.svg'
import IconMoon from '@/assets/icons/icon-moon.svg'
import IconDot from '@/assets/icons/icon-dot.svg'
import AppButton from '@/components/AppButton.vue'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

import { onClickOutside } from '@vueuse/core'

const isOpen = ref(false)
const target = ref(null)

function toggleDropdown() {
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    nextTick(() => {
      if (target.value) target.value.focus()
    })
  }
}

onClickOutside(target, () => {
  isOpen.value = false
})

function handleEscape(event) {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  top: 0;
  right: 0;
  padding-top: 20px;
  padding-right: 20px;
}

.profile-controls {
  display: flex;
  align-items: center;
  color: #fff;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  margin-right: 10px;
  background-color: #71717a;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 25px;
  font-size: 14px;
  text-align: center;
  line-height: 36px;
}

.profile-name {
  outline: none;
  align-items: center;
  margin-right: 10px;
  padding: 10px;
  font-size: 14px;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.profile-name:hover {
  background-color: #71717a;
}

.profile-name:focus {
  background-color: #71717a;
}

.profile-btn {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #71717a;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.profile-icon {
  color: #fff;
}

.profile-icon-dot {
  margin-left: 10px;
  transform: rotate(90deg);
}

.profile-btn-theme {
  outline: none;
  transition: all 0.2s ease-in-out;
}

.profile-btn-theme:hover svg {
  transition: all 0.2s ease-in-out;
  color: #000;
  transform: scale(1.1);
}

.profile-btn-theme:focus svg {
  transition: all 0.2s ease-in-out;
  color: #000;
  transform: scale(1.1);
}

.profile-dropdown {
  outline: none;
  position: absolute;
  top: 46px;
  right: 20px;
  width: 100%;
  max-width: 192px;
  padding: 10px;
  margin: 20px 0;
  background-color: #404045;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.profile-item:not(:last-child) {
  margin-bottom: 20px;
}

.profile-btn-action {
  outline: none;
  width: 100%;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  background-color: transparent;
}

.profile-btn-action:hover {
  color: #fff;
  background-color: transparent;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.profile-btn-action--red:hover {
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}

.profile-btn-action:focus {
  color: #fff;
  background-color: transparent;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.profile-btn-action--red:focus {
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
</style>
