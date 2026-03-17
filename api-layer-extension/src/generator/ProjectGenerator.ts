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
1. Use REAL entity names from the entities list
2. Every file must be COMPLETE and runnable
3. Include ALL files needed to run the project

Output this exact JSON structure and nothing else:
{
  "folder_structure": "complete folder tree using box-drawing characters",
  "files": {
    "path/to/file.ext": "complete file content here"
  }
}`;
  }

  buildStructurePrompt(config: ProjectConfig): string {
    return `Output ONLY a JSON object. No text before or after.

List the files needed for a ${config.language} ${config.framework} API with these entities: ${config.entities}
Database: ${config.database}, Auth: ${config.auth}

Output ONLY this JSON:
{
  "folder_structure": "folder tree using box-drawing characters",
  "files": ["path/to/file1.ext", "path/to/file2.ext"]
}`;
  }

  buildFilePrompt(filePath: string, config: ProjectConfig): string {
    return `Write the complete content for the file "${filePath}" in a ${config.language} ${config.framework} project.
Description: ${config.description}
Entities: ${config.entities}
Database: ${config.database}, Auth: ${config.auth}
Use real entity names. Output only the file content, no explanation:`;
  }

  async generate(config: ProjectConfig): Promise<GeneratedProject> {
    const prompt = this.buildPrompt(config);
    const raw = await this.adapter.generate(prompt);

    try {
      const parsed = this.extractJson(raw);
      if (parsed.files && Object.keys(parsed.files).length > 0) {
        return {
          folderStructure: parsed.folder_structure || '',
          files: parsed.files || {},
        };
      }
    } catch {}

    // Fallback — two-phase generation for models like codellama
    return await this.generateTwoPhase(config);
  }

  private async generateTwoPhase(config: ProjectConfig): Promise<GeneratedProject> {
    // Phase 1 — get file list
    const structureRaw = await this.adapter.generate(this.buildStructurePrompt(config));
    let fileList: string[] = [];
    let folderStructure = '';

    try {
      const parsed = this.extractJson(structureRaw);
      fileList = parsed.files || [];
      folderStructure = parsed.folder_structure || '';
    } catch {
      // Sensible default fallback for FastAPI
      fileList = [
        'app/__init__.py', 'app/main.py', 'app/config.py',
        'app/database.py', 'app/models.py', 'app/schemas.py',
        'app/auth.py', 'app/routers/__init__.py', 'app/routers/auth.py',
        'requirements.txt', '.env.example', 'README.md'
      ];
      folderStructure = fileList.join('\n');
    }

    // Phase 2 — generate each file individually (cap at 12)
    const files: Record<string, string> = {};
    for (const filePath of fileList.slice(0, 12)) {
      try {
        const content = await this.adapter.generate(this.buildFilePrompt(filePath, config));
        files[filePath] = content
          .replace(/^```[\w]*\n?/m, '')
          .replace(/```\s*$/m, '')
          .trim();
      } catch {
        files[filePath] = `# ${filePath}\n# Generation failed — please fill in manually`;
      }
    }

    return { folderStructure, files };
  }

  private extractJson(raw: string): any {
    // Strip markdown fences
    let clean = raw
      .replace(/^```json\s*/m, '')
      .replace(/^```\s*/m, '')
      .replace(/```\s*$/m, '')
      .trim();

    // Try parsing as-is first
    try { return JSON.parse(clean); } catch {}

    // Extract between first { and last }
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try { return JSON.parse(clean.substring(firstBrace, lastBrace + 1)); } catch {}
    }

    // Try fenced code block
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      try { return JSON.parse(fenceMatch[1].trim()); } catch {}
    }

    throw new Error('Could not extract valid JSON from AI response.');
  }

  async writeToFolder(project: GeneratedProject, targetFolder: string): Promise<string[]> {
    const written: string[] = [];

    for (const [filePath, content] of Object.entries(project.files)) {
      const fullPath = path.join(targetFolder, filePath);
      const dir = path.dirname(fullPath);

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
