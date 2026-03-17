import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ProviderAdapter } from '../providers/ProviderManager';

export interface ProjectConfig {
  type: string;
  description: string;
  entities: string;
  consumers: string[];
  language: string;
  framework: string;
  database: string;
  auth: string;
  features: string[];
}

export interface GeneratedProject {
  folderStructure: string;
  files: Record<string, string>;
}

export class ProjectGenerator {

  constructor(private adapter: ProviderAdapter) {}

  buildPrompt(config: ProjectConfig): string {
    return `You are an expert backend developer. Generate a complete, production-ready backend API project.

Specifications:
- Project type: ${config.type}
- Description: ${config.description}
- Entities: ${config.entities}
- API consumers: ${config.consumers.join(', ')}
- Language: ${config.language}
- Framework: ${config.framework}
- Database: ${config.database}
- Auth: ${config.auth}
- Features: ${config.features.join(', ')}

CRITICAL RULES:
1. Use REAL entity names from the entities list throughout — never "MyModel" or placeholders
2. Every file must be COMPLETE and immediately runnable — no TODO comments
3. Include ALL files needed to run the project from scratch
4. Use the framework's best practices and conventions

Return ONLY a valid JSON object (no markdown fences, no explanation) with this exact structure:
{
  "folder_structure": "complete folder tree using box-drawing characters",
  "files": {
    "path/to/file.ext": "complete file content",
    "path/to/other.ext": "complete file content"
  }
}`;
  }

  async generate(config: ProjectConfig): Promise<GeneratedProject> {
    const prompt = this.buildPrompt(config);
    const raw = await this.adapter.generate(prompt);

    // Strip markdown fences if any provider wraps in them
    const clean = raw.replace(/^```json\s*/m, '').replace(/^```\s*/m, '').replace(/```\s*$/m, '').trim();
    const parsed = JSON.parse(clean);

    return {
      folderStructure: parsed.folder_structure || '',
      files: parsed.files || {},
    };
  }

  async writeToFolder(project: GeneratedProject, targetFolder: string): Promise<string[]> {
    const written: string[] = [];

    for (const [filePath, content] of Object.entries(project.files)) {
      const fullPath = path.join(targetFolder, filePath);
      const dir = path.dirname(fullPath);

      // Create nested directories
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(fullPath, content, 'utf8');
      written.push(fullPath);
    }

    return written;
  }

  async pickOutputFolder(workspaceFolder?: string): Promise<string | undefined> {
    const options: vscode.QuickPickItem[] = [];

    if (workspaceFolder) {
      options.push({
        label: '$(folder-active) Write to current workspace',
        description: workspaceFolder,
      });
    }

    options.push({
      label: '$(folder-opened) Browse and pick a folder',
      description: 'Choose where to save the project',
    });

    const picked = await vscode.window.showQuickPick(options, {
      title: 'API Layer — Where should I write the project?',
      ignoreFocusOut: true,
    });

    if (!picked) { return undefined; }

    if (picked.label.includes('Browse')) {
      const uri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Select folder',
      });
      return uri?.[0]?.fsPath;
    }

    return workspaceFolder;
  }
}
