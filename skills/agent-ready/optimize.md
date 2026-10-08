# Optimize an existing repository

1. **Map the surface.** List every file an agent here reads, with its load:
   _always_ (root `AGENTS.md`/`CLAUDE.md` and those above it, the global
   `~/.claude/CLAUDE.md` and rules, the memory index, every skill description),
   _on entering a directory_ (nested `AGENTS.md`/`CLAUDE.md`), or _on a
   pointer_ (docs, skill bodies, memory files). Size each (bytes / 4 ≈ tokens).
   Done when the table covers every file and the always-loaded total is known.

2. **Audit by area**, one subagent per area: always-loaded files, operational
   docs, design and UX docs, skills, memory. Each classifies every line by the
   [line classes](SKILL.md#line-classes), with file:line and evidence checked
   against the code (grep, read the cited file, run the cited command). Check
   each report's evidence before acting on it; an auditor's own bad search can
   read as rot. Done when every file has a verdict: keep, trim to N lines, merge
   into X, or delete.

3. **Move boundaries into tools** per [the tools table](SKILL.md#tools). Prove
   each one _red_ on a throwaway sample and green on the repository. Its error
   message carries the why; the prose keeps one line or none. Done when every
   boundary is held by a tool or listed as prose-only with the reason.

4. **Rewrite the root** to [the root shape](SKILL.md#the-root). Rules that only
   matter in one module become one-line boundaries in the root, never nested
   files restating the code. Done when you can name the mistake each line
   prevents.

5. **Cut the docs** per the audit. Fix every dead path it found; repoint code
   comments that cite a deleted doc to `git log -- <path>`. Done when every
   verdict from step 2 is applied and the path check passes.

6. **Close the loop.** The verify skill gets a look step for visible changes
   and an independent verdict where past verdicts caught bugs: count the FAILs
   in recent pull requests before deciding. Its description names its jobs in
   one sentence. When the agents' UI is the complaint, follow [ui.md](ui.md).

7. **Prune memory** per [memory.md](memory.md).

8. **Guard against sediment.** Install the path check on every commit. Prove
   moved rules survived with a script that compares bullets after normalising
   whitespace. Run lint, format and tests, review the diff, and open a pull
   request listing what each tool now holds.
