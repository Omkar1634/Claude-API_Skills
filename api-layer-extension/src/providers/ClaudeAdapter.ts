import { ProviderAdapter } from './ProviderManager';

export class ClaudeAdapter implements ProviderAdapter {
  constructor(private apiKey: string) {}

  async generate(prompt: string): Promise<string> {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json() as any;
    if (!res.ok) { throw new Error(data.error?.message || 'Claude API error'); }
    return data.content?.[0]?.text || '';
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'hi' }],
        }),
      });
      return res.ok;
    } catch { return false; }
  }
}
