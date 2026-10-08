# Evidence

- **Context files cost more than they help on average.** Gloaguen et al.
  (ETH Zurich, arXiv 2602.11988): repository context files did not generally
  raise task success and raised inference cost by over 20%; agents followed
  them literally. Overviews did not help; non-standard tooling and exact
  commands did.
- **Instruction-following decays with count.** IFScale (arXiv 2507.11538).
- **Short files.** Anthropic recommends under 200 lines per `CLAUDE.md`
  because adherence drops as files grow, and asks of every line: "Would
  removing this cause Claude to make mistakes?"
  (code.claude.com/docs/en/memory, /best-practices). HumanLayer keeps its root
  file under 60 lines.
- **Tools over prose.** Anthropic: `CLAUDE.md` is context, not enforced
  configuration; a PreToolUse hook blocks an action regardless of what the
  model decides. Factory: AGENTS.md carries the why, linters enforce the how.
- **Lines from failures.** Mitchell Hashimoto: each line of his AGENTS.md is
  based on a bad agent behaviour.
- **Well-run files are small.** ghostty 39 lines, uv 33, temporal 42, t3code
  164, opencode 161.
- **Visual feedback helps UI.** Anthropic's guidance pairs a visual target with
  "take a screenshot of the result and compare… list differences and fix
  them". VF-Coder (arXiv 2604.19750) raised GUI task success from 21.7% to
  28.3% with visual feedback.
- **Independent review catches bugs.** OpenAI reviews every pull request with
  Codex; Cognition runs Devin Review on every PR. Count your own: in one
  project 8 of 27 independent verdicts were FAIL, each a real bug.
