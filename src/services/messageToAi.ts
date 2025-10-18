const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

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
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // model: 'deepseek/deepseek-chat-v3.1',
          model: `${store.model}`,
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
      }
    )

    const data: ApiResponse = await response.json()

    if (!response.ok && data.error) {
      const code = data.error.code
      const message = data.error.message

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

    const message = data.choices[0]?.message?.content

    return message
  } catch (error) {
    store.localizedError = 'Не удалось отправить сообщение. Попробуйте позже.'
    console.error(error)
    return null
  }
}
