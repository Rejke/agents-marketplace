---
name: agent-ready
description: Scaffold or optimize a repository's agent instructions, docs, skills and memory, holding every rule a tool can hold in lint, hooks or checks.
disable-model-invocation: true
---

# Agent-ready

An agent's output degrades with the text it carries. Every always-loaded line
spends tokens and attention on every turn, and prose that restates the code goes
stale while agents keep obeying it. The work is subtraction plus enforcement:
leave to the code what the agent finds by looking, hold in tools what must hold,
and keep in prose only what neither can say.

When `writing-for-agents` is installed, read it first: it governs every line
you write here.

**Pick the path:**

- No agent instructions yet, or only a generated file → [scaffold.md](scaffold.md).
- Existing instructions, docs, skills or memory → [optimize.md](optimize.md).

Then follow that file's steps; both use the reference below.

## Line classes

- **Cache**: restates the environment (scripts, config, layout, `--help`).
  Delete, unless the lookup is expensive.
- **Code description**: how a module works. Delete; the code says it and stays
  current.
- **History**: dated decisions, incident stories, measurements, resolved
  audits. Delete; Git keeps them.
- **Duplicate**: one meaning in two places. Keep one source of truth and point
  to it.
- **No-op**: what the model already does ("write clean code"). Delete the whole
  sentence.
- **Contradiction**: two places disagree. Resolve by the higher authority
  (requirements over looks, the person's explicit rule over a derived one); with
  none, ask the person.
- **Boundary**: a line a change elsewhere can cross without seeing it ("only X
  writes this table", "the password never reaches a log"). Keep one line, and
  move it into a tool when one can hold it.
- **Gotcha**: the trap no config confesses (a class name one step off the
  library's default, a script that ships the dirty tree). Keep one line beside
  what it concerns.

## The root

One file, `AGENTS.md`, with `CLAUDE.md` a relative symlink to it:

1. The product and its user, one paragraph.
2. Principles where the product judges differently from the default, each led
   by one word.
3. Boundaries, one line each, naming the owner; one sentence says which ones
   lint holds.
4. Finishing work: the exact test, lint, format and type commands, the verify
   skill, who reviews, what a delivering reply leads with.
5. Safety rails: live targets, destructive commands, process kills.
6. One pointer to where the rules for editing these files live.

Under ~120 lines. Positive phrasing: state the target behaviour, and keep a
prohibition only as a hard guardrail.

## Tools

| Rule kind | Tool |
| --- | --- |
| A layer must not import another | `no-restricted-imports` with patterns, per directory |
| Only one module writes some data | custom lint rule, [templates/lint-rules.mjs](templates/lint-rules.mjs) |
| A pattern banned where a better one exists (polling where pushes exist) | custom lint rule on the AST shape |
| An action that must never run (kill by pattern, force push) | PreToolUse hook, [templates/no-pattern-kill.mjs](templates/no-pattern-kill.mjs) |
| Formatting and auto-fixable lint | PostToolUse hook on the written file only, [templates/format-edited.mjs](templates/format-edited.mjs); unfixable errors go back to the agent |
| A secret stays out of frames, logs and transcripts | a test asserting it is absent |
| Instructions name paths that exist | [templates/check-instructions.ts](templates/check-instructions.ts) on every commit |

Outside tools worth running once: [tools.md](tools.md). Why this works, for a
person who asks: [evidence.md](evidence.md).
