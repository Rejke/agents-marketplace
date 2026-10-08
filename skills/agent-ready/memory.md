# Pruning memory

Memory is private to one agent on one machine. Codex, subagents and every other
agent never see it, so a rule they all need lives in the repository and memory
keeps only the person's preferences, corrections and working context.

1. **Copy the memory directory** to `/tmp` before touching it; deletions there
   have no Git history.
2. **Move shared rules out.** For each memory file, ask whether another agent
   working here would need it. If so, put one line in `AGENTS.md` or the doc
   that owns the subject, and delete the memory file. Taste and process notes
   about the product's UI belong in the design doc.
3. **Delete duplicates.** A memory that restates `AGENTS.md`, a doc or a skill
   is a second source of truth that goes stale first.
4. **Re-verify the rest.** A memory naming a file, function, flag, version or
   pull request is checked against the code or `git log`; update it or delete
   it.
5. **Trim the index.** `MEMORY.md` loads every session (Claude Code reads its
   first 200 lines or 25 KB): one line per entry, a title and a trigger of a
   few words, no summary of the file.
6. **Keep the why.** A memory file keeps its one-line reason (the correction
   that produced it); drop narrative, dates and quotes beyond that.

Done when every remaining memory is private to this agent, current against the
code, and indexed in one short line. For the instruction files themselves,
Claude Code's `/doctor` (alias `/checkup`) reports duplicated, derivable and contradictory instructions before changing anything.
