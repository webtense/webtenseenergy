interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

interface OpenRouterResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 15000);
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

async function callGemini(messages: OpenRouterMessage[]): Promise<string | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;

  const systemMsg = messages.find((m) => m.role === 'system');
  const conversationMsgs = messages.filter((m) => m.role !== 'system');

  const body: Record<string, unknown> = {
    contents: conversationMsgs.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    generationConfig: { responseMimeType: 'application/json' },
  };

  if (systemMsg) {
    body.systemInstruction = { parts: [{ text: systemMsg.content }] };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );
    if (!response.ok) return null;
    const payload = (await response.json()) as GeminiResponse;
    return payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function callOpenRouter(messages: OpenRouterMessage[]): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free';
  const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  const timeout = Number(process.env.OPENROUTER_TIMEOUT_MS || 60000);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://webtenseenergy.com',
        'X-Title': 'Webtense Energy Blog',
      },
      body: JSON.stringify({ model, messages }),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as OpenRouterResponse;
    return payload.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function generateWithOpenRouter(
  messages: OpenRouterMessage[]
): Promise<string | null> {
  // Intenta Gemini primero, luego OpenRouter como fallback
  const geminiResult = await callGemini(messages);
  if (geminiResult) return geminiResult;
  return callOpenRouter(messages);
}
