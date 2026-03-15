# API Builder Skill

A conversational Claude Skill that helps developers scaffold a backend API project — without assumptions, without code dumps, and without skipping steps.

---

## What It Does

API Builder guides you through building a backend API one question at a time. It learns what you're building, what stack you want, and what features you need — then generates a complete, runnable project using your real entity names and requirements.

It works for both **new projects** (starting from scratch) and **existing projects** (reading your code and extending it safely).

---

## How to Activate

Start a conversation with Claude and say any of the following:

- "build an API"
- "create a backend"
- "scaffold my API"
- "help me build a REST API"
- "I want to set up a backend project"

---

## The 7-Phase Flow

| Phase | What Happens |
|-------|-------------|
| **0 — Trigger** | Skill activates from natural language |
| **1 — Start** | Scratch or existing project? |
| **1B — Existing** | Permission check → code review → implementation plan → confirmation |
| **2 — Project** | What are you building, what are the entities, who calls the API |
| **3 — Stack** | Language → framework → database → auth → experience level |
| **4 — Features** | Rate limiting, caching, pagination, logging, tests, OpenAPI, Docker |
| **5 — Confirm** | Full summary played back before any code is generated |
| **6 — Generate** | Complete, runnable project with real entity names |
| **7 — Follow-Up** | Add endpoints, generate tests, show OpenAPI spec — loops until done |

---

## What Gets Generated (v1 — FastAPI + SQLite + JWT)

- `main.py` — app entry point and router registration
- `models.py` — SQLAlchemy models with your entity names
- `schemas.py` — Pydantic request/response schemas
- `routers/[entity].py` — full CRUD routes per entity
- `auth.py` — JWT token creation and validation
- `database.py` — SQLite engine and session factory
- `requirements.txt` — pinned dependencies
- `Dockerfile` + `docker-compose.yml` *(if Docker selected)*

---

## Key Rules

- **One question at a time** — never overwhelms you with a form
- **Never assumes your framework** — always asks language first
- **Permission before reading code** — for existing projects only
- **Plan before editing** — shows what it will do before it does it
- **Real names, not placeholders** — generated code reflects your actual project

---

## v1 Supported Stack

| Dimension | v1 Support |
|-----------|-----------|
| Language | Python |
| Framework | FastAPI |
| Database | SQLite |
| Auth | JWT |
| API Type | REST |
| Generation | Inline code blocks |

Support for additional languages, frameworks, and databases will be added in future minor versions.

---

## Version

**v0.1.0** — See [CHANGELOG.md](./CHANGELOG.md) for full history.

---

## Testing

See [TESTING.md](./TESTING.md) for the manual testing checklist used to verify each release.
