<template>
  <div class="verify-container">
    <LogoHeader />
    <div class="verify-reset-content">
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
      <router-link to="/chat">
        <AppButton class="verify-btn" text="Перейти в приложение" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import LogoHeader from '@/components/ui/LogoHeader.vue'
import AppButton from '@/components/AppButton.vue'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged, applyActionCode } from 'firebase/auth'

const router = useRouter()
const route = useRoute()
const emailVerified = ref(false)

const checkEmail = async () => {
  const user = auth.currentUser
  if (user) {
    await user.reload()
    emailVerified.value = user.emailVerified
    if (emailVerified.value) router.push('/chat')
  }
}

const oobCode = route.query.oobCode
if (oobCode) {
  applyActionCode(auth, oobCode)
    .then(() => checkEmail())
    .catch((err) => console.error('Ошибка при подтверждении email:', err))
}

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    emailVerified.value = true
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
</style>
