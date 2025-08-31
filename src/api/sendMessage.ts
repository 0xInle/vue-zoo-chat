const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

export async function sendMessageToAI(userMessage: string) {
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

  const data = await response.json()
  const message = data.choices[0]?.message?.content

  return message
}
