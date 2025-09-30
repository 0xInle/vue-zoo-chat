<template>
  <ErrorForm :text="firebaseError" />
  <div class="register-container">
    <LogoHeader />
    <div class="register-reset-content">
      <div class="register-subtitle">
        Введите свой адрес электронной почты для регистрации.
      </div>
    </div>
    <form class="register-form" @submit.prevent="formSubmit">
      <div class="register-form-content-mb">
        <div
          :class="['register-input-container', { invalid: eError && eEmail }]"
        >
          <IconMail class="register-input-icon" />
          <input
            class="register-input"
            name="email"
            type="email"
            placeholder="Введите email"
            v-model="eEmail"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="register-form-content-mb">
        <div
          :class="[
            'register-input-container',
            { invalid: pError && pPassword },
          ]"
        >
          <IconPassword class="register-input-icon" />
          <input
            class="register-input"
            name="password"
            :type="viewPassword ? 'text' : 'password'"
            placeholder="Введите пароль"
            v-model="pPassword"
            autocomplete="off"
          />
          <ViewPasswordButton
            :showPassword="viewPassword"
            @toggle="viewPassword = !viewPassword"
          />
        </div>
        <small class="register-input-error" v-if="pError && pPassword">{{
          pError
        }}</small>
      </div>
      <div class="register-form-content-mb">
        <div
          :class="[
            'register-input-container',
            { invalid: cError && cPassword },
          ]"
        >
          <IconPassword class="register-input-icon" />
          <input
            class="register-input"
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
        <small class="register-input-error" v-if="cError && cPassword">{{
          cError
        }}</small>
        <small class="register-input-error" v-else>
          {{ confirmError }}
        </small>
      </div>
      <AppButton
        text="Зарегистрироваться"
        class="register-btn-continue"
        type="submit"
        :disabled="isSubmitting || !isFormValid || !!confirmError || isLoading"
      />
      <small class="register-input-error" v-if="firebaseError">
        {{ firebaseError }}
      </small>
    </form>
    <router-link to="/login" class="register-back-link link-reset"
      >Вернуться к входу</router-link
    >
  </div>
</template>

<script setup lang="ts">
import IconMail from '../assets/icons/icon-mail.svg'
import IconPassword from '../assets/icons/icon-password.svg'
import AppButton from '@/components/AppButton.vue'
import LogoHeader from '@/components/ui/LogoHeader.vue'
import ErrorForm from '@/components/ui/ErrorForm.vue'
import ViewPasswordButton from '@/components/ui/ViewPasswordButton.vue'
import { ref, computed } from 'vue'
import { auth } from '@/firebaseConfig'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useValidateForm } from '@/composables/useValidateForm'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useTimeoutError } from '@/composables/useTimeoutError'

const {
  eError,
  eEmail,
  handleSubmit,
  isSubmitting,
  pPassword,
  pError,
  cPassword,
  cError,
  confirmError,
} = useValidateForm()
const viewPassword = ref(false)
const viewConfirmPassword = ref(false)
const router = useRouter()
const firebaseError = ref('')
const isLoading = ref(false)

const formSubmit = handleSubmit(async function registerWithEmail(values) {
  const { email, password } = values

  firebaseError.value = ''
  isLoading.value = true

  if (!confirmError.value)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const actionCodeSettings = {
        url: 'http://localhost:5173/verify',
        handleCodeInApp: true,
      }
      await sendEmailVerification(userCredential.user, actionCodeSettings)

      router.push('/verify')
    } catch (e) {
      const error = e as { code?: string }
      firebaseError.value = useErrorHandler(error.code, 'register')

      if (firebaseError.value) {
        useTimeoutError(firebaseError, 5000)
      }
    } finally {
      isLoading.value = false
    }
})

const isFormValid = computed(() => {
  return (
    !eError.value &&
    !!eEmail.value &&
    !pError.value &&
    !!pPassword.value &&
    !cError.value &&
    !!cPassword.value
  )
})
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  padding: 20px;
  border: 1px solid var(--btn-color);
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
  color: var(--text-color);
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
  color: var(--btn-color);
}

.register-form {
  width: 100%;
  margin-bottom: 20px;
}

.register-form-content-mb {
  margin-bottom: 20px;
  position: relative;
}

.register-input-container {
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid var(--btn-color);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease-in-out;
}

.register-input-icon {
  color: var(--text-color);
}

.register-input {
  outline: none;
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  font-size: 14px;
  color: var(--text-color);
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
  color: var(--btn-color);
  font-size: 10px;
  transition: all 0.2s ease-in-out;
}

.register-back-link:hover {
  color: var(--text-color);
}

.register-back-link:focus {
  color: var(--text-color);
}

.register-back-link:active {
  color: var(--text-color);
}

.register-input-error {
  position: absolute;
  bottom: -15px;
  font-size: 10px;
  color: var(--error-color);
}

.invalid {
  border-color: var(--error-color);
}

.register-btn-continue:disabled {
  pointer-events: none;
  opacity: 0.3;
}
</style>
