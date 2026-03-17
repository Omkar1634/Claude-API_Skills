import * as vscode from 'vscode';
import { WizardPanel } from './wizard/WizardPanel';
import { ProviderManager } from './providers/ProviderManager';

export function activate(context: vscode.ExtensionContext) {

  const providerManager = new ProviderManager(context);

  // Command: Create Project
  context.subscriptions.push(
    vscode.commands.registerCommand('api-layer.createProject', async (uri?: vscode.Uri) => {
      const targetFolder = uri?.fsPath || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

      // First launch — if no provider set, run setup first
      const provider = vscode.workspace.getConfiguration('apiLayer').get<string>('provider');
      if (!provider) {
        const selected = await providerManager.runSetup();
        if (!selected) { return; }
      }

      WizardPanel.createOrShow(context, providerManager, targetFolder);
    })
  );

  // Command: Change Provider
  context.subscriptions.push(
    vscode.commands.registerCommand('api-layer.changeProvider', async () => {
      await providerManager.runSetup();
    })
  );

  // Command: Test Connection
  context.subscriptions.push(
    vscode.commands.registerCommand('api-layer.testConnection', async () => {
      await providerManager.testConnection();
    })
  );

  // Command: Select Ollama Model
  context.subscriptions.push(
    vscode.commands.registerCommand('api-layer.selectOllamaModel', async () => {
      await providerManager.selectOllamaModel();
    })
  );
}

export function deactivate() {}
