<template>
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
        <small class="register-input-error" v-if="eError && eEmail">{{
          eError
        }}</small>
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
        :disabled="isSubmitting || !isFormValid || !!confirmError"
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
import { ref, computed } from 'vue'
import { auth } from '@/firebaseConfig'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useValidateForm } from '@/composables/useValidateForm'
import ViewPasswordButton from '@/components/ui/ViewPasswordButton.vue'

const viewPassword = ref(false)
const viewConfirmPassword = ref(false)

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

const router = useRouter()

const firebaseError = ref('')

const formSubmit = handleSubmit(async function registerWithEmail(values) {
  const { email, password } = values
  if (!confirmError.value)
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
    } catch (e) {
      const error = e as { code?: string }
      switch (error.code) {
        case 'auth/email-already-in-use':
          firebaseError.value =
            'Этот адрес электронной почты уже используется. Пожалуйста, войдите или используйте другой email.'
          break
        case 'auth/invalid-email':
          firebaseError.value = 'Неверный формат электронной почты.'
          break
        case 'auth/weak-password':
          firebaseError.value =
            'Пароль слишком слабый. Пожалуйста, используйте более надежный пароль.'
          break
        case 'auth/operation-not-allowed':
          firebaseError.value =
            'Регистрация по почте и паролю временно недоступна. Пожалуйста, свяжитесь с поддержкой.'
          break
        default:
          firebaseError.value =
            'Произошла непредвиденная ошибка при регистрации. Пожалуйста, попробуйте еще раз.'
      }
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

.register-form-content-mb {
  margin-bottom: 20px;
}

.register-input-container {
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid #71717a;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
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

.register-input-error {
  font-size: 10px;
  color: rgb(240, 85, 85);
}

.invalid {
  border-color: rgb(240, 85, 85);
}

.register-btn-continue:disabled {
  pointer-events: none;
  opacity: 0.3;
}
</style>
