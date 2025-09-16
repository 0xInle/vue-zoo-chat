<template>
  <div class="register-container">
    <LogoHeader />
    <div class="register-reset-content">
      <div class="register-subtitle">
        Введите свой адрес электронной почты для регистрации.
      </div>
    </div>
    <form class="register-form" @submit.prevent="">
      <div class="register-input-container">
        <IconMail class="register-input-icon" />
        <input
          class="register-input"
          name="email"
          type="email"
          placeholder="Введите email"
        />
      </div>
      <div class="register-input-container">
        <IconPassword class="register-input-icon" />
        <input
          class="register-input"
          name="password"
          type="password"
          placeholder="Введите пароль"
        />
      </div>
      <div class="register-input-container">
        <IconPassword class="register-input-icon" />
        <input
          class="register-input"
          name="password"
          type="password"
          placeholder="Подтвердите пароль"
        />
      </div>
      <div class="register-code-container">
        <div class="register-input-container">
          <IconHash class="register-input-icon" />
          <input
            class="register-input"
            name="text"
            type="text"
            placeholder="Введите код"
          />
        </div>

        <AppButton text="Получить код" class="register-btn-code" />
      </div>
    </form>
    <AppButton text="Войти" class="register-btn-continue" />
    <router-link to="/login" class="register-back-link link-reset"
      >Вернуться к входу</router-link
    >
  </div>
</template>

<script setup>
import IconMail from '../assets/icons/icon-mail.svg'
import IconPassword from '../assets/icons/icon-password.svg'
import IconHash from '../assets/icons/icon-hash.svg'
import AppButton from '@/components/AppButton.vue'
import LogoHeader from '@/components/ui/LogoHeader.vue'
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

.register-input-container {
  display: flex;
  align-items: center;
  padding-left: 10px;
  margin-bottom: 20px;
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
  margin-bottom: 20px;
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

.register-code-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.register-code-container .register-input-container {
  margin-bottom: 0;
  flex: 1;
  margin-right: 20px;
}
</style>
