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
    return `You are a backend code generator. Output ONLY a JSON object. No introduction, no explanation, no markdown, no text before or after the JSON.

Project specifications:
- Type: ${config.type}
- Description: ${config.description}
- Entities: ${config.entities}
- API consumers: ${config.consumers.join(', ')}
- Language: ${config.language}
- Framework: ${config.framework}
- Database: ${config.database}
- Auth: ${config.auth}
- Features: ${config.features.join(', ')}

Rules:
1. Use REAL entity names from the entities list — never "MyModel" or placeholders
2. Every file must be COMPLETE and runnable — no TODO comments
3. Include ALL files needed to run the project

Output this exact JSON structure and nothing else:
{
  "folder_structure": "complete folder tree using box-drawing characters (├── └── │)",
  "files": {
    "path/to/file.ext": "complete file content here",
    "path/to/other.ext": "complete file content here"
  }
}

START JSON OUTPUT NOW:`;
  }

  async generate(config: ProjectConfig): Promise<GeneratedProject> {
    const prompt = this.buildPrompt(config);
    const raw = await this.adapter.generate(prompt);

    const parsed = this.extractJson(raw);

    return {
      folderStructure: parsed.folder_structure || '',
      files: parsed.files || {},
    };
  }

  private extractJson(raw: string): any {
    // Strip markdown fences
    let clean = raw
      .replace(/^```json\s*/m, '')
      .replace(/^```\s*/m, '')
      .replace(/```\s*$/m, '')
      .trim();

    // Try parsing as-is first
    try {
      return JSON.parse(clean);
    } catch {}

    // Ollama often adds conversational text before/after the JSON
    // Find the first { and last } and extract just that block
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonCandidate = clean.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch {}
    }

    // Last resort — try to find a JSON block inside markdown code fences
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      try {
        return JSON.parse(fenceMatch[1].trim());
      } catch {}
    }

    throw new Error(`Could not extract valid JSON from AI response. The model may need a stronger prompt. Try switching to codellama or deepseek-coder in Ollama settings.`);
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
