// ---------------------------------------------------------------------------
// Provider abstraction
// ---------------------------------------------------------------------------

interface AIProvider {
  formatMessage: (text: string, intent?: string) => Promise<string>;
}

// ---------------------------------------------------------------------------
// Gemini provider (default)
// ---------------------------------------------------------------------------

// EXPO_PUBLIC_ vars are injected into the JS bundle by Metro at build time.
// Changing .env + restarting Metro with --clear picks up the new value.
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Debug: log key status at module load (value is masked for safety)
if (__DEV__) {
  const keyStatus = GEMINI_API_KEY
    ? `configured (${GEMINI_API_KEY.slice(0, 10)}...)`
    : "NOT configured";
  console.log(`[AI] Gemini API key: ${keyStatus}`);
}

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_PROMPT = [
  "You are a chat message formatter for a Slack-style messaging app.",
  "The user gives you a short draft or idea and an optional tone/intent.",
  "",
  "Rules:",
  "- Output a SHORT, natural chat message — 1 to 3 sentences max.",
  "- Write like a real person typing in Slack or iMessage, not an email.",
  "- NEVER include a subject line, greeting, sign-off, or signature.",
  "- NEVER use placeholders like [Your Name] or [Date] — leave those details out if not provided.",
  "- Match the requested tone (professional, casual, friendly, etc.) but keep it conversational.",
  "- Even 'professional' means polished chat, NOT a formal letter or email.",
  "- Only return the final message text — no quotes, no explanation, no preamble.",
].join("\n");

const geminiProvider: AIProvider = {
  formatMessage: async (text, intent) => {
    if (!GEMINI_API_KEY) {
      throw new Error(
        "Gemini API key not configured. Copy .env.example to .env and add your key.",
      );
    }

    const userPrompt = intent
      ? `Tone/intent: ${intent}\n\nMessage to format:\n${text}`
      : `Message to format:\n${text}`;

    if (__DEV__) {
      console.log(
        `[AI] Sending request to Gemini — intent: ${intent ?? "(none)"}`,
      );
    }

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: userPrompt }] }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      if (__DEV__) {
        console.error(`[AI] Gemini error ${response.status}:`, errorBody);
      }
      if (response.status === 429) {
        throw new Error(
          "Rate limit reached. Please wait a moment and try again.",
        );
      }
      throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
      throw new Error("No response from Gemini");
    }

    if (__DEV__) {
      console.log(`[AI] Response received (${result.length} chars)`);
    }

    return result.trim();
  },
};

// ---------------------------------------------------------------------------
// Active provider — swap this to use a different model
// ---------------------------------------------------------------------------

const activeProvider: AIProvider = geminiProvider;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function formatMessage(text: string, intent?: string): Promise<string> {
  return activeProvider.formatMessage(text, intent);
}

/**
 * Lightweight connectivity check — hits the model metadata endpoint
 * (no quota usage, no generation). Returns true if API key is valid
 * and the Gemini service is reachable.
 */
export async function checkConnection(): Promise<boolean> {
  if (!GEMINI_API_KEY) return false;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash?key=${GEMINI_API_KEY}`,
    );
    return res.ok;
  } catch {
    return false;
  }
}
