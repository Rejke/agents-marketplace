---
name: agent-ready
description: Judge what in a repository helps or hurts coding agents, and what to cut, enforce or introduce so they work well in it.
disable-model-invocation: true
---

# Agent-ready

An agent works from what it can see and what it can check. It obeys every line
it carries, copies the nearest code, and believes a result it never looked at.
Make the right thing the visible, easy and checked thing, and spend the agent's
attention only where the repository cannot speak for itself.

## Principles

**Load is cost.** Every always-loaded line (root instructions, skill
descriptions, rules, the memory index) spends tokens and attention on every
turn, and adherence falls as the pile grows. A line earns its place when you can
name the mistake its absence would cause. Material only some tasks need sits
behind a pointer whose wording says when to follow it.

**The code is the source of truth.** Prose that restates code, config, scripts
or `--help` is a cache: it goes stale and is still obeyed. Keep in prose what
the code cannot say: the boundary a change elsewhere can cross unseen, the
gotcha no config confesses, the reason behind a choice, the unusual command.
History (dated decisions, measurements, finished audits) lives in Git.

**Tools hold, prose explains.** When breaking a rule should fail, a tool holds
it: a lint rule, a test, a check on commit. The error message carries the why;
the prose keeps one line or none. A hook that blocks an action costs a process
on every call and its false positives stop real work, so it is for disasters an
instruction cannot make rare enough; an instruction naming the safe way covers
the rest.

**Feedback beats instruction.** Agents get right what they can check quickly.
Shorten the loop: format and lint on write, with what is left handed back; the
nearest test run after an edit; one pass through the running product, as its
user; for anything visible, before and after side by side against a short
checklist. A second agent reviews where the history shows reviews catching
bugs; count the failures in past reviews before deciding.

**Copyable code.** The nearest code is the strongest instruction. One canonical
way per job (a component, a helper, a pattern), so whatever an agent copies is
right. Long files are where agents fail most: split hot spots along real seams,
the most-changed first.

**One source of truth, one owner.** Each meaning lives in one place, and every
other place points to it. A rule every agent needs lives in the repository;
private memory keeps only one agent's preferences and context. Each document
owns one subject. Two places that disagree are resolved by the higher authority
(requirements over looks, the person's explicit rule over a derived one), or by
asking.

**Decisions stay the person's.** Taste, policy, what a screen is for, what
ships: the agent proposes, with evidence and options; the person decides, and
the decision is recorded where the next agent will read it.

**Evidence before belief.** Check an auditor's claim against the code before
acting on it; a bad search reads as rot. Prove a new rule red on a planted
violation and green on the repository. When a change's value is in doubt,
measure it: the same tasks with and without, cost and turns per run.

## What to look for

- The always-loaded total, and the largest contributors.
- Instruction lines that describe code, repeat a doc, date a decision, or say
  what the model does anyway.
- Two places disagreeing; a rule only one agent's memory holds.
- Rules stated in prose that a tool could hold, and tools that block more than
  they prevent.
- How long the check loop takes, and whether the agent ever sees its result.
- Files past ~1,000 lines, and how often they change.
- Several ways of doing one job in the code; words in a design doc that map to
  nothing in it.
- A verify process built from per-feature recipes instead of tests, one real
  pass and a look.

## What to introduce where missing

- A short root `AGENTS.md` (with `CLAUDE.md` linked to it): the product and its
  user, principles the product judges differently, boundaries one line each,
  the exact check commands, safety rails.
- A check that fails when instructions or docs name a path that no longer
  exists.
- Format and lint on write, scoped to the written file.
- Lint rules for the boundaries code can express.
- A verify skill: tests first, one pass through the real product, a look step,
  a second agent where it pays.
- A glossary when the domain's words are not the code's.

## Working

Map what loads and when. Audit by area, one subagent each, and check their
evidence. Change the smallest set that removes the most load or risk, prove each
tool red and green, run the repository's checks, and open a pull request that
says what each tool now holds. Bring decisions that belong to the person to
them with options, never settle them in the diff.

Why this works, for a person who asks: [evidence.md](evidence.md).
