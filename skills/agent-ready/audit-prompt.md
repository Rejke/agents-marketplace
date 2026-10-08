Audit this repository for how well coding agents (Claude Code, Codex and the like) work in it, and report what to cut, enforce or introduce. Change nothing yet: the report comes first, and every decision in it stays mine.

How agents fail here is the lens. An agent obeys every line it carries, copies the nearest code, and believes a result it never looked at. So the repository should make the right thing the visible, easy and checked thing, and spend the agent's attention only where the code cannot speak for itself.

## What to measure

1. **Always-loaded context.** Everything an agent carries every turn: root and nested AGENTS.md/CLAUDE.md, rules files, skill descriptions, memory indexes, MCP tool lists, and the user-level ones (~/.claude, ~/.codex) too. Give token estimates and the largest contributors. For each instruction line, ask: what mistake would its absence cause? A line restating code, config, scripts or `--help`, dating a decision, or saying what a model does anyway is a cut. Material only some tasks need belongs behind a pointer that says when to read it.
2. **Prose versus tools.** Rules stated in prose that a lint rule, type, test or commit check could hold, and whose break should fail. The reverse too: blocking hooks whose false positives stop real work. A blocking hook is only for a disaster an instruction cannot make rare enough.
3. **The feedback loop.** Time the real check commands (types, lint, format, unit tests, the full suite) cold and cached. Find what is serial without a reason, uncached, missing from a package, or failing on the main branch (a check that is always red is ignored). Is there format-and-lint on write, scoped to the edited file, that hands back what is left? Can an agent run the product and look at a change?
4. **Copyable code.** Several ways of doing one job (components, helpers, error handling, data access). Raw elements that bypass the design kit, and arbitrary values that bypass tokens. These are what agents copy next. Name the canonical way and say whether lint can hold it.
5. **Hot spots.** Files over ~1,000 lines, ranked by how often they change (`git log --format= --name-only | sort | uniq -c`). These are where agents edit worst; propose seams for splitting them.
6. **Docs.** Each doc owns one subject. Check for two places that disagree, a rule only one agent's private memory holds, paths and symbols docs name that no longer exist, and history (audits, dated decisions, measurements) that belongs in Git. A long prescriptive style or design doc makes agents build from prose instead of from the code. Consider deleting it, with the code and a short checklist as the reference.
7. **Verification.** How a change is proven done. Prefer tests first, one pass through the running product as its user, before/after for anything visible, and a second agent where past reviews actually caught bugs. Count those catches before recommending reviews. Per-feature recipe catalogues rot; flag them.
8. **Agent parity.** Whether every agent in use gets the same rules, skills and hooks (Claude Code reads CLAUDE.md, Codex reads AGENTS.md; symlink one to the other), and whether trust and config allow them to run.

## Rules for the audit

- Evidence before belief. Every finding names a file and line, a command and its output, or a measurement. Check a subagent's claim against the code before reporting it: a bad search reads as rot.
- Split by area, one subagent each, when the repository is large. Verify each report's evidence.
- Taste, policy and what a screen is for are mine. Propose with options; never settle them silently.

## Report

Lead with the five changes that would help agents most, each with its evidence, expected gain (tokens, seconds, failure class removed) and cost. Then list every finding, grouped as **Cut**, **Enforce** (with the tool that would hold it), **Speed up**, **Split**, **Introduce** and **Decide** (the ones that need me). Group the work into pull requests, one subject each, in the order you would land them. Say what you could not measure and where you looked.
