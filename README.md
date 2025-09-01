# .

Этот шаблон поможет вам начать разработку на **Vue 3** с **Vite**.

## Рекомендованная IDE

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vetur отключить).

## Поддержка типов для `.vue` в TypeScript

TypeScript по умолчанию не понимает типы `.vue` файлов, поэтому для проверки типов используем `vue-tsc`.  
В редакторах нужно [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar), чтобы TypeScript понимал `.vue` файлы.

## Настройка конфигурации

См. [документацию Vite](https://vite.dev/config/).

## Установка проекта

```sh
npm install
```

### Запуск проекта в режиме разработки с горячей перезагрузкой

```sh
npm run dev
```

### Проверка типов, сборка и минификация для продакшна

```sh
npm run build
```

## Переменные окружения

Создайте файл .env в корне проекта и добавьте ваш токен с [OpenRouter](https://openrouter.ai/)

```sh
VITE_OPENROUTER_API_KEY=ваш_токен
```
