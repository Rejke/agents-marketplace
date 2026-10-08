// PostToolUse(Edit|Write): format and lint-fix only the file just written, so shared checkouts stay untouched.
// Template: replace node_modules/.bin/vp, `fmt` and `lint --fix` with the project's formatter and linter.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, relative } from "node:path";

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const file = JSON.parse(input).tool_input?.file_path;
  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const vp = join(root, "node_modules/.bin/vp");
  if (!file || !existsSync(file) || !existsSync(vp)) return;
  const path = relative(root, file);
  if (path.startsWith("..")) return;
  if (spawnSync("git", ["check-ignore", "-q", path], { cwd: root }).status === 0) return;

  if (/\.(m|c)?[jt]sx?$|\.(json|jsonc|md|css|ya?ml)$/.test(path))
    spawnSync(vp, ["fmt", path], { cwd: root });
  if (!/\.(m|c)?[jt]sx?$/.test(path)) return;
  const lint = spawnSync(vp, ["lint", "--fix", path], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
  if (lint.status !== 0) {
    const report = `${lint.stdout}${lint.stderr}`
      .split("\n")
      .filter((line) => line.trim() && !line.includes("note:"))
      .slice(0, 40)
      .join("\n");
    process.stderr.write(`Lint errors left in ${path} after --fix:\n${report}\n`);
    process.exit(2);
  }
});
