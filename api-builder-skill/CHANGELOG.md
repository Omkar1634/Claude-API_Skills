# Changelog

All notable changes to the API Builder Skill are documented here.

Versioning follows [Semantic Versioning](https://semver.org/):
- **Major** — breaking changes to the conversational flow or phase structure
- **Minor** — new framework support, new feature options, or new phase additions
- **Patch** — wording fixes, clarifications, small corrections

---

## [v0.3.0] — 2026-03-15

### Added
- Button visual hierarchy — Continue is bright purple with glow, Back is ghost/muted, Generate is full-width green. Users can no longer confuse which to click.
- sendPrompt() generation — wizard sends full config to Claude in chat instead of calling Anthropic API directly. No CORS issues, no external API calls, works everywhere.

### Fixed
- CORS error on generation — was calling api.anthropic.com directly from artifact sandbox (blocked). Now uses sendPrompt() to pass config to Claude who generates inline.
- Back button was same visual weight as Continue — now clearly secondary (ghost style).

### Removed
- Direct Anthropic API fetch from artifact — replaced with sendPrompt() approach.
- View/Download file buttons from artifact — generation now happens in Claude chat where files can be copied directly.

### Changed
- Generation model changed from artifact-renders-output to wizard-collects-config + Claude-generates-in-chat
- Works identically in claude.ai browser, mobile app, and Claude Code terminal — no new windows opened
- SKILL.md description updated to reflect sendPrompt approach

### Why
- Direct API calls from artifacts are blocked by CORS in claude.ai sandbox
- sendPrompt() is the correct pattern for artifact-to-Claude communication
- In-chat generation keeps full conversation context — Claude can answer follow-up questions about the generated code immediately
- Clearer button hierarchy reduces user confusion about which button to click

---

## [v0.2.0] — 2026-03-15

### Added
- Interactive wizard artifact replacing conversational Q&A flow
- Clickable option cards for language, framework, database, auth, features
- Framework options dynamically shown based on selected language
- Pre-selected feature suggestions based on project context rules
- Folder structure shown before any file content
- View and Download buttons per generated file
- Download all button for complete project
- Claude API integration for accurate code generation
- Mid-project flow (Branch 1C) handled in artifact Step 1

### Removed
- Experience level question (removed per user feedback)
- Inline code dumps in chat — replaced with view/download artifact UI
- Conversational one-question-at-a-time flow — replaced with wizard artifact

### Changed
- Delivery method changed from Approach B inline text to interactive artifact with API calls
- SKILL.md description updated to reflect artifact launch on trigger
- Version bumped to v0.2.0 (minor — significant UX change)

### Why
- User testing showed conversational flow was slow and error-prone
- Clickable options prevent invalid inputs (e.g. typos in framework names)
- Artifact with API call produces more accurate, token-powered results
- View/download UX is cleaner than scrolling through long code blocks in chat

---

## [v0.1.1] — 2026-03-15

### Added
- YAML frontmatter (`name:` and `description:`) at top of SKILL.md — required for Claude to auto-trigger the skill
- Phase 1 Branch C — mid-project handling (e.g. user has a frontend but empty backend). Claude acknowledges existing context and proceeds without asking for non-existent code
- Phase 3 language-to-framework mapping table — concrete suggestions per language (Python, JS, TS, C#, Java, Go, PHP, Ruby)
- Phase 4 concrete feature suggestion rules — decision table mapping project context to pre-suggested features
- Phase 6 full layered folder structure matching the designed architecture (`app/api/v1/endpoints/`, `app/core/`, `app/services/`, `app/db/`, `app/models/`, `app/schemas/`, `tests/`)
- TESTING.md — mid-project scenario test cases
- TESTING.md — unsupported language test cases (C#, Go, Ruby etc.)

### Changed
- Phase 6 output changed from flat file list to proper layered FastAPI project structure
- Phase 4 feature suggestion changed from vague "suggest based on description" to explicit rule-based logic

### Why
Review of v0.1.0 identified: missing YAML frontmatter (skill would never auto-trigger), missing mid-project branch (the most common real-world scenario), vague framework suggestion logic, flat folder structure not matching the designed architecture, and incomplete test cases.

---

## [v0.1.0] — 2026-03-15

### Added
- Initial 7-phase conversational flow (Trigger → Follow-Up Loop)
- Phase 0: Skill trigger detection from natural language phrases
- Phase 1: Scratch vs. existing project branching
- Phase 1B: Existing project flow with explicit permission gate before reading code, implementation plan review, and delivery method choice
- Phase 2: Project understanding questions (description, entities, API consumers)
- Phase 3: Technical preference collection — language, framework, database, auth, experience level — one question at a time
- Phase 4: Feature selection with pre-suggestions based on project description
- Phase 5: Full configuration summary and user confirmation before any code generation
- Phase 6: Inline code generation using real entity names — no placeholders
- Phase 7: Follow-up loop for adding endpoints, generating tests, showing OpenAPI spec, and adding Docker support
- Core rules enforced: one question at a time, no framework assumptions, permission before reading code, plan before editing, real names in generated code
- v1 supported stack: Python / FastAPI / SQLite / JWT / inline code blocks
- Graceful handling for unsupported frameworks
- `SKILL.md` — full skill specification
- `TESTING.md` — manual testing checklist
- `README.md` — user-facing overview
- `versions/v0.1.0-SKILL.md` — versioned snapshot of SKILL.md
- `test-conversations/` — directory for storing test conversation logs

### Why
First release. Establishes the full conversational architecture and v1 scope for the API Builder Skill.
