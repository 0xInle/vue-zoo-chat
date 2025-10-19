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
        <div
          class="profile-dropdown"
          v-if="isOpen"
          @keydown.esc="isOpen = false"
          ref="target"
          tabindex="0"
        >
          <ul class="profile-list list-reset">
            <li class="profile-item">
              <button
                class="profile-btn-action btn-reset"
                @click="openModal('history')"
              >
                <IconDatabase class="profile-btn-icon" />
                Очистить историю
              </button>
            </li>
            <li class="profile-item">
              <button
                class="profile-btn-action btn-reset"
                @click="openModal('model')"
              >
                <IconSettings class="profile-btn-icon" />
                Выбрать модель
              </button>
            </li>
            <li class="profile-item">
              <button
                class="profile-btn-action btn-reset"
                @click="openModal('contacts')"
              >
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
      <button
        class="profile-btn profile-btn-theme btn-reset"
        @click="toggleTheme"
      >
        <IconSun class="profile-icon" v-if="theme" />
        <IconMoon class="profile-icon" v-else />
      </button>
    </div>
    <teleport to="body">
      <Transition
        name="fade"
        @after-enter="useModelModal.onEnter"
        @after-leave="useModelModal.onLeave"
      >
        <ModalModel
          v-if="modelModal"
          ref="modelModalRef"
          @closeModelModal="closeModal('model')"
          @keydown.esc="modelModal = false"
        />
      </Transition>
      <Transition
        name="fade"
        @after-enter="useHistoryModal.onEnter"
        @after-leave="useHistoryModal.onLeave"
      >
        <ModalClearHistory
          v-if="historyModal"
          ref="historyModalRef"
          :isOpenClearHistiry="historyModal"
          @closeModal="closeModal('history')"
          @keydown.esc="historyModal = false"
        />
      </Transition>
      <Transition
        name="fade"
        @after-enter="useContactsModal.onEnter"
        @after-leave="useContactsModal.onLeave"
      >
        <ModalContacts
          v-if="contactsModal"
          ref="contactsModalRef"
          @closeContactsModal="closeModal('contacts')"
          @keydown.esc="contactsModal = false"
        />
      </Transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import IconSun from '@/assets/icons/icon-sun.svg'
import IconMoon from '@/assets/icons/icon-moon.svg'
import IconDot from '@/assets/icons/icon-dot.svg'
import IconContact from '@/assets/icons/icon-contact.svg'
import IconDatabase from '@/assets/icons/icon-database.svg'
import IconLogout from '@/assets/icons/icon-logout.svg'
import IconSettings from '@/assets/icons/icon-settings.svg'
import ModalClearHistory from './ui/ModalClearHistory.vue'
import ModalContacts from './ui/ModalContacts.vue'
import ModalModel from './ui/ModalModel.vue'
import { ref, nextTick, inject, type Ref, Teleport } from 'vue'
import { onClickOutside, useColorMode } from '@vueuse/core'
import { auth } from '@/firebaseConfig'
import { useRouter } from 'vue-router'
import { useModalFocus } from '@/composables/useModalFocus'

const userName = inject('userName') as Ref<string | null>
const userAvatar = inject('userAvatar') as Ref<string | null>
const router = useRouter()
const historyModal = ref(false)
const contactsModal = ref(false)
const modelModal = ref(false)
const contactsModalRef = ref()
const historyModalRef = ref()
const modelModalRef = ref()
const useContactsModal = useModalFocus(contactsModalRef)
const useHistoryModal = useModalFocus(historyModalRef)
const useModelModal = useModalFocus(modelModalRef)

const modals = {
  history: historyModal,
  contacts: contactsModal,
  model: modelModal,
}
const theme = ref(true)
const mode = useColorMode()
const isOpen = ref(false)
const target = ref<HTMLElement | null>(null)

function openModal(type: keyof typeof modals) {
  modals[type].value = true
  isOpen.value = false
}

function closeModal(type: keyof typeof modals) {
  modals[type].value = false
}

function logoutUser() {
  auth.signOut()
  userName.value = null
  userAvatar.value = null
  router.push('/login')
}

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

function toggleTheme() {
  theme.value = !theme.value
  mode.value = theme.value ? 'dark' : 'light'
}
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
  color: var(--text-color);
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
  background-color: var(--form-color);
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
  box-shadow: 0 0 10px rgba(var(--box-shadow-color) / 0.3);
  border-radius: 10px;
  color: var(--text-color);
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  background-color: transparent;
}

.profile-btn-action:hover {
  color: var(--text-color);
  background-color: transparent;
  box-shadow: 0 0 10px rgba(var(--box-shadow-hover-color) / 0.5);
}

.profile-btn-action--red:hover {
  box-shadow: 0 0 10px rgba(240, 85, 85, 0.3);
}

.profile-btn-action:focus {
  color: var(--text-color);
  background-color: transparent;
  box-shadow: 0 0 10px rgba(var(--box-shadow-hover-color) / 0.5);
}

.profile-btn-action--red:focus {
  box-shadow: 0 0 10px rgba(240, 85, 85, 0.3);
}

.profile-btn-icon {
  margin-right: 10px;
}

.profile-controls {
  padding: 10px;
  background-color: var(--btn-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.profile-icon {
  color: var(--icon-color);
}

.profile-btn {
  outline: none;
  width: 16px;
  height: 16px;
  color: var(--text-color);
  transition: all 0.2s ease-in-out;
}

.profile-btn:not(:last-child) {
  margin-right: 20px;
}

.profile-btn-dot {
  transform: rotate(90deg);
}

.profile-btn:hover svg {
  color: var(--bg-page-color);
  transform: scale(1.1);
  transition: all 0.2s ease-in-out;
}

.profile-btn:focus svg {
  color: var(--bg-page-color);
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
  transition: all 0.2s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

@media (width <= 480px) {
  .profile-container {
    padding-right: 10px;
    padding-top: 10px;
  }

  .profile-avatar,
  .profile-name {
    display: none;
  }

  .profile-dropdown {
    min-width: 200px;
    margin: 10px 0;
    right: 10px;
  }
}
</style>
