---
name: verify-<project>
description: Verify a runnable <Project> change on <where it runs> before reporting it done, or review another agent's change.
---

# Verify <Project>

1. **Tests first.** `<test command> <files>` for what you touched, lint and
   types for that scope. Logic is proven by a test, not a screenshot.
2. **One pass on the real thing** through the path you changed, as a user
   would: `<how to start it isolated, with fake providers and its own data>`.
   Keep it up across turns while you iterate.
3. **Hit every surface:** <entry points, widths, devices, reverse states,
   loading/empty/error, providers, themes>. Say which applied.
4. **Look**, for a visible change: before (from trunk) and after side by side
   at <desktop> and <phone>, one line per item of <checklist link>, fixed until
   each passes. Attach the pairs to the pull request; never commit them.
5. **A second agent** gives a verdict for <features and visible changes; risky
   fixes>: read the diff first, run the focused tests, drive the change, walk
   the surfaces, then PASS, PASS+NOTES or FAIL with file and line on the first
   line.

A drive you could not finish is inconclusive; report what you could not verify
and why.
