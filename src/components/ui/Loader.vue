<template>
  <div class="loader">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped>
.loader span {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background: #fff;
  border-radius: 50%;
  animation: blink 1.4s infinite both;
}
.loader span:nth-child(2) {
  animation-delay: 0.2s;
}
.loader span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
</style>
