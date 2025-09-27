<template>
  <ErrorForm v-if="errorMessage" :text="errorMessage" />
  <ErrorForm v-else-if="successMessage" :text="successMessage" />
  <div class="verify-container">
    <LogoHeader />
    <div class="verify-content">
      <div class="verify-subtitle">
        <p class="verify-text">
          На вашу почту отправлено письмо для подтверждения регистрации.
        </p>
        <p class="verify-text">
          После подтверждения вы будете автоматически перенаправлены в
          приложение.
        </p>
        <p class="verify-text">
          Если переход не произошёл, нажмите на кнопку ниже, чтобы войти
          вручную.
        </p>
      </div>
      <router-link to="/chat" :class="{ disabled: !!errorMessage }">
        <AppButton class="verify-btn" text="Перейти в приложение" />
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoHeader from '@/components/ui/LogoHeader.vue'
import AppButton from '@/components/AppButton.vue'
import ErrorForm from '@/components/ui/ErrorForm.vue'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged, applyActionCode } from 'firebase/auth'
import { useErrorHandler } from '@/composables/useErrorHanler'
import { useTimeoutError } from '@/composables/useTimeoutError'

const router = useRouter()
const route = useRoute()
const emailVerified = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const checkEmail = async () => {
  try {
    const user = auth.currentUser
    if (user) {
      await user.reload()
      emailVerified.value = user.emailVerified
      successMessage.value =
        'Email подтвержден. Пожалуйста, войдите в приложение.'
      if (emailVerified.value) router.push('/chat')
    }
  } catch (error) {
    errorMessage.value =
      'Произошла ошибка при обновлении статуса пользователя. Пожалуйста, попробуйте войти вручную.'
    useTimeoutError(errorMessage, 5000)
  }
}

const rawOobCode = route.query.oobCode
let oobCode: string | null = null

if (typeof rawOobCode === 'string' && rawOobCode.length > 0) {
  oobCode = rawOobCode
} else if (
  Array.isArray(rawOobCode) &&
  typeof rawOobCode[0] === 'string' &&
  rawOobCode[0].length > 0
) {
  oobCode = rawOobCode[0]
}

if (oobCode) {
  try {
    await applyActionCode(auth, oobCode)
    await checkEmail()
  } catch (e) {
    const error = e as { code?: string }
    errorMessage.value = useErrorHandler(error.code, 'verify')
    useTimeoutError(errorMessage, 5000)
  }
} else {
  errorMessage.value =
    'Недействительная или отсутствующая ссылка для подтверждения email.'
  useTimeoutError(errorMessage, 5000)
}

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    emailVerified.value = true
    successMessage.value = 'Email подтвержден'
    useTimeoutError(successMessage, 5000)
    router.push('/chat')
  }
})
</script>

<style scoped>
.verify-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  padding: 20px;
  border: 1px solid var(--btn-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.verify-subtitle {
  text-align: center;
  margin-bottom: 20px;
  font-size: 10px;
  font-weight: 300;
  color: var(--btn-color);
}

.verify-text {
  margin: 0;
}

.verify-text:not(:last-child) {
  margin-bottom: 20px;
}

.verify-btn {
  width: 100%;
}

.verify-error,
.verify-message {
  font-size: 10px;
  color: var(--error-color);
}

.disabled {
  pointer-events: none;
  opacity: 0.3;
}
</style>
