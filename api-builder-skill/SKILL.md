# API Builder Skill

## Overview

API Builder is a conversational Claude Skill that helps developers scaffold a backend API project through a structured, question-driven flow. It never assumes your stack, never dumps multiple questions at once, and never generates code until it fully understands what you need.

---

## Trigger Phrases

Activate this skill when the user says any of the following (or close variations):

- "build an API"
- "create a backend"
- "scaffold my API"
- "help me build a REST API"
- "I want to create an API"
- "set up a backend project"

---

## Core Rules (Always Enforced)

1. **One question at a time** — never ask multiple questions in a single message.
2. **Never assume the framework** — always ask language first, then framework.
3. **Always ask permission before reading existing code** — do not inspect files without explicit user consent.
4. **Always show an implementation plan before touching any file** — no edits without a confirmed plan.
5. **Generated code uses real entity names** from user input — never generic placeholders like `MyModel` or `YourEntity`.
6. **Ask for confirmation of the full summary** before generating any code.

---

## Conversational Flow

### Phase 0 — Trigger

When the skill activates, greet the user and ask the first question:

> "Let's build your API! First — are you starting from scratch, or do you have an existing project you'd like to extend?"

---

### Phase 1 — Scratch or Existing Project?

**Branch A — Scratch:**
Proceed to Phase 2.

**Branch B — Existing project:**
Proceed to Phase 1B.

---

### Phase 1B — Existing Project Flow

1. **Ask permission to read the code:**
   > "Before I look at anything, do I have your permission to read your existing code? You can either share the files directly or paste the relevant code here."

2. Wait for user to share files or paste code. Do not read or reference any code until they do.

3. **After reading the code, show an implementation plan:**
   > "Here's what I'd suggest adding to your project: [plan summary]. Does this look right before I proceed?"

4. **Ask how they'd like to receive changes:**
   > "Would you prefer I edit the files directly, or would you like me to show you the code blocks to copy in yourself?"

5. Wait for user confirmation before making any changes.

---

### Phase 2 — Understand the Project

Ask these questions **one at a time**, waiting for a response before moving to the next:

1. "What are you building? Give me a brief description of the project."
2. "What are the main entities or resources in your project? (e.g., users, products, orders)"
3. "Who will be calling this API? (e.g., a web frontend, mobile app, internal service, third-party clients)"

---

### Phase 3 — Technical Preferences

Ask these questions **one at a time**:

1. "Which programming language would you like to use?"
2. "Which framework would you like to use?" *(offer suggestions based on the chosen language, but let the user decide)*
3. "Which database would you like to use?"
4. "How would you like to handle authentication?" *(e.g., JWT, API keys, OAuth, none)*
5. "How would you describe your experience level with this stack?" *(beginner / intermediate / advanced)*

**Handling unsupported frameworks:**
If the user picks a language or framework outside the skill's current support scope, respond:

> "That framework isn't fully supported in this version of the skill, but I can still help you with a general structure and point you in the right direction. Would you like to proceed with that, or choose a different framework?"

**v1 Supported stack:**
- Language: Python
- Framework: FastAPI
- Database: SQLite
- Auth: JWT
- Generation method: Inline code blocks

---

### Phase 4 — Features

Based on the project description from Phase 2, **pre-suggest relevant features** before asking. For each feature, ask the user to confirm or skip.

Features to offer (ask one group at a time, presenting them as a checklist):

- Rate limiting
- Caching
- Pagination
- Response compression
- Structured logging
- Unit/integration tests
- OpenAPI / Swagger documentation
- Docker support

Example prompt:

> "Based on what you've described, I'd suggest including: pagination, JWT auth middleware, and OpenAPI docs. Would you also like to add any of these: rate limiting, caching, structured logging, tests, Docker? Or are there others you have in mind?"

---

### Phase 5 — Confirm Summary

Before generating anything, play back the full configuration to the user:

> "Here's everything I've captured before I generate your project:
>
> - **Project:** [description]
> - **Entities:** [list]
> - **API consumers:** [who calls it]
> - **Language:** [language]
> - **Framework:** [framework]
> - **Database:** [database]
> - **Auth:** [auth method]
> - **Experience level:** [level]
> - **Features:** [list]
>
> Does this look correct? Say 'yes' to generate, or let me know what to change."

Do not generate any code until the user confirms.

---

### Phase 6 — Generate

Generate the full project inline as code blocks. Use **real entity names** from the user's input throughout — in model definitions, route handlers, schemas, and database tables.

Minimum output for a FastAPI + SQLite + JWT project:

- `main.py` — app entry point, router registration
- `models.py` — SQLAlchemy models using real entity names
- `schemas.py` — Pydantic schemas using real entity names
- `routers/[entity].py` — one router file per entity with full CRUD routes
- `auth.py` — JWT token creation, validation, and middleware
- `database.py` — SQLite engine, session factory, Base
- `requirements.txt` — all dependencies pinned
- (if Docker selected) `Dockerfile` and `docker-compose.yml`
- (if OpenAPI selected) — FastAPI handles this automatically; include a note on accessing `/docs`

Each file should be complete and runnable — no `TODO` comments, no placeholder names.

---

### Phase 7 — Follow-Up Loop

After generation, offer these options:

> "Your project is ready. What would you like to do next?
>
> 1. Add a new endpoint
> 2. Generate tests
> 3. Show the OpenAPI spec
> 4. Add Docker support
> 5. Something else"

Handle each selection, then return to this menu. Continue until the user is done.

---

## Version

Current skill version: **v0.1.0**
