# <Project>

<One paragraph: what it is, who uses it, the outcome they come for.>

## Principles

- **<Leading word>.** <A judgement this product makes differently from the
  default, one or two lines.>

## Boundaries

Lines a change in any file can cross without seeing the code that owns them.
Lint holds <the boundaries a tool enforces>, with the reason in its errors.

- <Only X writes Y.> <Z never reaches a log, frame or transcript.>

## Finishing work

A task is done when the requested behavior works and the relevant checks pass.
A check that cannot pass is the blocker to report, never something to relax.

For code: `<test command> <files>`, `<lint>`, `<format check>`, `<type check>`
for the affected scope. Prove a runnable change with
[<verify skill>](<path>/SKILL.md).

<Who reviews, what gets a preview, what a delivering reply leads with.>

## Working safely

- <Live targets and the doc to read before touching them.>
- <Destructive commands and where they may run.>

Before editing this file, a skill or a doc, read
[docs/README.md](docs/README.md#writing-for-agents).
