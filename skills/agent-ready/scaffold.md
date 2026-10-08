# Scaffold a repository for agents

For a repository with no agent instructions yet, or only a generated one. Start
small: every line added later should answer a mistake an agent actually made.

1. **Find the commands.** Read `package.json`/`Makefile`/CI config and run the
   test, lint, format and type commands once. Done when each works from the
   repository root and you know which take a file argument.

2. **Find the boundaries.** Ask the person, and read the code for: live targets
   (production, shared servers, databases), what must never leak (secrets,
   tokens), modules that alone may write some data, layers that must not import
   others. Done when each boundary is written as one line naming its owner.

3. **Write the root** from [templates/AGENTS.md](templates/AGENTS.md) to
   [the root shape](SKILL.md#the-root): a paragraph on the product, principles
   only where the product judges differently from the default, the boundaries,
   the finishing commands, safety rails. Link `CLAUDE.md` to it
   (`ln -s AGENTS.md CLAUDE.md`). Done when it is under ~80 lines.

4. **Hold boundaries in tools** per [the tools table](SKILL.md#tools), starting
   from [templates/lint-rules.mjs](templates/lint-rules.mjs) and
   [templates/no-pattern-kill.mjs](templates/no-pattern-kill.mjs) with
   [templates/settings.json](templates/settings.json). Prove each _red_ on a
   throwaway sample, green on the repository.

5. **Add the path check:** copy
   [templates/check-instructions.ts](templates/check-instructions.ts) to
   `scripts/`, add a package script, and run it on every commit (lint-staged or
   a pre-commit hook). Done when it passes and fails on a planted dead path.

6. **Add a verify skill** from [templates/verify-skill.md](templates/verify-skill.md)
   when the project runs (a web app, a service, a CLI): an isolated way to start
   it with fake external providers, tests first, one pass through the real
   thing, a look step for visible changes. Done when one change has been proven
   through it end to end.

7. **Write `docs/README.md`** with a short _Writing for agents_ section: the
   line test, where tools live, the symlink rule and the path check. Open a pull
   request.
