<template>
  <ErrorForm v-if="firebaseError" :text="firebaseError" />
  <ErrorForm
    v-else-if="isSuccess"
    text="Письмо для сброса пароля отправлено. Проверьте вашу почту."
  />
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
          />
        </div>
      </div>
      <AppButton
        :text="isSuccess ? 'Отправить снова' : 'Отправить письмо'"
        class="forgot-btn-continue"
        type="submit"
        :disabled="isSubmitting || !eEmail || eError || isLoading"
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
import ErrorForm from '@/components/ui/ErrorForm.vue'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebaseConfig'
import { ref } from 'vue'
import { useValidateForm } from '@/composables/useValidateForm'
import { useErrorHandler } from '@/composables/useErrorHanler'
import { useTimeoutError } from '@/composables/useTimeoutError'

const isSuccess = ref(false)
const firebaseError = ref('')
const isLoading = ref(false)
const { eError, eEmail, isSubmitting } = useValidateForm()

const formSubmit = async function resetPassword() {
  firebaseError.value = ''
  isLoading.value = true

  try {
    await sendPasswordResetEmail(auth, eEmail.value as string)
    isSuccess.value = true
    eEmail.value = ''
  } catch (e) {
    const error = e as { code?: string }
    firebaseError.value = useErrorHandler(error.code, 'forgot')

    if (firebaseError.value) {
      useTimeoutError(firebaseError, 5000)
    }
  } finally {
    isLoading.value = false

    if (isSuccess.value) {
      useTimeoutError(isSuccess, 5000)
    }
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
  border: 1px solid var(--btn-color);
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
  color: var(--text-color);
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
  color: var(--btn-color);
  font-size: 16px;
  font-weight: 400;
}

.forgot-subtitle {
  text-align: center;
  font-size: 10px;
  font-weight: 300;
  color: var(--btn-color);
}

.forgot-form {
  width: 100%;
  margin-bottom: 20px;
}

.forgot-input-container {
  display: flex;
  align-items: center;
  padding-left: 10px;
  border: 1px solid var(--btn-color);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease-in-out;
}

.forgot-input-icon {
  color: var(--text-color);
}

.forgot-input {
  outline: none;
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  font-size: 14px;
  color: var(--text-color);
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
  color: var(--btn-color);
  font-size: 10px;
  transition: all 0.2s ease-in-out;
}

.forgot-back-link:hover {
  color: var(--text-color);
}

.forgot-back-link:focus {
  color: var(--text-color);
}

.forgot-back-link:active {
  color: var(--text-color);
}

.forgot-input-error {
  font-size: 10px;
  color: var(--error-color);
}

.forgot-input-confirm {
  font-size: 10px;
  color: var(--error-color);
}

.forgot-form-content-mb {
  margin-bottom: 20px;
}

.invalid {
  border-color: var(--error-color);
}
</style>
