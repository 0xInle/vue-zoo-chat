<template>
  <div class="forgot-container">
    <LogoHeader />
    <div class="forgot-reset-content">
      <h3 class="forgot-title">Сбросить пароль</h3>
      <div class="forgot-subtitle">
        Введите свой адрес электронной почты, для восстановления входа в
        систему.
      </div>
    </div>
    <form class="forgot-form" @submit.prevent="resetPassword">
      <div class="forgot-input-container">
        <IconMail class="forgot-input-icon" />
        <input
          class="forgot-input"
          name="email"
          type="email"
          placeholder="Введите email"
          v-model="email"
        />
      </div>
      <AppButton text="Продолжить" class="forgot-btn-continue" type="submit" />
    </form>
    <router-link to="/login" class="forgot-back-link link-reset"
      >Вернуться к входу</router-link
    >
    <router-link to="/reset" class="forgot-back-link link-reset"
      >Сбросить</router-link
    >
  </div>
</template>

<script setup>
import IconMail from '../assets/icons/icon-mail.svg'
import AppButton from '@/components/AppButton.vue'
import LogoHeader from '@/components/ui/LogoHeader.vue'
import { ref } from 'vue'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebaseConfig'

const email = ref('')

async function resetPassword() {
  try {
    await sendPasswordResetEmail(auth, email.value)
    console.log('Письмо для сброса пароля отправлено!')
  } catch (error) {
    console.error(
      'Ошибка при отправке письма для сброса пароля:',
      error.code,
      error.message
    )
  }
}
</script>

<style scoped>
.forgot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  padding: 20px;
  margin-bottom: 50px;
  border: 1px solid #71717a;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.forgot-logo-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.forgot-logo {
  display: block;
  height: 42px;
  margin-right: 20px;
}

.forgot-logo-title {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

.forgot-reset-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.forgot-title {
  margin: 0;
  margin-bottom: 10px;
  color: #71717a;
  font-size: 16px;
  font-weight: 400;
}

.forgot-subtitle {
  text-align: center;
  font-size: 10px;
  font-weight: 300;
  color: #71717a;
}

.forgot-form {
  width: 100%;
  margin-bottom: 20px;
}

.forgot-input-container {
  display: flex;
  align-items: center;
  padding-left: 10px;
  margin-bottom: 20px;
  border: 1px solid #71717a;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.forgot-input-icon {
  color: #fff;
}

.forgot-input {
  outline: none;
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  font-size: 14px;
  color: #fff;
}

.forgot-code-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.forgot-btn-continue {
  width: 100%;
}

.forgot-back-link {
  text-align: center;
  outline: none;
  color: #71717a;
  font-size: 10px;
  transition: all 0.2s ease-in-out;
}

.forgot-back-link:hover {
  color: #fff;
}

.forgot-back-link:focus {
  color: #fff;
}

.forgot-back-link:active {
  color: #fff;
}
</style>
