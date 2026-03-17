import { ProviderAdapter } from './ProviderManager';

export class OllamaAdapter implements ProviderAdapter {
  constructor(private url: string, private model: string) {}

  async generate(prompt: string): Promise<string> {
    const res = await fetch(`${this.url}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
      }),
    });
    const data = await res.json() as any;
    if (!res.ok) { throw new Error(data.error || 'Ollama error'); }
    return data.response || '';
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${this.url}/api/tags`);
      return res.ok;
    } catch { return false; }
  }
}
