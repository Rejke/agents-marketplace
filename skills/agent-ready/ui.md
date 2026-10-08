# When agents build poor UI

Agents copy the nearest code and follow the words they are given. Poor UI comes
from words that map to nothing in the code, code with no single pattern to copy,
and no moment where the agent looks at its result.

## Diagnose

Measure each, with counts and file paths:

- **The design doc.** What share is descriptions of existing screens versus
  rules? Does it name components, classes, tokens and reference screens, or only
  adjectives ("quiet", "muted")? Contradictions between it, the UX doc and the
  code?
- **The code to copy.** Distinct class strings for headings and section labels;
  icon sizes in use; raw `<button>` beside the button component; arbitrary
  values (`text-[13px]`, hex colours) beside tokens; a scale whose names differ
  from the library default (`text-xs` = 13px).
- **The loop.** Does anything make the agent shoot its result at the real
  widths, compare it with a reference and critique it before reporting?
- **The taste.** Where do the owner's preferences live? A memory file only one
  agent reads is invisible to every other agent and subagent.

## Fix

- **Design doc, ~150-200 lines:** direction (a few lines), a words-to-code table
  (every adjective → component, variant, class or token), scales as class names
  with their real values, rules de-duplicated, the owner's taste, the
  new-screen process, one reference screen or gallery case per pattern, and a
  checklist of at most ten binary items. Screen descriptions shrink to the
  decisions code cannot show.
- **New screens:** the job in one sentence and its primary action, an audit of
  what exists, three structurally different variants on the real route, the
  owner picks, then build. A screen built from a functional brief alone comes
  out as the data model on screen.
- **Code:** one canonical primitive per job (section label, page title, row,
  icon size), lint against arbitrary values and raw controls outside the UI
  package, and migrate the most-copied area first.
- **Loop:** the look step in the skill that proves changes: before and after
  side by side at desktop and phone widths, one line per checklist item, fixed
  until each passes; the reviewer runs the same checklist.
