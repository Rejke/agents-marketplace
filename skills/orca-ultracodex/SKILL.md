---
name: orca-ultracodex
description: >-
  Run Claude Code Workflow-tool agent scripts unmodified on CLI agents (GPT 5.6
  Sol, claude) spawned clean in visible Orca worktree terminals. Use when
  running a workflow, fan-out, or multi-agent orchestration on external agents
  via Orca.
---

# orca-ultracodex

The bundled runner executes Workflow-tool Agent Scripts with Orca as the fleet. Every
`agent()` call spawns a raw CLI command (codex or claude) in its own visible Orca
terminal, delivers your prompt through a file, and collects a schema-validated report
file. The runner adds only three things to the agent's context: a `<task>` wrapper,
the return-value contract, and a follow-through line. It spawns through plain
terminals because Orca's agent launcher and orchestration layer prepend their own
preamble to the agent's prompt.

This file is the complete contract; the runner's source adds nothing you need.

## Authoring

Write the script exactly as for the Workflow tool, whose in-context definition is the
authoritative format: `export const meta = {...}` as a pure literal, then a plain-JS
async body over `agent` / `parallel` / `pipeline` / `phase` / `log` / `args` /
`budget` / `workflow`. Null-check every agent result. Save it to a file.

Deltas from the Workflow tool:

- `budget` is a stub (`total: null`; token use across terminals is unmetered). Bound
  work with `--max-agents` (the cap throws, like a budget) and plain counters.
- `opts.model`: aliases `sol`, `fable`, `opus`, `sonnet`, `haiku`, or a full claude
  model id. The codex side is `gpt-5.6-sol` only; the runner rejects any other codex
  model. Default model `gpt-5.6-sol`; `opts.effort` reaches codex only.
- Effort is a per-agent decision, and the price ladder is steep, so match it to the
  work: `medium` for mechanical stages (edits from a clear spec, recon, extraction,
  file sweeps, running checks), `high` for implementation with real design choices
  or debugging, `xhigh` for architecture-grade reasoning only. An omitted
  `opts.effort` runs `medium`. Review, verification, and judging agents run `xhigh`
  whatever the script asked (the runner forces it), so implementation stages stay
  cheap while the gate stays sharp. In a well-authored script most agents run
  `medium` or `high` and the `xhigh` ones can each justify themselves; audit any
  draft where every agent asks for `xhigh`.
- The runner enforces the band `medium`..`xhigh` (`low` clamps up, `max` clamps
  down), journals every coercion as a `launch_policy` event, and shows each agent's
  effort in its spawn line. It never sets a service tier; every run is normal
  priority.
- `opts.isolation: 'worktree'` creates a real Orca worktree off the current branch
  (uncommitted changes stay behind) and leaves it after the run for you to handle.
- The runner ignores `opts.agentType`; `workflow()` takes a script path (one nesting
  level); a failed run reruns from the script (there is no resume).
- `Date.now()` and `Math.random()` work here; keep them out of scripts that should
  stay portable to the Workflow tool.

## Running

Run from the project root, inside an Orca-managed worktree, with the Orca app up (the
runner resolves the right `orca` executable itself):

```bash
node <this skill's directory>/scripts/run.mjs run <script.js> \
  [--args '<json>'] [--concurrency 6] [--max-agents 50] \
  [--agent-timeout 1800] [--keep-terminals] [--run-dir DIR]
```

- The command blocks until done. stdout is the result JSON (the script body's return
  value), narration streams to stderr, and a non-zero exit means the run failed.
- The run directory (printed at the end) holds `journal.jsonl`, `prompts/`,
  `reports/`, and `result.json`. Read the journal before diagnosing a surprising
  result.
- The kickoff line rides on the spawn command itself, so there is no post-boot send
  to double-submit. The runner pre-trusts each codex working directory in
  `~/.codex/config.toml` before spawning there and sweeps any residual first-run
  dialog (claude shows one per fresh directory).
- Terminals close as each agent settles. A failed or timed-out agent's terminal stays
  open for inspection, and its handle is in the journal and the closing summary. The
  human can watch or type into any live agent tab in Orca.
- A visibly working agent (its TUI shows Working / esc to interrupt) is never nudged:
  web research and long thinking write nothing to the terminal for minutes, which the
  idle detector alone misreads. An agent that sits idle without a report gets two
  spaced reminders to write the file; after that the runner just keeps waiting for
  the report, the atomic completion signal. `--agent-timeout` is the only hard stop,
  so size it to the task: a research-heavy `medium` agent can need far more than the
  1800s default. A timed-out agent's terminal stays open and its report path stays
  valid, so late work can still be collected by hand.
- Ctrl-C closes every spawned terminal before the runner exits; after a crash or
  kill -9, `run.mjs cleanup <runId>` closes what the run left behind (a run without a
  finished marker needs `--force`, so a live run stays safe).
- `ORCA_ULTRACODEX_ECHO=1` makes `agent()` echo its prompt back (schema calls return
  null), so the whole script runs without touching Orca or spending quota. Debug
  orchestration logic there first.

## Results

Relay the run's stdout verbatim, then summarize it. If the run failed, report the
failure as-is and stop; the fix is a corrected script or a rerun, never you doing the
fleet's task yourself. A run that changed files ends only after the controller work:
read the actual diffs, verify them, merge each created worktree exactly once, remove
it.
