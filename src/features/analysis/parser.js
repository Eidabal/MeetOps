// Nettoie et parse le JSON renvoyé par Claude (avec extraction de secours).
export function parseAnalysisResult(buffer) {
  const clean = (buffer || "").replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* ignore */ }
    }
  }
  return null;
}
