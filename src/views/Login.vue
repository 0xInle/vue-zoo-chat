<template>
  <div class="login-container">
    <div class="login-logo-content">
      <img class="login-logo" src="../../public/logo.png" alt="Логотип" />
      <div class="login-title">Zoo</div>
    </div>
    <form class="login-form" @submit.prevent="onSubmit">
      <div class="login-form-content-mb">
        <div :class="['login-input-container', { invalid: pError }]">
          <IconMail class="login-input-icon" />
          <input
            class="login-input"
            name="email"
            type="email"
            placeholder="Введите email"
            v-model="eEmail"
            @blur="eBlur"
          />
        </div>
        <small class="login-input-error" v-if="eError">{{ eError }}</small>
      </div>
      <div class="login-form-content-mb">
        <div :class="['login-input-container', { invalid: pError }]">
          <IconPassword class="login-input-icon" />
          <input
            class="login-input"
            name="password"
            type="password"
            placeholder="Введите пароль"
            v-model="pPassword"
            @blur="pBlur"
          />
        </div>
        <small class="login-input-error" v-if="pError">{{ pError }}</small>
      </div>
      <div class="login-btn-container">
        <AppButton
          text="Войти"
          class="login-btn"
          type="submit"
          :disabled="isSubmitting || isToManyAttempts"
        />
        <small class="login-button-error" v-if="isToManyAttempts"
          >Слишком частые попытки входа в систему</small
        >
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
    <button class="login-btn-google btn-reset" @click="login">
      <IconGoogle class="login-btn-icon" />
      Войти используя Google
    </button>
  </div>
</template>

<script setup>
import IconMail from '@/assets/icons/icon-mail.svg'
import IconPassword from '@/assets/icons/icon-password.svg'
import IconGoogle from '@/assets/icons/icon-google.svg'
import AppButton from '@/components/AppButton.vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { computed, inject, watch } from 'vue'

const login = inject('login')

const { handleSubmit, isSubmitting, submitCount } = useForm()

const {
  value: eEmail,
  errorMessage: eError,
  handleBlur: eBlur,
} = useField(
  'email',
  yup.string().trim().required('Введите email').email('Некорректный email')
)

const {
  value: pPassword,
  errorMessage: pError,
  handleBlur: pBlur,
} = useField(
  'password',
  yup
    .string()
    .trim()
    .required('Введите пароль')
    .min(6, 'Пароль должен быть больше 6 символов')
)

const onSubmit = handleSubmit((values) => {
  console.log(values)
})

const isToManyAttempts = computed(() => submitCount.value >= 3)

watch(isToManyAttempts, (val) => {
  if (val) {
    setTimeout(() => (submitCount.value = 0), 2000)
  }
})
</script>

<style scoped>
.login-container {
  width: 30%;
  padding: 20px;
  margin-bottom: 50px;
  border: 1px solid #71717a;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.login-logo-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.login-logo {
  display: block;
  height: 42px;
  margin-right: 20px;
}

.login-title {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

.login-form-content-mb {
  margin-bottom: 20px;
}

.login-input-container {
  display: flex;
  align-items: center;
  padding-left: 10px;
  border: 1px solid #71717a;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.login-input-icon {
  color: #fff;
}

.login-input {
  outline: none;
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  font-size: 14px;
  color: #fff;
}

.login-input:not(:last-child) {
  margin-bottom: 10px;
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
  color: #71717a;
  font-size: 10px;
  transition: all 0.2s ease-in-out;
}

.login-help-link:hover {
  color: #fff;
}

.login-help-link:focus {
  color: #fff;
}

.login-help-link:active {
  color: #fff;
}

.login-or {
  align-items: center;
  margin-bottom: 20px;
}

.login-or-left,
.login-or-right {
  width: 100%;
  height: 1px;
  background-color: #71717a;
}

.login-or-center {
  padding: 0 10px;
  color: #fff;
  font-size: 10px;
}

.login-btn-icon {
  margin-right: 10px;
  fill: #fff;
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
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  background-color: #71717a;
}

.login-btn-google:hover {
  background-color: #fff;
  color: #000;
}

.login-btn-google:focus {
  background-color: #fff;
  color: #000;
}

.login-btn-google:hover .login-btn-icon {
  fill: #000;
}

.login-btn-google:focus .login-btn-icon {
  fill: #000;
}

.login-btn-google:active .login-btn-icon {
  fill: #000;
}

.login-btn-google:active {
  background-color: #fff;
  color: #000;
}

.login-input-error {
  font-size: 10px;
  color: rgb(240, 85, 85);
}

.invalid {
  border-color: rgb(240, 85, 85);
}

.login-btn:disabled {
  pointer-events: none;
  opacity: 0.3;
}

.login-btn-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.login-button-error {
  font-size: 10px;
  color: rgb(240, 85, 85);
  align-self: center;
}
</style>
