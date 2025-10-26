import { useStore } from '@/stores/store'

export type ApiMessage = {
  role: 'user' | 'assistant'
  content: string | null
}

export type ApiChoice = {
  finish_reason: string | null
  native_finish_reason: string | null
  message: ApiMessage
}

export type ApiError = {
  code: number
  message: string
  metadata?: Record<string, unknown>
}

export type ApiResponse = {
  id: string
  choices: ApiChoice[]
  created: number
  model: string
  object: 'chat.completion'
  error?: ApiError
}

export async function sendMessageToAI(
  userMessage: string,
  store: ReturnType<typeof useStore>
): Promise<string | null> {
  store.localizedError = null

  try {
    const response = await fetch('/proxy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: store.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userMessage,
              },
            ],
          },
        ],
      }),
    })

    const data: ApiResponse = await response.json()

    if (!response.ok || data.error) {
      const code = data.error?.code || response.status
      const message = data.error?.message || 'Неизвестная ошибка'
      let msg = 'Произошла ошибка.'

      switch (code) {
        case 401:
          msg = 'Пользователь не найден (неверный API-ключ).'
          break
        case 402:
          msg = 'Недостаточно кредитов на аккаунте.'
          break
        case 403:
          msg = 'Доступ запрещён.'
          break
        case 429:
          msg = 'Слишком много запросов. Попробуйте позже.'
          break
        case 500:
        case 502:
        case 503:
          msg = 'Сервер временно недоступен. Повторите попытку позже.'
          break
        default:
          msg = `Ошибка ${code}: ${message}.`
      }

      store.localizedError = msg
      return null
    }

    return data.choices[0]?.message?.content || null
  } catch (error) {
    console.error(error)
    store.localizedError = 'Не удалось отправить сообщение. Попробуйте позже.'
    return null
  }
}
