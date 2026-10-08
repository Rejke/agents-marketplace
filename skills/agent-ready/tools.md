# Outside tools

Checked by reading their READMEs and SKILL.md files (2026-10); run each
report-only first.

**Instruction files**

- **agnix** (`npx agnix .`): lints `CLAUDE.md`, `AGENTS.md`, `SKILL.md`, hook
  and MCP settings; `--fix` edits, so start with `--dry-run --show-fixes`.
- **docrot** (`npx docrot-cli`): dead links and anchors, `npm run x` with no
  script, across all markdown.
- **Claude Code `/doctor`** (alias `/checkup`): duplicated, derivable and
  contradictory instructions and unused skills; proposes before changing.

**Skills**

- **skill-creator** (`npx skills add anthropics/skills --skill skill-creator`):
  runs prompts with and without a skill and grades them; tunes the description.
  The way to prove a skill changes behaviour.
- **retro** (`npx skills add mattpocock/skills`, pick `retro`): after a session,
  ranks what to change in the agent's environment, preferring checks over
  prose; writes nothing.

**UI in an existing product** (they defer to the project's tokens)

- **better-\* and interface-review** (`npx skills add jakubkrehel/skills`).
- **impeccable** `polish`, `audit`, `critique` only (`npx impeccable install`);
  its `new-work`, `overdrive` and `bolder` replace the look.
- **web-design-guidelines** (`npx skills add vercel-labs/agent-skills`):
  aesthetic-neutral accessibility and interaction rules.

Skip for an existing design system: taste-skill, frontend-design and
ui-ux-pro-max's `--design-system` push a new aesthetic. Skip transcript
extractors that write unreviewed skills or send transcripts to a server
(claudeception, chat2skill).
