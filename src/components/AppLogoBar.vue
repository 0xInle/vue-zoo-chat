<template>
  <header class="logo">
    <div class="logo-title">ZOO</div>
    <div class="logo-btn-bar">
      <button class="logo-btn btn-reset">
        <LogoSidebar class="logo-icon" @click="$emit('show-aside')" />
      </button>
      <button class="logo-btn btn-reset">
        <LogoNewChat class="logo-icon" @click="addChat" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import LogoSidebar from '../../public/logo-sidebar.svg'
import LogoNewChat from '../../public/logo-new-chat.svg'
import { useAnswersStore } from '@/stores/AnswersStore'

const answersStore = useAnswersStore()

function addChat() {
  answersStore.addChat()
}
</script>

<style scoped>
.logo {
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: max-content;
  padding-top: 20px;
  padding-left: 20px;
}

.logo-title {
  margin-right: 20px;
  font-size: 32px;
  font-weight: 900;
  color: #fff;
}

.logo-btn-bar {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #71717a;
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
  color: #fff;
  transition: all 0.2s ease-in-out;
}

.logo-btn:hover .logo-icon {
  color: #292a2d;
  transform: scale(1.1);
}

.logo-btn:focus .logo-icon {
  color: #292a2d;
  transform: scale(1.1);
}
</style>
