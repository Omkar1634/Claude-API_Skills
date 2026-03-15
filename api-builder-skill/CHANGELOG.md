# Changelog

All notable changes to the API Builder Skill are documented here.

Versioning follows [Semantic Versioning](https://semver.org/):
- **Major** — breaking changes to the conversational flow or phase structure
- **Minor** — new framework support, new feature options, or new phase additions
- **Patch** — wording fixes, clarifications, small corrections

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
