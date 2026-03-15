# Testing Checklist — API Builder Skill

Use this checklist to manually verify the skill behaves correctly across all phases and branches. Run through these checks after any change to SKILL.md before bumping the version.

---

## How to Test

Open a fresh conversation with Claude and activate the skill. Work through each scenario below, marking pass or fail. Log the conversation in `test-conversations/` for reference.

---

## Checklist

### Trigger

- [ ] Skill activates when user says "build an API"
- [ ] Skill activates when user says "create a backend"
- [ ] Skill activates when user says "scaffold my API"
- [ ] Skill activates from close natural language variations (e.g., "I want to set up a REST API")
- [ ] Skill does NOT activate on unrelated prompts (e.g., "explain what an API is")

---

### Phase 1 — Scratch vs. Existing vs. Mid-Project

- [ ] Claude asks whether the user is starting from scratch or has an existing project
- [ ] "Scratch" path proceeds directly to Phase 2 without asking for code
- [ ] "Existing" path triggers Phase 1B flow
- [ ] "Mid-project" path (e.g. "I have a frontend but empty backend") is handled correctly — Claude acknowledges what exists, asks what the API needs to do, and proceeds to Phase 2 without asking for existing code
- [ ] Claude references the existing frontend/context when making suggestions (e.g. CORS, matching data shape)

---

### Phase 1B — Existing Project Flow

- [ ] Claude asks explicit permission before reading or referencing any code
- [ ] Claude does NOT read or reference files before permission is granted
- [ ] After code is shared, Claude presents an implementation plan before making any suggestions or edits
- [ ] Claude asks the user to confirm the plan before proceeding
- [ ] Claude asks whether the user wants edits made directly or code blocks to copy in

---

### Phase 2 — Project Understanding

- [ ] Claude asks "What are you building?" first
- [ ] Claude waits for a response before asking about entities
- [ ] Claude asks about main entities second
- [ ] Claude waits for a response before asking about API consumers
- [ ] Claude asks who will call the API third
- [ ] Only one question appears per message throughout Phase 2

---

### Phase 3 — Technical Preferences

- [ ] Claude asks about programming language before asking about framework
- [ ] Claude waits for the language response before suggesting frameworks
- [ ] Framework options offered are relevant to the chosen language
- [ ] Claude asks about database after framework is chosen
- [ ] Claude asks about auth method after database is chosen
- [ ] Claude asks about experience level last
- [ ] Only one question appears per message throughout Phase 3

---

### Unsupported Framework / Language Handling

- [ ] If user picks an unsupported language (e.g. C#, Go, Ruby), Claude does not crash or refuse
- [ ] Claude informs the user the language/framework is outside v1 scope
- [ ] Claude offers to continue with a general structure or switch to a supported option
- [ ] Claude does not assume FastAPI if user picks something else
- [ ] If user picks a supported language (Python) but unsupported framework (Flask), Claude handles gracefully
- [ ] Claude never makes the user feel bad for picking an unsupported option

---

### Phase 4 — Feature Selection

- [ ] Claude pre-suggests features based on the project description (not a generic list every time)
- [ ] Claude presents features as a checklist or clear options
- [ ] Claude does not ask about all features in one overwhelming dump
- [ ] User can add, skip, or modify feature selections

---

### Phase 5 — Confirm Summary

- [ ] Claude plays back the full configuration before generating code
- [ ] Summary includes: project description, entities, API consumers, language, framework, database, auth method, experience level, selected features
- [ ] Claude does NOT generate any code until the user explicitly confirms
- [ ] User can request changes and Claude updates the summary before re-confirming

---

### Phase 6 — Code Generation

- [ ] Generated code uses the real entity names the user provided (not "MyModel", "YourEntity", etc.)
- [ ] All required files are generated: `main.py`, `models.py`, `schemas.py`, `routers/`, `auth.py`, `database.py`, `requirements.txt`
- [ ] Docker files generated if Docker was selected
- [ ] OpenAPI note included if OpenAPI was selected
- [ ] Generated project runs without errors (manual verification: copy output, run `uvicorn main:app --reload`)
- [ ] No `TODO` comments or placeholder values in generated code
- [ ] Dependencies in `requirements.txt` are pinned to specific versions

---

### Phase 7 — Follow-Up Loop

- [ ] After generation, Claude offers follow-up options (add endpoint, generate tests, show OpenAPI spec, add Docker, other)
- [ ] Selecting "Add a new endpoint" prompts Claude to ask what endpoint to add, then generates it
- [ ] Selecting "Generate tests" produces working test code for the generated project
- [ ] Selecting "Show the OpenAPI spec" produces or explains how to access the spec
- [ ] After completing a follow-up action, Claude returns to the follow-up menu
- [ ] Loop continues until the user is done

---

## Notes

Record any failures, edge cases, or unexpected behavior here, and open a fix before the next release.
