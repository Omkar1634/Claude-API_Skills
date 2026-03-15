# API Builder Skill

A Claude Skill that scaffolds a complete backend API project through an interactive step-by-step wizard — right inside your Claude chat. No new windows, no copy-pasting configs, no guessing what to type.

---

## How It Works

When you say **"build an API"**, an interactive wizard appears in the chat. You click through 10 steps selecting your stack — the wizard collects everything, shows a summary, and when you hit **Generate**, Claude builds your complete project inline with real entity names and runnable code.

Works in **claude.ai browser**, **Claude mobile app**, and **Claude Code terminal** — identically.

---

## How to Activate

Say any of the following in Claude:

```
"build an API"
"create a backend"
"scaffold my API"
"help me build a REST API"
"set up a backend project"
```

---

## The 10-Step Wizard

| Step | What You Choose |
|------|----------------|
| 1 — Start | From scratch / Mid-project / Existing API |
| 2 — Project | Short description of what you're building |
| 3 — Entities | Your real resource names (users, posts, orders...) |
| 4 — Consumers | Who calls the API — web, mobile, services |
| 5 — Language | Python / JavaScript / TypeScript / C# / Java / Go / PHP / Ruby |
| 6 — Framework | Options shown based on your language choice |
| 7 — Database | SQLite / PostgreSQL / MySQL / MongoDB |
| 8 — Auth | JWT / API Key / OAuth2 / Session / None |
| 9 — Features | OpenAPI, CORS, Logging, Rate Limiting, Pagination, Tests, Docker |
| 10 — Confirm | Full recap → hit Generate |

---

## What Gets Generated

Claude generates the complete project inline in chat:

- Full folder structure tree
- Every file with real code — no TODOs, no placeholders
- Real entity names throughout (your `posts.py`, not `resource.py`)
- How to run the project locally

### Example structure (FastAPI + SQLite + JWT)

```
my-api/
├── app/
│   ├── main.py              — app entry, middleware, startup
│   ├── config.py            — settings from .env
│   ├── dependencies.py      — shared DI (db session, current user)
│   ├── api/v1/
│   │   ├── router.py        — aggregates all routes
│   │   └── endpoints/       — one file per entity
│   ├── core/
│   │   ├── security.py      — JWT, password hashing
│   │   ├── exceptions.py    — global error handlers
│   │   └── logging.py       — structured logging
│   ├── db/
│   │   ├── session.py       — SQLAlchemy engine + session
│   │   └── base.py          — DeclarativeBase
│   ├── models/              — ORM table definitions per entity
│   ├── schemas/             — Pydantic request/response models
│   └── services/            — business logic per entity
├── tests/
├── .env.example
├── requirements.txt
└── README.md
```

---

## Supported Stack (v0.4.0)

| | Options |
|---|---|
| **Languages** | Python, JavaScript, TypeScript, C#, Java, Go, PHP, Ruby |
| **Frameworks** | FastAPI, Django REST, Flask, Express, Fastify, NestJS, ASP.NET Core, Spring Boot, Gin, Laravel, and more |
| **Databases** | SQLite, PostgreSQL, MySQL, MongoDB |
| **Auth** | JWT, API Key, OAuth2, Session, None |
| **Features** | OpenAPI/Swagger, CORS, Structured Logging, Rate Limiting, Pagination, Caching, Unit Tests, Docker |

---

## Installation

### Option 1 — Download and install manually

1. Download or clone this repo
2. Zip the `api-builder-skill/` folder
3. Go to **claude.ai → Settings → Capabilities → Skills**
4. Upload the ZIP
5. Say **"build an API"** in any chat

### Option 2 — Share with a friend

Send them this repo link. They follow the same 4 steps above to install in their own Claude account.

---

## After Generation

Once your project is generated, you can ask Claude follow-up questions in the same chat:

- "Add a search endpoint to posts"
- "Generate tests for the auth routes"
- "Add Docker support"
- "Show me the OpenAPI spec"
- "Add pagination to the posts list"

Claude keeps full context of the generated project throughout the conversation.

---

## Project Files

| File | Purpose |
|------|---------|
| `SKILL.md` | The skill definition — Claude reads this to run the wizard |
| `CHANGELOG.md` | Full version history with what changed and why |
| `TESTING.md` | Manual testing checklist — run after every update |
| `versions/` | Snapshot of SKILL.md at each version |
| `test-conversations/` | Saved test chat logs for regression testing |

---

## Known Issues & Fixes

### Python — passlib broken on Python 3.12+
If you're on Python 3.12 or above and see:
```
ValueError: password cannot be longer than 72 bytes
```
This is a known passlib bug. Fix: replace `passlib` with `bcrypt` directly in your project.
See `references/python-compatibility.md` for the exact code.

### Python — email-validator not installed
If you see `ImportError: email-validator is not installed`, run:
```cmd
pip install email-validator
```
Then restart the server.

---

| Version | What Changed |
|---------|-------------|
| v0.4.0 | White/black button style — fully visible on all displays |
| v0.3.0 | Generation via sendPrompt() — no CORS issues, works everywhere |
| v0.2.0 | Interactive wizard artifact replaces conversational Q&A |
| v0.1.1 | YAML frontmatter, mid-project branch, language→framework mapping |
| v0.1.0 | Initial release — 7-phase conversational flow |

See [CHANGELOG.md](./CHANGELOG.md) for full details.

---

## Current Version

**v0.4.0** — See [CHANGELOG.md](./CHANGELOG.md) for full history.
