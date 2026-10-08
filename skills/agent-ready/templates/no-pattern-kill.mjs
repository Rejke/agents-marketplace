// PreToolUse(Bash): a kill by name or pattern can take down live sessions or the agent's own shell.
let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const command = JSON.parse(input).tool_input?.command ?? "";
  if (/(^|[;&|(`\n]|\$\()\s*(sudo\s+)?(pkill|killall)(\s|$)/.test(command)) {
    process.stderr.write(
      "Blocked: pkill/killall select processes by pattern. Find the PID you own (pgrep -a, /proc/<pid>/cmdline) and `kill <pid>`; see docs/DEPLOY.md.\n",
    );
    process.exit(2);
  }
});
