<template>
  <div class="reset-container">
    <LogoHeader />
    <div class="reset-content">
      <div class="reset-subtitle">
        Введите новый пароль для входа в приложение.
      </div>
      <form
        class="reset-form"
        @submit.prevent="handleSubmit(handlePasswordReset)"
      >
        <div class="reset-form-content-mb">
          <div
            :class="['reset-input-container', { invalid: pError && pPassword }]"
          >
            <IconPassword class="reset-input-icon" />
            <input
              class="reset-input"
              name="password"
              type="password"
              placeholder="Новый пароль"
              v-model="pPassword"
              autocomplete="off"
            />
          </div>
          <small class="reset-input-error" v-if="pError && pPassword"
            >{{ pError }}
          </small>
        </div>
        <div class="reset-form-content-mb">
          <div
            :class="['reset-input-container', { invalid: cError && cPassword }]"
          >
            <IconPassword class="reset-input-icon" />
            <input
              class="reset-input"
              name="confirm"
              type="password"
              placeholder="Подтвердите пароль"
              v-model="cPassword"
              autocomplete="off"
            />
          </div>
          <small class="reset-input-error" v-if="cError && cPassword">{{
            cError
          }}</small>
          <small class="reset-input-error" v-else-if="confirmError">
            {{ confirmError }}
          </small>
        </div>
        <AppButton
          text="Обновить пароль"
          type="submit"
          class="reset-btn"
          :disabled="isFormValid"
        />
        <small class="reset-button-error" v-if="errorMessage">
          {{ errorMessage }}
        </small>
        <small class="reset-button-error" v-if="successMessage">
          {{ successMessage }}
        </small>
      </form>
      <router-link to="/register" class="reset-back-link link-reset">
        Регистрация
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoHeader from '@/components/ui/LogoHeader.vue'
import AppButton from '@/components/AppButton.vue'
import IconPassword from '../assets/icons/icon-password.svg'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '@/firebaseConfig'
import { confirmPasswordReset } from 'firebase/auth'
import { ref, watch, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const route = useRoute()
const router = useRouter()
const errorMessage = ref('')
const successMessage = ref('')

const { handleSubmit, isSubmitting } = useForm()

const { value: pPassword, errorMessage: pError } = useField<string>(
  'password',
  yup
    .string()
    .trim()
    .required('Введите пароль')
    .min(6, 'Пароль должен быть больше 6 символов')
)

const { value: cPassword, errorMessage: cError } = useField(
  'confirm',
  yup
    .string()
    .trim()
    .required('Введите пароль')
    .min(6, 'Пароль должен быть больше 6 символов')
)

const confirmError = ref('')

watch([pPassword, cPassword], ([newPass, newConfirm]) => {
  if (newConfirm && newPass !== newConfirm) {
    confirmError.value = 'Пароли не совпадают'
  } else {
    confirmError.value = ''
  }
})

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
  errorMessage.value = 'Недействительная ссылка для сброса пароля.'
}

async function handlePasswordReset() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!oobCode) {
    errorMessage.value =
      'Недействительная ссылка для сброса пароля. (Внутренняя ошибка)'
    return
  }

  try {
    await confirmPasswordReset(auth, oobCode, pPassword.value)
    successMessage.value =
      'Ваш пароль успешно изменен. Теперь вы можете войти с новым паролем.'
    setTimeout(() => router.push('/login'), 3000)
  } catch (e) {
    const error = e as { code?: string }
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
        errorMessage.value =
          'Извините, произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз через несколько минут. Если проблема сохраняется, свяжитесь с нашей службой поддержки.'
    }
  }
}

const isFormValid = computed(() => {
  return (
    isSubmitting.value ||
    pError.value ||
    !pPassword.value ||
    !!confirmError.value ||
    cError.value ||
    !cPassword.value ||
    !!errorMessage.value
  )
})
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

.reset-content {
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

.reset-btn {
  width: 100%;
}

.reset-btn:disabled {
  pointer-events: none;
  opacity: 0.3;
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

.reset-form-content-mb {
  margin-bottom: 20px;
}

.invalid {
  border-color: rgb(240, 85, 85);
}

.reset-input-error,
.reset-button-error {
  font-size: 10px;
  color: rgb(240, 85, 85);
}
</style>
