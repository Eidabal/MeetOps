// Helpers d'appel à l'API Anthropic.
//
// ⚠️ ARCHITECTURE — cf. CLAUDE.md : en production, ces appels DOIVENT passer par une
// Supabase Edge Function pour ne jamais exposer ANTHROPIC_API_KEY côté client.
// L'appel direct ci-dessous fonctionne uniquement dans l'environnement d'artifact Claude
// (clé injectée). Remplacer l'URL par `${SUPABASE_URL}/functions/v1/analyze-meeting`.
const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

// Appel non-streamé : renvoie le texte de la première réponse.
export async function callClaude({ prompt, maxTokens = 1000 }) {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!resp.ok) throw new Error(`API ${resp.status}`);
  const data = await resp.json();
  return data.content?.[0]?.text || "";
}

// Appel streamé (SSE). Invoque les callbacks au fil des événements.
export async function streamClaude({
  prompt,
  maxTokens = 2000,
  isCancelled = () => false,
  onOpen,
  onText,
  onInputTokens,
  onOutputTokens,
}) {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!resp.ok) throw new Error(`API ${resp.status}`);
  onOpen?.();

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();

  while (!isCancelled()) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") continue;
      try {
        const evt = JSON.parse(data);
        if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
          onText?.(evt.delta.text);
        } else if (evt.type === "message_start") {
          onInputTokens?.(evt.message?.usage?.input_tokens || 0);
        } else if (evt.type === "message_delta") {
          onOutputTokens?.(evt.usage?.output_tokens || 0);
        }
      } catch { /* ignore malformed SSE line */ }
    }
  }
}
