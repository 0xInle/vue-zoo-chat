<template>
  <div class="register-container">
    <LogoHeader />
    <div class="register-reset-content">
      <div class="register-subtitle">
        Введите свой адрес электронной почты для регистрации.
      </div>
    </div>
    <form
      class="register-form"
      @submit.prevent="registerWithEmail(email, password)"
    >
      <div class="register-input-container">
        <IconMail class="register-input-icon" />
        <input
          class="register-input"
          name="email"
          type="email"
          placeholder="Введите email"
          v-model="email"
        />
      </div>
      <div class="register-input-container">
        <IconPassword class="register-input-icon" />
        <input
          class="register-input"
          name="password"
          type="password"
          placeholder="Введите пароль"
          v-model="password"
        />
      </div>
      <div class="register-input-container">
        <IconPassword class="register-input-icon" />
        <input
          class="register-input"
          name="password"
          type="password"
          placeholder="Подтвердите пароль"
          v-model="confirm"
        />
      </div>
      <AppButton
        text="Зарегистрироваться"
        class="register-btn-continue"
        type="submit"
      />
    </form>
    <router-link to="/login" class="register-back-link link-reset"
      >Вернуться к входу</router-link
    >
  </div>
</template>

<script setup>
import IconMail from '../assets/icons/icon-mail.svg'
import IconPassword from '../assets/icons/icon-password.svg'
import AppButton from '@/components/AppButton.vue'
import LogoHeader from '@/components/ui/LogoHeader.vue'
import { ref } from 'vue'

import { auth } from '@/firebaseConfig'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref()
const password = ref()
const confirm = ref()
const router = useRouter()

async function registerWithEmail(email, password) {
  if (password === confirm.value) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      console.log('Пользователь зарегистрирован:', userCredential.user)
      const actionCodeSettings = {
        url: 'http://localhost:5173/verify',
        handleCodeInApp: true,
      }
      await sendEmailVerification(userCredential.user, actionCodeSettings)

      console.log('Письмо для верификации отправлено!')

      router.push('/verify')
    } catch (error) {
      console.error('Ошибка при регистрации:', error.code, error.message)
    }
  } else {
    console.log('Пароли не совпадают')
  }
}
</script>

<style scoped>
.register-container {
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

.register-logo-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.register-logo {
  display: block;
  height: 42px;
  margin-right: 20px;
}

.register-logo-title {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

.register-reset-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.register-subtitle {
  text-align: center;
  font-size: 10px;
  font-weight: 300;
  color: #71717a;
}

.register-form {
  width: 100%;
  margin-bottom: 20px;
}

.register-input-container {
  display: flex;
  align-items: center;
  padding-left: 10px;
  border: 1px solid #71717a;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.register-input-container:not(:last-child) {
  margin-bottom: 20px;
}

.register-input-icon {
  color: #fff;
}

.register-input {
  outline: none;
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  font-size: 14px;
  color: #fff;
}

.register-btn-code {
  white-space: nowrap;
}

.register-btn-continue {
  width: 100%;
}

.register-back-link {
  text-align: center;
  outline: none;
  color: #71717a;
  font-size: 10px;
  transition: all 0.2s ease-in-out;
}

.register-back-link:hover {
  color: #fff;
}

.register-back-link:focus {
  color: #fff;
}

.register-back-link:active {
  color: #fff;
}
</style>
