const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

// Fallback chain — try in order if upstream rate-limits
const MODELS = [
  'openai/gpt-oss-120b:free',
  'openai/gpt-oss-20b:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-3-27b-it:free',
];

const SYSTEM_PROMPT = `You are an expert senior software engineer and code reviewer.
Analyze the provided code and return a structured JSON response ONLY (no markdown, no explanation outside JSON).

The response must be a valid JSON object with this exact shape:
{
  "summary": "2-3 sentence overall assessment of the code",
  "score": 85,
  "language": "detected language",
  "bugs": [
    {
      "severity": "high|medium|low",
      "line": 12,
      "title": "Short title",
      "description": "Detailed explanation of the bug",
      "fix": "How to fix it with example if possible"
    }
  ],
  "performance": [
    {
      "severity": "high|medium|low",
      "title": "Short title",
      "description": "Performance issue details",
      "suggestion": "Optimization suggestion"
    }
  ],
  "security": [
    {
      "severity": "high|medium|low",
      "title": "Short title",
      "description": "Security vulnerability details",
      "fix": "How to remediate"
    }
  ],
  "improvements": [
    "General improvement suggestion 1",
    "General improvement suggestion 2"
  ],
  "correctedCode": "the full corrected version of the submitted code with all bugs fixed, performance improved, and security issues resolved. Preserve the original structure and style. If the code is already perfect, return it unchanged."
}

Score rules: 90-100 excellent, 70-89 good, 50-69 fair, below 50 poor.
If there are no issues in a category, return an empty array for that category.
Return ONLY the JSON object. No markdown code fences.`;

async function callModel(model, messages) {
  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.2,
    max_tokens: 2000,
  });
  const content = completion?.choices?.[0]?.message?.content;
  if (!content || !content.trim()) {
    throw new Error(`Empty response from ${model}`);
  }
  return content.trim();
}

async function analyzeCode(code, language = 'auto') {
  const userMessage = language !== 'auto'
    ? `Language: ${language}\n\nCode:\n${code}`
    : `Code:\n${code}`;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ];

  let lastErr;
  for (const model of MODELS) {
    try {
      const rawText = await callModel(model, messages);
      const cleaned = rawText.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      lastErr = err;
      const status = err?.status;
      // Retry next model only on rate-limit / empty / 5xx
      if (status === 429 || status === 503 || status === 502 || /Empty response/.test(err?.message)) {
        console.warn(`[openrouter] model ${model} failed (${status || err.message}), trying next`);
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

module.exports = { analyzeCode };
