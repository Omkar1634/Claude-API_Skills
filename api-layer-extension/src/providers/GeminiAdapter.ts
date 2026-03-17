import { ProviderAdapter } from './ProviderManager';

export class GeminiAdapter implements ProviderAdapter {
  constructor(private apiKey: string) {}

  async generate(prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 8000 },
      }),
    });
    const data = await res.json() as any;
    if (!res.ok) { throw new Error(data.error?.message || 'Gemini API error'); }
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async testConnection(): Promise<boolean> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
      const res = await fetch(url);
      return res.ok;
    } catch { return false; }
  }
}
