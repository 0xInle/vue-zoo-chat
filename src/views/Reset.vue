<template>
  <ErrorForm v-if="errorMessage" :text="errorMessage" />
  <ErrorForm v-else-if="successMessage" :text="successMessage" />
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
              :type="viewPassword ? 'text' : 'password'"
              placeholder="Новый пароль"
              v-model="pPassword"
              autocomplete="off"
            />
            <ViewPasswordButton
              :showPassword="viewPassword"
              @toggle="viewPassword = !viewPassword"
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
              :type="viewConfirmPassword ? 'text' : 'password'"
              placeholder="Подтвердите пароль"
              v-model="cPassword"
              autocomplete="off"
            />
            <ViewPasswordButton
              :showPassword="viewConfirmPassword"
              @toggle="viewConfirmPassword = !viewConfirmPassword"
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
          :disabled="isFormValid || isLoading"
        />
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
import ErrorForm from '@/components/ui/ErrorForm.vue'
import IconPassword from '../assets/icons/icon-password.svg'
import ViewPasswordButton from '@/components/ui/ViewPasswordButton.vue'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '@/firebaseConfig'
import { confirmPasswordReset } from 'firebase/auth'
import { ref, watch, computed } from 'vue'
import { useValidateForm } from '@/composables/useValidateForm'
import { useErrorHandler } from '@/composables/useErrorHanler'
import { useTimeoutError } from '@/composables/useTimeoutError'
import { useTimeoutFn } from '@vueuse/core'

const { handleSubmit, pError, pPassword, cError, cPassword, isSubmitting } =
  useValidateForm()
const viewPassword = ref(false)
const viewConfirmPassword = ref(false)
const route = useRoute()
const router = useRouter()
const errorMessage = ref('')
const successMessage = ref('')
const confirmError = ref('')
const isLoading = ref(false)

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
  isLoading.value = true

  if (!oobCode) {
    errorMessage.value =
      'Недействительная ссылка для сброса пароля. (Внутренняя ошибка)'
    return
  }

  try {
    await confirmPasswordReset(auth, oobCode, pPassword.value as string)
    successMessage.value =
      'Ваш пароль успешно изменен. Теперь вы можете войти с новым паролем.'
    useTimeoutFn(() => {
      router.push('/login')
    }, 3000).start()
  } catch (e) {
    const error = e as { code?: string }
    errorMessage.value = useErrorHandler(error.code, 'reset')

    if (errorMessage.value) {
      useTimeoutError(errorMessage, 5000)
    }
  } finally {
    isLoading.value = false
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
  border: 1px solid var(--btn-color);
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
  color: var(--btn-color);
}

.reset-form {
  width: 100%;
  margin-bottom: 20px;
}

.reset-input-container {
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid var(--btn-color);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease-in-out;
}

.reset-input-icon {
  color: var(--text-color);
}

.reset-input {
  outline: none;
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  font-size: 14px;
  color: var(--text-color);
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
  color: var(--btn-color);
  font-size: 10px;
  transition: all 0.2s ease-in-out;
}

.reset-back-link:hover {
  color: var(--text-color);
}

.reset-back-link:focus {
  color: var(--text-color);
}

.reset-back-link:active {
  color: var(--text-color);
}

.reset-form-content-mb {
  position: relative;
  margin-bottom: 20px;
}

.invalid {
  border-color: var(--error-color);
}

.reset-input-error,
.reset-button-error {
  position: absolute;
  bottom: -15px;
  font-size: 10px;
  color: var(--error-color);
}
</style>
