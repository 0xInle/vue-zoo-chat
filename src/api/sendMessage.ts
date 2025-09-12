const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

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

export type LocalizedError = {
  text: string
  type: 'error'
}

export async function sendMessageToAI(
  userMessage: string
): Promise<string | LocalizedError | null> {
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
          model: 'deepseek/deepseek-chat-v3.1:free',
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

      let localizedMessage = 'Произошла ошибка.'
      switch (code) {
        case 401:
          localizedMessage = 'Пользователь не найден (неверный API-ключ).'
          break
        case 402:
          localizedMessage = 'Недостаточно кредитов на аккаунте.'
          break
        case 403:
          localizedMessage = 'Доступ запрещён.'
          break
        case 429:
          localizedMessage = 'Слишком много запросов. Попробуйте позже.'
          break
        case 500:
        case 502:
        case 503:
          localizedMessage =
            'Сервер временно недоступен. Повторите попытку позже.'
          break
        default:
          localizedMessage = `Ошибка ${code}: ${message}.`
      }

      return {
        text: localizedMessage,
        type: 'error',
      }
    }

    const message = data.choices[0]?.message?.content

    return message
  } catch (error) {
    console.error(error)
    return null
  }
}
