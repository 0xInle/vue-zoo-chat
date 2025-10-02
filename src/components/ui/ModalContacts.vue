<template>
  <div class="modal-backdrop" @click="closeContactsModal">
    <div class="modal" @click.stop>
      <div class="modal-title">
        Напишите нам, если у вас есть вопросы или предложения.
      </div>
      <ul class="modal-list list-reset">
        <li>
          <a
            href="mailto:sergeybiryukovdev@gmail.com"
            target="_blank"
            class="modal-link link-reset"
          >
            <IconMail class="modal-icon" />
            Gmail
          </a>
        </li>
        <li>
          <a
            href="https://t.me/S_Biryukoff"
            target="_blank"
            class="modal-link link-reset"
          >
            <IconContact class="modal-icon" />
            Telegram
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconMail from '@/assets/icons/icon-mail.svg'
import IconContact from '@/assets/icons/icon-contact.svg'
import { defineEmits } from 'vue'

const emit = defineEmits(['closeContactsModal'])

function closeContactsModal() {
  emit('closeContactsModal')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 20px;
  border-radius: 10px;
  background-color: var(--bg-page-color);
}

.modal-title {
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--text-color);
}

.modal-list {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.modal-link {
  outline: none;
  display: flex;
  align-items: center;
  color: var(--contacts-text-color);
  font-size: 14px;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: var(--contacts-text-color-hover);
  }

  &:focus {
    color: var(--contacts-text-color-hover);
  }
}

.modal-icon {
  margin-right: 5px;
}
</style>
