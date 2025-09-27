<template>
  <header class="logo">
    <div class="logo-title">
      <img src="../../public/logo.png" alt="Логотип" />
    </div>
    <div class="logo-btn-bar">
      <button
        class="logo-btn btn-reset"
        @click="$emit('show-aside')"
        @keydown.enter.prevent="$emit('show-aside')"
      >
        <IconSidebar class="logo-icon" />
      </button>
      <button
        class="logo-btn btn-reset"
        @click="addChat"
        @keydown.enter.prevent="addChat"
      >
        <IconNewChat class="logo-icon" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import IconSidebar from '@/assets/icons/icon-sidebar.svg'
import IconNewChat from '@/assets/icons/icon-new-chat.svg'
import { useAnswersStore } from '@/stores/AnswersStore'

const answersStore = useAnswersStore()

function addChat() {
  answersStore.addChat()
}
</script>

<style scoped>
.logo {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: max-content;
  padding-top: 20px;
  padding-left: 20px;
}

.logo-title {
  width: 48px;
  margin-right: 20px;
}

.logo-title img {
  display: block;
}

.logo-btn-bar {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: var(--btn-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.logo-btn {
  width: 16px;
  height: 16px;
  outline: none;
  transition: all 0.2s ease-in-out;
}

.logo-btn:not(:last-child) {
  margin-right: 20px;
}

.logo-icon {
  color: var(--text-color);
  transition: all 0.2s ease-in-out;
}

.logo-btn:hover .logo-icon {
  color: var(--bg-page-color);
  transform: scale(1.1);
}

.logo-btn:focus .logo-icon {
  color: var(--bg-page-color);
  transform: scale(1.1);
}
</style>
