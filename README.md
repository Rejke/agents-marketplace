# agents-marketplace

Agent skills by [@Rejke](https://github.com/Rejke). Install them with the [skills CLI](https://skills.sh).

## Install

Install every skill in this repo:

```bash
bunx skills@latest add Rejke/agents-marketplace
```

Or with npm:

```bash
npx skills add Rejke/agents-marketplace
```

The CLI asks which skills to install and which agents to install them into (Claude Code, Cursor, Codex, and others).

## Skills

### orca-ultracodex

An Orca-native analog of [ultracodex](https://github.com/YuanpingSong/ultracodex): a zero-dependency Node runner that executes Claude Code Workflow-tool agent scripts unmodified, with each `agent()` call spawned as a raw console command (GPT 5.6 Sol via the codex CLI, or a claude CLI) in its own visible [Orca](https://orca.dev) worktree terminal. Prompts arrive through files, results come back as schema-validated report files, and the only text added around your prompt is a task wrapper, the return-value contract, and a follow-through line. Orca's agent launcher and orchestration layer, which inject their own preamble, are never used.

The runner carries `parallel`/`pipeline`/`phase` semantics matching the Workflow tool, a per-run journal, automatic dismissal of codex/claude first-run trust dialogs, worktree isolation for parallel mutators, and a hermetic echo mode for debugging orchestration logic without spending quota.

### clear-writing

Replaces the `orwell-writing` and `unslop` skills. Run separately, they pull in opposite directions. Orwell and STE compress text until it turns sterile, and the AI-tell detector flags sterile text as machine-made. This skill merges them, sets a precedence order, and splits the work into two modes. Technical mode is an STE pass for text the reader follows, such as docs and procedures. Voice mode is for text the reader reads, such as essays and emails.

It covers:

- Orwell's six rules from "Politics and the English Language"
- A baseline from ASD-STE100 Simplified Technical English
- An AI-tell checklist (puffery, em dashes, "not just X, but Y", synonym cycling, chatbot phrases, abstract metaphor nouns)
- Voice rules so the edited text still reads like a person wrote it

If you had `orwell-writing` or `unslop` installed, remove them after you install this one. Keeping them recreates the conflict this skill fixes.
