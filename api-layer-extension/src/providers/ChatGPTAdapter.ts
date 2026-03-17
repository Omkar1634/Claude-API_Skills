import { ProviderAdapter } from './ProviderManager';

export class ChatGPTAdapter implements ProviderAdapter {
  constructor(private apiKey: string) {}

  async generate(prompt: string): Promise<string> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json() as any;
    if (!res.ok) { throw new Error(data.error?.message || 'OpenAI API error'); }
    return data.choices?.[0]?.message?.content || '';
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      });
      return res.ok;
    } catch { return false; }
  }
}
