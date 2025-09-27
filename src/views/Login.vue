<template>
  <ErrorForm v-if="loginError" :text="loginError" />
  <ErrorForm v-else-if="googleError" :text="googleError" />
  <div class="login-container">
    <LogoHeader />
    <div class="login-subtitle">Используйте свой email адрес для входа.</div>
    <form class="login-form" @submit.prevent="onSubmit">
      <div class="login-form-content-mb">
        <div :class="['login-input-container', { invalid: eError && eEmail }]">
          <IconMail class="login-input-icon" />
          <input
            class="login-input"
            name="email"
            type="email"
            placeholder="Введите email"
            v-model="eEmail"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="login-form-content-mb">
        <div
          :class="['login-input-container', { invalid: pError && pPassword }]"
        >
          <IconPassword class="login-input-icon" />
          <input
            class="login-input"
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
        <small class="login-input-error" v-if="pError && pPassword">{{
          pError
        }}</small>
      </div>
      <div class="login-btn-container">
        <AppButton
          text="Войти"
          class="login-btn"
          type="submit"
          :disabled="!isFormValid || isLoading"
        />
      </div>
      <div class="login-help flex">
        <router-link to="/forgot" class="login-help-link link-reset">
          Забыли пароль?
        </router-link>
        <router-link to="/register" class="login-help-link link-reset">
          Регистрация
        </router-link>
      </div>
      <div class="login-or flex">
        <div class="login-or-left"></div>
        <div class="login-or-center">или</div>
        <div class="login-or-right"></div>
      </div>
    </form>
    <button
      class="login-btn-google btn-reset"
      @click="signInWithGoogle"
      :disabled="isLoadingGoogle"
    >
      <IconGoogle class="login-btn-icon" />
      Войти используя Google
    </button>
  </div>
</template>

<script setup lang="ts">
import IconMail from '@/assets/icons/icon-mail.svg'
import IconPassword from '@/assets/icons/icon-password.svg'
import IconGoogle from '@/assets/icons/icon-google.svg'
import AppButton from '@/components/AppButton.vue'
import LogoHeader from '@/components/ui/LogoHeader.vue'
import ViewPasswordButton from '@/components/ui/ViewPasswordButton.vue'
import ErrorForm from '@/components/ui/ErrorForm.vue'
import { computed, ref } from 'vue'
import { auth } from '@/firebaseConfig'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useValidateForm } from '@/composables/useValidateForm'
import { useErrorHandler } from '@/composables/useErrorHanler'
import { useTimeoutError } from '@/composables/useTimeoutError'

const { eError, eEmail, pError, pPassword } = useValidateForm()
const viewPassword = ref(false)
const router = useRouter()
const userName = ref()
const userAvatar = ref()
const googleError = ref('')
const loginError = ref()
const isLoading = ref(false)
const isLoadingGoogle = ref(false)

const isFormValid = computed(() => {
  return !eError.value && !!eEmail.value && !pError.value && !!pPassword.value
})

async function signInWithGoogle() {
  googleError.value = ''

  if (auth.currentUser) {
    userName.value = auth.currentUser.displayName
    userAvatar.value = auth.currentUser.photoURL
    router.push('/chat')
    return
  }

  isLoadingGoogle.value = true

  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    userName.value = user.displayName
    userAvatar.value = user.photoURL
    localStorage.setItem('userName', user.displayName || '')
    localStorage.setItem('userAvatar', user.photoURL || '')
    router.push('/chat')
  } catch (e) {
    const error = e as { code?: string }
    googleError.value = useErrorHandler(error.code, 'login')

    if (googleError.value) {
      useTimeoutError(googleError, 5000)
    }
  } finally {
    isLoadingGoogle.value = false
  }
}

const onSubmit = async () => {
  loginError.value = ''
  isLoading.value = true

  try {
    await signInWithEmailAndPassword(
      auth,
      eEmail.value as string,
      pPassword.value as string
    )
  } catch (e) {
    console.log(e)
    const error = e as { code?: string }
    loginError.value = useErrorHandler(error.code, 'google')

    if (loginError.value) {
      useTimeoutError(loginError, 5000)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  width: 30%;
  padding: 20px;
  border: 1px solid var(--btn-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.login-subtitle {
  margin-bottom: 20px;
  text-align: center;
  font-size: 10px;
  font-weight: 300;
  color: var(--btn-color);
}

.login-form-content-mb {
  position: relative;
  margin-bottom: 20px;
}

.login-input-container {
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid var(--btn-color);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease-in-out;
}

.login-input-icon {
  color: var(--text-color);
}

.login-input {
  outline: none;
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  font-size: 14px;
  color: var(--text-color);
}

.login-btn {
  width: 100%;
  margin-bottom: 5px;
}

.login-help {
  justify-content: space-between;
  margin-bottom: 20px;
}

.login-help-link {
  outline: none;
  color: var(--btn-color);
  font-size: 10px;
  transition: all 0.2s ease-in-out;
}

.login-help-link:hover {
  color: var(--text-color);
}

.login-help-link:focus {
  color: var(--text-color);
}

.login-help-link:active {
  color: var(--text-color);
}

.login-or {
  align-items: center;
  margin-bottom: 20px;
}

.login-or-left,
.login-or-right {
  width: 100%;
  height: 1px;
  background-color: var(--btn-color);
}

.login-or-center {
  padding: 0 10px;
  color: var(--text-color);
  font-size: 10px;
}

.login-btn-icon {
  margin-right: 10px;
  fill: var(--text-color);
  transition: all 0.2s ease-in-out;
}

.login-btn-google {
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  width: 100%;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  color: var(--text-color);
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  background-color: var(--btn-color);
}

.login-btn-google:hover {
  background-color: var(--text-color);
  color: var(--dark-color);
}

.login-btn-google:focus {
  background-color: var(--text-color);
  color: var(--dark-color);
}

.login-btn-google:hover .login-btn-icon {
  fill: var(--dark-color);
}

.login-btn-google:focus .login-btn-icon {
  fill: var(--dark-color);
}

.login-btn-google:active .login-btn-icon {
  fill: var(--dark-color);
}

.login-btn-google:active {
  background-color: var(--text-color);
  color: var(--dark-color);
}

.invalid {
  border-color: var(--error-color);
}

.login-btn:disabled,
.login-btn-google:disabled {
  pointer-events: none;
  opacity: 0.3;
}

.login-btn-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.login-input-error {
  position: absolute;
  bottom: -15px;
  font-size: 10px;
  color: var(--error-color);
}
</style>
