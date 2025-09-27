<template>
  <div class="app-welcome-message flex">
    <h1 class="app-title">Добро пожаловать.</h1>
    <h2 class="app-subtitle">Чем я могу вам сегодня помочь?</h2>
  </div>
</template>

<style scoped>
.app-welcome-message {
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.app-title {
  margin: 0;
  margin-bottom: 30px;
  color: var(--text-color);
  font-size: 24px;
  font-weight: 400;
}

.app-subtitle {
  margin: 0;
  color: var(--text-color);
  font-size: 14px;
  font-weight: 400;
}
</style>
