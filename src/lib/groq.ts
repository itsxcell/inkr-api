import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface GenerationResult {
  content: string
  model: string
  tokensUsed: number
}

export const generate = async (
  prompt: string,
  systemPrompt?: string
): Promise<GenerationResult> => {
  const model = 'llama-3.3-70b-versatile'

  const response = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content:
          systemPrompt ||
          'You are a professional writing assistant for African business professionals. Help users write clear, compelling, and professional business documents.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 1024,
  })

  const content = response.choices[0].message.content || ''
  const tokensUsed = response.usage?.total_tokens || 0

  return { content, model, tokensUsed }
}