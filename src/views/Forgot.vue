<template>
  <div class="forgot-container">
    <LogoHeader />
    <div class="forgot-reset-content">
      <h3 class="forgot-title">Восстановление пароля</h3>
      <div class="forgot-subtitle">
        Введите свой адрес электронной почты для восстановления доступа.
      </div>
    </div>
    <form class="forgot-form" @submit.prevent="formSubmit">
      <div class="forgot-form-content-mb">
        <div :class="['forgot-input-container', { invalid: eError && eEmail }]">
          <IconMail class="forgot-input-icon" />
          <input
            class="forgot-input"
            name="email"
            type="email"
            placeholder="Введите email"
            v-model="eEmail"
            autocomplete="off"
            @input="onInput"
          />
        </div>
        <small
          class="forgot-input-error"
          v-if="eError && !isSuccess && eEmail"
          >{{ eError }}</small
        >
        <small class="forgot-input-confirm" v-if="isSuccess"
          >Письмо для сброса пароля отправлено. Проверьте вашу почту.</small
        >
        <small v-if="firebaseError" class="forgot-input-error">
          {{ firebaseError }}
        </small>
      </div>
      <AppButton
        :text="isSuccess ? 'Отправить снова' : 'Отправить письмо'"
        class="forgot-btn-continue"
        type="submit"
        :disabled="isSubmitting || !eEmail || eError"
      />
    </form>
    <router-link to="/login" class="forgot-back-link link-reset"
      >Вернуться к входу</router-link
    >
  </div>
</template>

<script setup lang="ts">
import IconMail from '../assets/icons/icon-mail.svg'
import AppButton from '@/components/AppButton.vue'
import LogoHeader from '@/components/ui/LogoHeader.vue'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebaseConfig'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'

const isSuccess = ref(false)
const firebaseError = ref('')

const { isSubmitting, handleSubmit } = useForm()

const formSubmit = handleSubmit(async function resetPassword() {
  try {
    await sendPasswordResetEmail(auth, eEmail.value)
    isSuccess.value = true
    eEmail.value = ''
  } catch (e) {
    const error = e as { code?: string }
    switch (error.code) {
      case 'auth/invalid-email':
        firebaseError.value = 'Некорректный email'
        break
      case 'auth/user-not-found':
        firebaseError.value = 'Пользователь с таким email не найден'
        break
      case 'auth/too-many-requests':
        firebaseError.value = 'Слишком много попыток, попробуйте позже'
        break
      default:
        firebaseError.value = 'Ошибка при отправке письма'
    }
  }
})

const { value: eEmail, errorMessage: eError } = useField<string>(
  'email',
  yup.string().trim().required('Введите email').email('Некорректный email')
)

function onInput() {
  isSuccess.value = false
  firebaseError.value = ''
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

.forgot-btn-continue:disabled {
  pointer-events: none;
  opacity: 0.3;
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

.forgot-input-error {
  font-size: 10px;
  color: rgb(240, 85, 85);
}

.forgot-input-confirm {
  font-size: 10px;
  color: rgb(240, 85, 85);
}

.forgot-form-content-mb {
  margin-bottom: 20px;
}

.invalid {
  border-color: rgb(240, 85, 85);
}
</style>
