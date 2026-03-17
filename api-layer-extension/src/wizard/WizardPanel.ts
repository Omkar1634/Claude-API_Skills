import * as vscode from 'vscode';
import { ProviderManager } from '../providers/ProviderManager';
import { ProjectGenerator, ProjectConfig } from '../generator/ProjectGenerator';
import { getWizardHtml } from './wizardHtml';

export class WizardPanel {
  public static currentPanel: WizardPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private disposables: vscode.Disposable[] = [];

  public static createOrShow(
    context: vscode.ExtensionContext,
    providerManager: ProviderManager,
    targetFolder?: string
  ) {
    const column = vscode.window.activeTextEditor?.viewColumn || vscode.ViewColumn.One;

    if (WizardPanel.currentPanel) {
      WizardPanel.currentPanel.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'apiLayerWizard',
      'API Layer — Create Project',
      column,
      { enableScripts: true, retainContextWhenHidden: true }
    );

    WizardPanel.currentPanel = new WizardPanel(panel, context, providerManager, targetFolder);
  }

  private constructor(
    panel: vscode.WebviewPanel,
    private context: vscode.ExtensionContext,
    private providerManager: ProviderManager,
    private targetFolder?: string
  ) {
    this.panel = panel;
    this.panel.webview.html = getWizardHtml();

    // Listen for messages from the webview
    this.panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case 'generate':
            await this.handleGenerate(message.config);
            break;
          case 'pickFolder':
            await this.handlePickFolder();
            break;
        }
      },
      null,
      this.disposables
    );

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
  }

  private async handleGenerate(config: ProjectConfig) {
    // Show progress in webview
    this.panel.webview.postMessage({ command: 'generationStarted' });

    try {
      // Get provider name for display
      const providerName = vscode.workspace.getConfiguration('apiLayer').get<string>('provider') || 'AI';

      this.panel.webview.postMessage({ command: 'generationStatus', message: `Calling ${providerName}...` });

      // Get adapter and generator
      const adapter = await this.providerManager.getAdapter();
      const generator = new ProjectGenerator(adapter);

      this.panel.webview.postMessage({ command: 'generationStatus', message: 'Generating project...' });

      const project = await generator.generate(config);

      // Pick output folder
      const outputFolder = await generator.pickOutputFolder(this.targetFolder);
      if (!outputFolder) {
        this.panel.webview.postMessage({ command: 'generationCancelled' });
        return;
      }

      this.panel.webview.postMessage({ command: 'generationStatus', message: 'Writing files...' });

      const written = await generator.writeToFolder(project, outputFolder);

      // Open the folder in VS Code
      const folderUri = vscode.Uri.file(outputFolder);
      await vscode.commands.executeCommand('vscode.openFolder', folderUri, { forceNewWindow: false });

      // Send success back to webview
      this.panel.webview.postMessage({
        command: 'generationComplete',
        folderStructure: project.folderStructure,
        fileCount: written.length,
        outputFolder,
      });

      vscode.window.showInformationMessage(
        `API Layer: Project ready — ${written.length} files written to ${outputFolder}`,
        'Open Terminal'
      ).then(action => {
        if (action === 'Open Terminal') {
          const terminal = vscode.window.createTerminal({ name: 'API Layer', cwd: outputFolder });
          terminal.show();
        }
      });

    } catch (err: any) {
      this.panel.webview.postMessage({ command: 'generationError', message: err.message });
      vscode.window.showErrorMessage(`API Layer: Generation failed — ${err.message}`);
    }
  }

  private async handlePickFolder() {
    const uri = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: 'Select folder',
    });
    if (uri?.[0]) {
      this.targetFolder = uri[0].fsPath;
      this.panel.webview.postMessage({ command: 'folderSelected', folder: this.targetFolder });
    }
  }

  public dispose() {
    WizardPanel.currentPanel = undefined;
    this.panel.dispose();
    this.disposables.forEach(d => d.dispose());
  }
}
