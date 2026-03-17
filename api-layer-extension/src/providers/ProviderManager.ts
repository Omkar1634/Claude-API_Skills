import * as vscode from 'vscode';
import { ClaudeAdapter } from './ClaudeAdapter';
import { ChatGPTAdapter } from './ChatGPTAdapter';
import { GeminiAdapter } from './GeminiAdapter';
import { OllamaAdapter } from './OllamaAdapter';

export interface ProviderAdapter {
  generate(prompt: string): Promise<string>;
  testConnection(): Promise<boolean>;
}

export type ProviderName = 'claude' | 'chatgpt' | 'gemini' | 'ollama';

const PROVIDER_LABELS: Record<ProviderName, string> = {
  claude:   '$(sparkle) Claude — Anthropic',
  chatgpt:  '$(robot) ChatGPT — OpenAI',
  gemini:   '$(star) Gemini — Google',
  ollama:   '$(home) Ollama — Local (no API key needed)',
};

export class ProviderManager {

  constructor(private context: vscode.ExtensionContext) {}

  async runSetup(): Promise<ProviderName | undefined> {
    const items = (Object.keys(PROVIDER_LABELS) as ProviderName[]).map(key => ({
      label: PROVIDER_LABELS[key],
      value: key,
    }));

    const picked = await vscode.window.showQuickPick(items, {
      title: 'API Layer — Choose your AI provider',
      placeHolder: 'Which AI provider do you want to use?',
      ignoreFocusOut: true,
    });

    if (!picked) { return undefined; }

    const provider = picked.value as ProviderName;
    await vscode.workspace.getConfiguration('apiLayer').update('provider', provider, true);

    if (provider === 'ollama') {
      await this.setupOllama();
    } else {
      await this.setupApiKey(provider);
    }

    return provider;
  }

  private async setupApiKey(provider: ProviderName): Promise<void> {
    const labels: Record<string, string> = {
      claude:  'Anthropic API key (from console.anthropic.com)',
      chatgpt: 'OpenAI API key (from platform.openai.com)',
      gemini:  'Google AI API key (from aistudio.google.com)',
    };

    const key = await vscode.window.showInputBox({
      title: `API Layer — ${labels[provider]}`,
      placeHolder: 'Paste your API key here',
      password: true,
      ignoreFocusOut: true,
    });

    if (key) {
      await this.context.secrets.store(`apiLayer.${provider}.key`, key);
      vscode.window.showInformationMessage(`API Layer: ${provider} connected successfully.`);
    }
  }

  private async setupOllama(): Promise<void> {
    const url = vscode.workspace.getConfiguration('apiLayer').get<string>('ollamaUrl') || 'http://localhost:11434';

    // Check if Ollama is running
    const running = await this.pingOllama(url);
    if (!running) {
      const action = await vscode.window.showWarningMessage(
        'Ollama is not running on your machine. Install it first.',
        'Open ollama.ai',
        'I already have it'
      );
      if (action === 'Open ollama.ai') {
        vscode.env.openExternal(vscode.Uri.parse('https://ollama.ai'));
      }
      return;
    }

    await this.selectOllamaModel();
    vscode.window.showInformationMessage('API Layer: Ollama connected successfully.');
  }

  async selectOllamaModel(): Promise<void> {
    const url = vscode.workspace.getConfiguration('apiLayer').get<string>('ollamaUrl') || 'http://localhost:11434';
    const models = await this.fetchOllamaModels(url);

    if (models.length === 0) {
      const action = await vscode.window.showWarningMessage(
        'No Ollama models found. Pull a model first.',
        'How to pull a model'
      );
      if (action === 'How to pull a model') {
        vscode.env.openExternal(vscode.Uri.parse('https://ollama.ai/library'));
      }
      return;
    }

    // Recommend code-specific models at the top
    const codeModels = ['codellama', 'deepseek-coder', 'codegemma', 'starcoder2'];
    const sorted = [
      ...models.filter(m => codeModels.some(c => m.toLowerCase().includes(c))).map(m => ({ label: `$(star) ${m}`, value: m, description: 'Recommended for code' })),
      ...models.filter(m => !codeModels.some(c => m.toLowerCase().includes(c))).map(m => ({ label: m, value: m })),
    ];

    const picked = await vscode.window.showQuickPick(sorted, {
      title: 'API Layer — Select Ollama model',
      placeHolder: 'Code-specific models give better results',
    });

    if (picked) {
      await vscode.workspace.getConfiguration('apiLayer').update('ollamaModel', picked.value, true);
    }
  }

  async getAdapter(): Promise<ProviderAdapter> {
    const provider = vscode.workspace.getConfiguration('apiLayer').get<ProviderName>('provider') || 'claude';

    switch (provider) {
      case 'claude': {
        const key = await this.context.secrets.get('apiLayer.claude.key') || '';
        return new ClaudeAdapter(key);
      }
      case 'chatgpt': {
        const key = await this.context.secrets.get('apiLayer.chatgpt.key') || '';
        return new ChatGPTAdapter(key);
      }
      case 'gemini': {
        const key = await this.context.secrets.get('apiLayer.gemini.key') || '';
        return new GeminiAdapter(key);
      }
      case 'ollama': {
        const url = vscode.workspace.getConfiguration('apiLayer').get<string>('ollamaUrl') || 'http://localhost:11434';
        const model = vscode.workspace.getConfiguration('apiLayer').get<string>('ollamaModel') || 'codellama';
        return new OllamaAdapter(url, model);
      }
    }
  }

  async testConnection(): Promise<void> {
    const provider = vscode.workspace.getConfiguration('apiLayer').get<ProviderName>('provider');
    if (!provider) {
      vscode.window.showWarningMessage('API Layer: No provider configured. Run "API Layer: Change AI Provider" first.');
      return;
    }

    await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `API Layer: Testing ${provider} connection...` }, async () => {
      try {
        const adapter = await this.getAdapter();
        const ok = await adapter.testConnection();
        if (ok) {
          vscode.window.showInformationMessage(`API Layer: ${provider} connection is working.`);
        } else {
          vscode.window.showErrorMessage(`API Layer: ${provider} connection failed. Check your API key.`);
        }
      } catch (e: any) {
        vscode.window.showErrorMessage(`API Layer: ${provider} error — ${e.message}`);
      }
    });
  }

  private async pingOllama(url: string): Promise<boolean> {
    try {
      const res = await fetch(`${url}/api/tags`);
      return res.ok;
    } catch {
      return false;
    }
  }

  private async fetchOllamaModels(url: string): Promise<string[]> {
    try {
      const res = await fetch(`${url}/api/tags`);
      const data = await res.json() as { models: { name: string }[] };
      return data.models.map(m => m.name);
    } catch {
      return [];
    }
  }
}
