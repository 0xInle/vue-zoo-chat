<template>
  <div class="reset-container">
    <LogoHeader />
    <div class="reset-reset-content">
      <div class="reset-subtitle">
        Введите новый пороль для входа в приложение.
      </div>
      <form class="reset-form" @submit.prevent="handlePasswordReset">
        <div class="reset-input-container">
          <IconPassword class="reset-input-icon" />
          <input
            class="reset-input"
            name="password"
            type="password"
            placeholder="Введите пароль"
            v-model="newPassword"
          />
        </div>
        <div class="reset-input-container">
          <IconPassword class="reset-input-icon" />
          <input
            class="reset-input"
            name="password"
            type="password"
            placeholder="Подтвердите пароль"
            v-model="confirmPassword"
          />
        </div>
        <AppButton
          text="Обновить пароль"
          type="submit"
          class="reset-btn-reset"
        />
      </form>
      <router-link to="/register" class="reset-back-link link-reset">
        Регистрация
      </router-link>
    </div>
  </div>
</template>

<script setup>
import LogoHeader from '@/components/ui/LogoHeader.vue'
import AppButton from '@/components/AppButton.vue'
import IconPassword from '../assets/icons/icon-password.svg'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '@/firebaseConfig'
import { confirmPasswordReset } from 'firebase/auth'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const oobCode = route.query.oobCode

if (!oobCode) {
  console.log()
  errorMessage.value = 'Недействительная ссылка для сброса пароля.'
}

async function handlePasswordReset() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!newPassword.value || newPassword.value.length < 6) {
    errorMessage.value = 'Пароль должен быть не менее 6 символов.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Пароли не совпадают.'
    return
  }

  try {
    await confirmPasswordReset(auth, oobCode, newPassword.value)
    successMessage.value =
      'Ваш пароль успешно изменен. Теперь вы можете войти с новым паролем.'
    setTimeout(() => router.push('/login'), 3000)
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error)
    switch (error.code) {
      case 'auth/expired-action-code':
        errorMessage.value =
          'Срок действия ссылки для сброса пароля истек. Пожалуйста, запросите сброс пароля снова.'
        break
      case 'auth/invalid-action-code':
        errorMessage.value =
          'Недействительный код действия. Возможно, ссылка уже использована или повреждена.'
        break
      case 'auth/user-disabled':
        errorMessage.value =
          'Ваш аккаунт отключен. Пожалуйста, свяжитесь с поддержкой.'
        break
      case 'auth/user-not-found':
        errorMessage.value = 'Пользователь с таким email не найден.'
        break
      case 'auth/weak-password':
        errorMessage.value =
          'Пароль слишком слабый. Пожалуйста, используйте более сложный пароль.'
        break
      default:
        errorMessage.value = `Произошла ошибка: ${error.message}.`
    }
  }
}
</script>

<style scoped>
.reset-container {
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

.reset-reset-content {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.reset-subtitle {
  text-align: center;
  margin-bottom: 20px;
  font-size: 10px;
  font-weight: 300;
  color: #71717a;
}

.reset-form {
  width: 100%;
  margin-bottom: 20px;
}

.reset-input-container {
  display: flex;
  align-items: center;
  padding-left: 10px;
  border: 1px solid #71717a;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.reset-input-container:not(:last-child) {
  margin-bottom: 20px;
}

.reset-input-icon {
  color: #fff;
}

.reset-input {
  outline: none;
  padding: 10px;
  background-color: transparent;
  border: none;
  font-size: 14px;
  color: #fff;
}

.reset-btn-reset {
  width: 100%;
}

.reset-back-link {
  text-align: center;
  outline: none;
  color: #71717a;
  font-size: 10px;
  transition: all 0.2s ease-in-out;
}

.reset-back-link:hover {
  color: #fff;
}

.reset-back-link:focus {
  color: #fff;
}

.reset-back-link:active {
  color: #fff;
}
</style>
