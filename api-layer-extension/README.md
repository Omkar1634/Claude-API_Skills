# API Layer — VS Code Extension

Scaffold a complete backend API project using AI — right inside VS Code. Choose your framework, database, auth, and features through a guided 10-step wizard. Files are written directly to your workspace.

---

## Features

- **10-step guided wizard** — runs as a VS Code panel, no browser needed
- **4 AI providers** — Claude, ChatGPT, Gemini, Ollama (local, no API key)
- **8 languages** — Python, JavaScript, TypeScript, C#, Java, Go, PHP, Ruby
- **Multiple frameworks** — FastAPI, Express, NestJS, ASP.NET Core, Spring Boot, Gin, Laravel and more
- **Output options** — write to current workspace or pick any folder
- **Secure key storage** — API keys stored in VS Code SecretStorage (OS keychain), never in settings.json

---

## Getting Started

1. Install the extension
2. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Run **API Layer: Create Project**
4. Choose your AI provider and paste your API key (or pick Ollama for local/free)
5. Fill in the 10-step wizard
6. Hit **Generate** — files are written to your folder

---

## Commands

| Command | Description |
|---|---|
| `API Layer: Create Project` | Open the wizard and scaffold a new API |
| `API Layer: Change AI Provider` | Switch between Claude, ChatGPT, Gemini, Ollama |
| `API Layer: Test Connection` | Verify your API key works |
| `API Layer: Select Ollama Model` | Pick which local Ollama model to use |

You can also right-click any folder in the Explorer and select **API Layer: Create Project** to scaffold directly into that folder.

---

## AI Providers

| Provider | Model | API Key | Cost |
|---|---|---|---|
| **Claude** | claude-sonnet-4 | Required | Paid |
| **ChatGPT** | gpt-4o | Required | Paid |
| **Gemini** | gemini-1.5-pro | Required | Free tier available |
| **Ollama** | codellama / deepseek-coder | Not needed | Free — runs locally |

### Ollama Setup
1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull a code model: `ollama pull codellama`
3. Select Ollama as your provider in the extension

---

## Version

**v0.1.0** — Initial release
