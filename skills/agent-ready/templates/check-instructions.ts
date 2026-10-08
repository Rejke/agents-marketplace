// Fails when an agent instruction file names a repository path that no longer exists.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
  cwd: root,
  encoding: "utf8",
})
  .split("\n")
  .filter(
    (f) =>
      /(^|\/)(AGENTS|CLAUDE)\.md$/.test(f) ||
      /^\.(agents|claude)\/skills\/.+\.md$/.test(f) ||
      /^docs\/[^/]+\.md$/.test(f),
  )
  .filter((f) => existsSync(join(root, f)));

// A backticked token counts as a path when it starts with a tracked top-level directory.
const tops = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
  .split("\n")
  .filter((f) => f.includes("/"))
  .map((f) => f.split("/")[0]);
const ROOTS = new RegExp(`^(${[...new Set(tops)].map((t) => t.replace(/[.]/g, "\\.")).join("|")})/`);

function clean(path: string): string | null {
  const bare = path.replace(/[#?].*$/, "").replace(/:\d+(-\d+)?$/, "");
  if (!bare || /[*<>$]|\.\.\.|…/.test(bare)) return null;
  return bare;
}

const missing: string[] = [];
for (const file of files) {
  const text = readFileSync(join(root, file), "utf8");
  for (const [n, line] of text.split("\n").entries()) {
    for (const [, target] of line.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^[a-z]+:|^#/.test(target)) continue;
      const path = clean(target);
      if (path && !existsSync(resolve(root, dirname(file), path)))
        missing.push(`${file}:${n + 1}: link ${target}`);
    }
    for (const [, code] of line.matchAll(/`([^`\s]+)`/g)) {
      if (!ROOTS.test(code)) continue;
      const path = clean(code);
      if (path && !existsSync(join(root, path))) missing.push(`${file}:${n + 1}: path ${code}`);
    }
  }
}

// Build outputs and local env files exist only after a build; Git ignores them.
const ignored = new Set(
  spawnSync("git", ["check-ignore", "--no-index", "--stdin"], {
    cwd: root,
    input: missing.map((m) => m.split(" ").at(-1)!.replace(/\/$/, "")).join("\n"),
    encoding: "utf8",
  }).stdout.split("\n"),
);
const reported = missing.filter((m) => !ignored.has(m.split(" ").at(-1)!.replace(/\/$/, "")));

if (reported.length) {
  console.error(`Paths named in agent instructions that do not exist:\n${reported.join("\n")}`);
  process.exit(1);
}
console.log(`check-instructions: ${files.length} files, every named path exists`);
