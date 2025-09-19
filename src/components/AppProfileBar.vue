<template>
  <div class="profile-container">
    <div class="profile-user">
      <div class="profile-avatar" v-if="userAvatar">
        <img :src="userAvatar" alt="Avatar" referrerpolicy="no-referrer" />
      </div>
      <div class="profile-name flex">
        {{ userName }}
      </div>
      <Transition name="dropdown">
        <div class="profile-dropdown" v-if="isOpen" ref="target" tabindex="0">
          <ul class="profile-list list-reset">
            <li class="profile-item">
              <button class="profile-btn-action btn-reset">
                <IconDatabase class="profile-btn-icon" />
                Очистить историю
              </button>
            </li>
            <li class="profile-item">
              <button class="profile-btn-action btn-reset">
                <IconContact class="profile-btn-icon" />
                Контакты
              </button>
            </li>
            <li class="profile-item">
              <button
                class="profile-btn-action profile-btn-action--red btn-reset"
                @click="logoutUser"
              >
                <IconLogout class="profile-btn-icon" />
                Выход
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
    <div class="profile-controls flex">
      <button
        class="profile-btn profile-btn-dot btn-reset"
        @click="toggleDropdown"
        @keydown.enter.prevent="toggleDropdown"
      >
        <IconDot class="profile-icon profile-icon-dot" />
      </button>
      <button class="profile-btn profile-btn-theme btn-reset">
        <IconSun class="profile-icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconSun from '@/assets/icons/icon-sun.svg'
import IconMoon from '@/assets/icons/icon-moon.svg'
import IconDot from '@/assets/icons/icon-dot.svg'
import IconContact from '@/assets/icons/icon-contact.svg'
import IconDatabase from '@/assets/icons/icon-database.svg'
import IconLogout from '@/assets/icons/icon-logout.svg'
import {
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  inject,
  type Ref,
} from 'vue'
import { onClickOutside } from '@vueuse/core'
import { auth } from '@/firebaseConfig'
import { useRouter } from 'vue-router'

const userName = inject('userName') as Ref<string | null>
const userAvatar = inject('userAvatar') as Ref<string | null>
const router = useRouter()

function logoutUser() {
  auth.signOut()
  userName.value = null
  userAvatar.value = null
  router.push('/login')
}

const isOpen = ref(false)
const target = ref<HTMLElement | null>(null)

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

function handleEscape(event: KeyboardEvent) {
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
  position: absolute;
  top: 0;
  right: 0;
  padding-top: 20px;
  padding-right: 20px;
}

.profile-user {
  display: flex;
  align-items: center;
  margin-right: 10px;
  border-radius: 10px;
  font-size: 14px;
  color: #fff;
  line-height: 1;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  margin-right: 10px;
  border-radius: 25px;
}

.profile-avatar img {
  border-radius: 25px;
}

.profile-name {
  padding: 10px;
}

.profile-dropdown {
  outline: none;
  position: absolute;
  top: 46px;
  right: 20px;
  width: 100%;
  max-width: 200px;
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  box-shadow: 0 0 10px rgba(240, 85, 85, 0.3);
}

.profile-btn-action:focus {
  color: #fff;
  background-color: transparent;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.profile-btn-action--red:focus {
  box-shadow: 0 0 10px rgba(240, 85, 85, 0.3);
}

.profile-btn-icon {
  margin-right: 10px;
}

.profile-controls {
  padding: 10px;
  background-color: #71717a;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.profile-btn {
  outline: none;
  width: 16px;
  height: 16px;
  color: #fff;
  transition: all 0.2s ease-in-out;
}

.profile-btn:not(:last-child) {
  margin-right: 20px;
}

.profile-btn-dot {
  transform: rotate(90deg);
}

.profile-btn:hover svg {
  color: #292a2d;
  transform: scale(1.1);
  transition: all 0.2s ease-in-out;
}

.profile-btn:focus svg {
  color: #292a2d;
  transform: scale(1.1);
  transition: all 0.2s ease-in-out;
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
