# agents-marketplace

Agent skills by [@Rejke](https://github.com/Rejke), installable with the [skills CLI](https://skills.sh).

## Install

Install every skill in this repo:

```bash
bunx skills@latest add Rejke/agents-marketplace
```

Or with npm:

```bash
npx skills add Rejke/agents-marketplace
```

The CLI asks which skills to install and which agents (Claude Code, Cursor, Codex, and others) to install them into.

## Skills

### clear-writing

One skill that replaces the separate `orwell-writing` and `unslop` skills. Run separately, the two pull in opposite directions: Orwell and STE compress text until it turns sterile, and the AI-tell detector flags sterile text as machine-made. The merged skill resolves this with an explicit precedence order and two modes: an STE pass for technical prose that readers follow, and a voice pass for prose that readers read.

It covers:

- Orwell's six rules from "Politics and the English Language"
- An ASD-STE100 Simplified Technical English baseline for docs and procedures
- A 26-point AI-tell checklist (puffery, em dashes, "not just X, but Y", synonym cycling, chatbot phrases, abstract metaphor nouns)
- Voice rules so edited text still reads like a person wrote it

If you had `orwell-writing` or `unslop` installed, remove them after installing this one. Keeping them alongside recreates the conflict this skill exists to fix.
