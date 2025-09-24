<template>
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
      <small class="verify-error" v-if="errorMessage"
        >{{ errorMessage }}
      </small>
      <small class="verify-message" v-else-if="successMessage"
        >{{ successMessage }}
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoHeader from '@/components/ui/LogoHeader.vue'
import AppButton from '@/components/AppButton.vue'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged, applyActionCode } from 'firebase/auth'

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

if (!oobCode) {
  errorMessage.value =
    'Недействительная или отсутствующая ссылка для подтверждения email.'
} else {
  applyActionCode(auth, oobCode)
    .then(() => checkEmail())
    .catch((error) => {
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage.value =
            'Срок действия ссылки для подтверждения истек. Пожалуйста, запросите письмо для подтверждения снова.'
          break
        case 'auth/invalid-action-code':
          errorMessage.value =
            'Ссылка для подтверждения недействительна или уже была использована.'
          break
        case 'auth/user-disabled':
          errorMessage.value =
            'Ваша учетная запись была отключена. Пожалуйста, свяжитесь с поддержкой.'
          break
        case 'auth/user-not-found':
          errorMessage.value =
            'Не удалось найти пользователя, связанного с этой ссылкой. Возможно, учетная запись была удалена.'
          break
        default:
          errorMessage.value =
            'Произошла непредвиденная ошибка при подтверждении email. Пожалуйста, попробуйте еще раз.'
          break
      }
    })
}

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    emailVerified.value = true
    successMessage.value = 'Email подтвержден'
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
  margin-bottom: 50px;
  border: 1px solid #71717a;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.verify-subtitle {
  text-align: center;
  margin-bottom: 20px;
  font-size: 10px;
  font-weight: 300;
  color: #71717a;
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
  color: rgb(240, 85, 85);
}

.disabled {
  pointer-events: none;
  opacity: 0.3;
}
</style>
