const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
  ]
}

Score rules: 90-100 excellent, 70-89 good, 50-69 fair, below 50 poor.
If there are no issues in a category, return an empty array for that category.
Return ONLY the JSON object. No markdown code fences.`;

async function analyzeCode(code, language = 'auto') {
  const userMessage = language !== 'auto'
    ? `Language: ${language}\n\nCode:\n${code}`
    : `Code:\n${code}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: userMessage,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
      maxOutputTokens: 2000,
    },
  });

  const rawText = response.text.trim();

  // Strip code fences if model adds them
  const cleaned = rawText.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
  const result = JSON.parse(cleaned);

  return result;
}

module.exports = { analyzeCode };
