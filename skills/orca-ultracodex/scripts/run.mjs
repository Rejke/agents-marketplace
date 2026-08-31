#!/usr/bin/env node
// orca-ultracodex: run Claude Code Workflow-tool agent scripts on CLI agents
// (codex / claude) spawned as raw console commands in Orca worktree terminals.
// Zero dependencies. Node >= 20.
//
// Usage:
//   node run.mjs run <script.js> [--args '<json>'] [--concurrency N]
//     [--max-agents N] [--agent-timeout SECS] [--keep-terminals] [--run-dir DIR]
//
// Contract: the script is a Workflow-tool Agent Script (export const meta = {...},
// then a plain-JS async body over the injected globals agent/parallel/pipeline/
// phase/log/args/budget/workflow). The body's return value is printed to stdout
// as JSON. Narration goes to stderr. Non-zero exit = the run failed.

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const execFileP = promisify(execFile)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---------------------------------------------------------------- cli parsing

function parseArgv(argv) {
  const opts = {
    script: null,
    args: undefined,
    concurrency: 6,
    maxAgents: 50,
    agentTimeoutMs: 1800 * 1000,
    keepTerminals: false,
    runDir: null,
  }
  const rest = [...argv]
  if (rest[0] === 'run') rest.shift()
  while (rest.length) {
    const a = rest.shift()
    if (a === '--args') opts.args = JSON.parse(rest.shift())
    else if (a === '--concurrency') opts.concurrency = Number(rest.shift())
    else if (a === '--max-agents') opts.maxAgents = Number(rest.shift())
    else if (a === '--agent-timeout') opts.agentTimeoutMs = Number(rest.shift()) * 1000
    else if (a === '--keep-terminals') opts.keepTerminals = true
    else if (a === '--run-dir') opts.runDir = rest.shift()
    else if (a === '--json') { /* accepted for ultracodex muscle memory; output is always JSON */ }
    else if (a.startsWith('--')) throw new Error(`unknown flag: ${a}`)
    else if (!opts.script) opts.script = a
    else throw new Error(`unexpected argument: ${a}`)
  }
  if (!opts.script) throw new Error('usage: run.mjs run <script.js> [--args JSON] ...')
  return opts
}

// ---------------------------------------------------------------- orca client

function resolveOrcaExe() {
  if (process.env.ORCA_CLI_COMMAND) return process.env.ORCA_CLI_COMMAND.split(' ')
  if (process.env.ORCA_DEV_REPO_ROOT) return ['orca-dev']
  if (process.env.ORCA_TERMINAL_HANDLE) return ['orca']
  if (process.platform === 'linux') return ['orca-ide'] // bare `orca` is the GNOME screen reader
  return ['orca']
}
const ORCA = resolveOrcaExe()

async function orca(args, { timeoutMs = 30_000 } = {}) {
  const argv = [...ORCA.slice(1), ...args, '--json']
  try {
    const { stdout } = await execFileP(ORCA[0], argv, {
      timeout: timeoutMs,
      maxBuffer: 16 * 1024 * 1024,
    })
    return { code: 0, data: parseJsonLoose(stdout), raw: stdout }
  } catch (err) {
    const raw = `${err.stdout ?? ''}\n${err.stderr ?? ''}`.trim()
    return { code: err.code ?? 1, data: parseJsonLoose(err.stdout ?? ''), raw, error: err.message }
  }
}

function parseJsonLoose(text) {
  const start = String(text).indexOf('{')
  if (start < 0) return null
  try { return JSON.parse(String(text).slice(start)) } catch { return null }
}

function* walk(node) {
  if (node && typeof node === 'object') {
    yield node
    for (const v of Array.isArray(node) ? node : Object.values(node)) yield* walk(v)
  }
}

function findTerminalHandle(data) {
  for (const n of walk(data)) {
    for (const v of Object.values(n)) {
      if (typeof v === 'string' && /^term_[A-Za-z0-9_-]+$/.test(v)) return v
    }
  }
  return null
}

function findWorktreeId(data) {
  for (const n of walk(data)) {
    const v = n.id
    if (typeof v === 'string' && v.includes('::') && v.split('::')[1]?.startsWith('/')) return v
  }
  return null
}

// ---------------------------------------------------------------- launch specs

const MODEL_ALIASES = {
  sol: 'gpt-5.6-sol',
  fable: 'claude-fable-5',
  opus: 'claude-opus-5',
  sonnet: 'claude-sonnet-5',
  haiku: 'claude-haiku-4-5-20251001',
}

// Launch policy (enforced, not advisory):
// - the codex side runs gpt-5.6-sol only; any other codex model is rejected.
// - codex effort band is medium..xhigh; `low` clamps up, `max` clamps down,
//   and an omitted effort runs medium, so an author who wants xhigh has to
//   ask for it on that agent.
// - agents whose label or phase reads as review/verification/judging always
//   run xhigh.
// - the service tier is never set: priority ("fast") runs are off-policy.
const EFFORT_ORDER = ['low', 'medium', 'high', 'xhigh', 'max']
const REVIEW_PATTERN = /review|verif|judge|critic|antislop|audit|skeptic|refut/i

export function spawnCommandFor(model, effort, { label = '', phase = '', onPolicy = () => {} } = {}) {
  const resolved = MODEL_ALIASES[model] ?? model ?? 'gpt-5.6-sol'
  if (!/^[A-Za-z0-9._-]+$/.test(resolved)) throw new Error(`invalid model: ${resolved}`)
  if (resolved.startsWith('claude')) {
    // The claude CLI takes no effort flag; effort is advisory here.
    return { cmd: `claude --dangerously-skip-permissions --model ${resolved}`, model: resolved }
  }
  if (resolved !== 'gpt-5.6-sol') {
    throw new Error(`codex models are sol-only by policy; got ${resolved}`)
  }
  if (effort !== undefined && !EFFORT_ORDER.includes(effort)) {
    throw new Error(`invalid effort: ${effort}`)
  }
  let eff = effort ?? 'medium'
  if (eff === 'low') {
    eff = 'medium'
    onPolicy('effort_clamped', { from: 'low', to: 'medium' })
  }
  if (eff === 'max') {
    eff = 'xhigh'
    onPolicy('effort_clamped', { from: 'max', to: 'xhigh' })
  }
  if (REVIEW_PATTERN.test(`${label} ${phase}`) && eff !== 'xhigh') {
    onPolicy('review_forced_xhigh', { from: eff })
    eff = 'xhigh'
  }
  // No quotes inside -c values: codex parses a quoted value as part of the string.
  return {
    cmd:
      'codex --dangerously-bypass-approvals-and-sandbox ' +
      '-c check_for_update_on_startup=false -c features.apps=false ' +
      `-m ${resolved} -c model_reasoning_effort=${eff}`,
    model: resolved,
    effort: eff,
  }
}

// ---------------------------------------------------------------- prompt

function assemblePrompt({ prompt, schema, reportPath }) {
  const blocks = []
  blocks.push(`<task>\n${prompt}\n</task>`)
  const lines = [
    'Your final output is the RETURN VALUE consumed by a program, not a message to a human.',
    'Deliver it by writing a file:',
    `- write the complete content to ${reportPath}.tmp, then rename that file to ${reportPath}`,
    '  (rename last: a half-written file may be read the moment it appears).',
  ]
  if (schema) {
    lines.push(
      '- the file must contain ONLY a JSON value matching this schema (no prose, no code fences):',
      JSON.stringify(schema, null, 2),
    )
  } else {
    lines.push('- the file must contain your final answer as plain text.')
  }
  blocks.push(lines.join('\n'))
  blocks.push(
    '<default_follow_through_policy>\n' +
      'Never stop to ask questions or wait for confirmation. Act on stated defaults, make\n' +
      'reasonable assumptions for anything unspecified, and carry the task through to\n' +
      'completion. Writing the report file is the last thing you do.\n' +
      '</default_follow_through_policy>',
  )
  return blocks.join('\n\n')
}

// ------------------------------------------------------- minimal schema check

function validateSchema(value, schema, at = '$', errors = []) {
  if (errors.length >= 5 || !schema || typeof schema !== 'object') return errors
  const t = schema.type
  const typeOk = {
    object: (v) => v !== null && typeof v === 'object' && !Array.isArray(v),
    array: Array.isArray,
    string: (v) => typeof v === 'string',
    number: (v) => typeof v === 'number',
    integer: Number.isInteger,
    boolean: (v) => typeof v === 'boolean',
    null: (v) => v === null,
  }
  if (t && typeOk[t] && !typeOk[t](value)) {
    errors.push(`${at}: expected ${t}`)
    return errors
  }
  if (t === 'object') {
    for (const req of schema.required ?? []) {
      if (!(req in value)) errors.push(`${at}.${req}: required`)
    }
    for (const [k, sub] of Object.entries(schema.properties ?? {})) {
      if (k in value) validateSchema(value[k], sub, `${at}.${k}`, errors)
    }
  }
  if (t === 'array' && schema.items) {
    value.forEach((v, i) => validateSchema(v, schema.items, `${at}[${i}]`, errors))
  }
  if (schema.enum && !schema.enum.some((e) => JSON.stringify(e) === JSON.stringify(value))) {
    errors.push(`${at}: not in enum`)
  }
  return errors
}

// ---------------------------------------------------------------- semaphore

function makeSemaphore(limit) {
  let active = 0
  const queue = []
  return async function acquire() {
    if (active >= limit) await new Promise((r) => queue.push(r))
    active += 1
    return () => {
      active -= 1
      queue.shift()?.()
    }
  }
}

// ---------------------------------------------------------------- runner

class Run {
  constructor(opts) {
    this.opts = opts
    this.id = `r${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`
    this.dir = opts.runDir
      ? path.resolve(opts.runDir)
      : path.join(process.env.TMPDIR ?? '/tmp', 'orca-ultracodex', 'runs', this.id)
    fs.mkdirSync(path.join(this.dir, 'prompts'), { recursive: true })
    fs.mkdirSync(path.join(this.dir, 'reports'), { recursive: true })
    this.agentCount = 0
    this.phase = null
    this.acquire = makeSemaphore(opts.concurrency)
    this.echo = process.env.ORCA_ULTRACODEX_ECHO === '1'
    this.worktreeInfo = null
    this.createdWorktrees = []
    this.openTerminals = new Set()
    // One banner line always lands on stderr before any work, so a run that
    // produces nothing is distinguishable from a run that never started.
    this.say(`orca-ultracodex ${this.id}${this.echo ? ' (echo mode)' : ''} | run dir: ${this.dir}`)
    // An interrupted runner must not orphan its agents' terminals.
    process.once('SIGINT', () => this.abort('SIGINT'))
    process.once('SIGTERM', () => this.abort('SIGTERM'))
  }

  async abort(signal) {
    const handles = [...this.openTerminals]
    this.say(`${signal}: closing ${handles.length} agent terminal(s)`)
    this.journal({ kind: 'run_interrupted', signal, openTerminals: handles })
    await Promise.all(handles.map((h) => orca(['terminal', 'close', '--terminal', h])))
    process.exit(130)
  }

  journal(event) {
    const line = JSON.stringify({ ts: new Date().toISOString(), ...event })
    fs.appendFileSync(path.join(this.dir, 'journal.jsonl'), line + '\n')
  }

  say(msg) {
    process.stderr.write(msg + '\n')
    this.journal({ kind: 'log', msg })
  }

  async currentWorktree() {
    if (this.worktreeInfo) return this.worktreeInfo
    const res = await orca(['worktree', 'current'])
    const wt = res.data?.result?.worktree
    if (res.code !== 0 || !wt?.id) {
      throw new Error(
        'the working directory is not an Orca-managed worktree; run from one ' +
          `(orca worktree current failed: ${res.raw?.slice(0, 300)})`,
      )
    }
    this.worktreeInfo = wt
    return wt
  }

  async agent(prompt, agentOpts = {}) {
    this.agentCount += 1
    if (this.agentCount > this.opts.maxAgents) {
      throw new Error(`max-agents cap (${this.opts.maxAgents}) reached`)
    }
    const id = `a${this.agentCount}`
    const label = agentOpts.label ?? String(prompt).slice(0, 40).replace(/\s+/g, ' ')
    const phase = agentOpts.phase ?? this.phase
    const release = await this.acquire()
    try {
      return await this.#agentInner(id, String(prompt), agentOpts, label, phase)
    } catch (err) {
      this.journal({ kind: 'agent_error', id, label, error: String(err?.message ?? err) })
      this.say(`  ✖ ${id} ${label}: ${err?.message ?? err}`)
      return null
    } finally {
      release()
    }
  }

  async #agentInner(id, prompt, agentOpts, label, phase) {
    if (this.echo) {
      this.journal({ kind: 'agent_echo', id, label, phase, prompt })
      return agentOpts.schema ? null : prompt
    }
    const spec = spawnCommandFor(agentOpts.model, agentOpts.effort, {
      label,
      phase: phase ?? '',
      onPolicy: (rule, detail) => this.journal({ kind: 'launch_policy', id, rule, ...detail }),
    })
    const reportPath = path.join(this.dir, 'reports', agentOpts.schema ? `${id}.json` : `${id}.txt`)
    const promptPath = path.join(this.dir, 'prompts', `${id}.md`)
    fs.writeFileSync(promptPath, assemblePrompt({ prompt, schema: agentOpts.schema, reportPath }))

    // Worktree selector: cwd's worktree by default; a fresh one on isolation.
    let selector = 'active'
    let worktree = null
    if (agentOpts.isolation === 'worktree') {
      const current = await this.currentWorktree()
      const branch = current.branch?.replace(/^refs\/heads\//, '')
      const createArgs = ['worktree', 'create', '--name', `${this.id}-${id}`, '--setup', 'run']
      if (branch) createArgs.push('--base-branch', branch)
      const res = await orca(createArgs, { timeoutMs: 180_000 })
      const wtId = findWorktreeId(res.data)
      if (res.code !== 0 || !wtId) throw new Error(`worktree create failed: ${res.raw?.slice(0, 300)}`)
      worktree = wtId
      this.createdWorktrees.push(wtId)
      selector = `id:${wtId}`
      this.journal({ kind: 'worktree_created', id, worktree: wtId })
    }

    // Spawn the agent as a raw console command in a plain Orca terminal.
    const title = `${this.id} ${id} ${label}`.slice(0, 48)
    const created = await orca(['terminal', 'create', '--worktree', selector, '--title', title, '--command', spec.cmd])
    const handle = findTerminalHandle(created.data)
    if (created.code !== 0 || !handle) throw new Error(`terminal create failed: ${created.raw?.slice(0, 300)}`)
    this.openTerminals.add(handle)
    this.journal({ kind: 'agent_spawned', id, label, phase, handle, worktree, command: spec.cmd })
    this.say(`  ▸ ${id} ${label} [${spec.model}${spec.effort ? ' ' + spec.effort : ''}] ${handle}`)

    // Boot in slices, dismissing the first-run trust dialog if one appears
    // (codex and claude both show one for a fresh directory, and every new
    // worktree is a fresh directory). The wait can return fast with
    // satisfied:false, so pace the loop; dismiss with a bare Enter (leaves
    // nothing in the composer) and at most twice, because the dialog text
    // lingers in scrollback after it closes.
    const bootDeadline = Date.now() + 120_000
    let dismissals = 0
    for (;;) {
      const wait = await orca(['terminal', 'wait', '--terminal', handle, '--for', 'tui-idle', '--timeout-ms', '15000'], { timeoutMs: 25_000 })
      if (wait.code === 0 && !JSON.stringify(wait.data ?? '').includes('"satisfied":false')) break
      if (Date.now() > bootDeadline) throw new Error(`agent did not reach idle in 120s: ${wait.raw?.slice(0, 200)}`)
      const tail = await orca(['terminal', 'read', '--terminal', handle, '--limit', '5'])
      const lastLines = JSON.stringify(tail.data?.result?.terminal?.tail?.slice(-2) ?? '')
      if (dismissals < 2 && /trust the (contents|files)|Yes, continue|Press enter to continue/i.test(lastLines)) {
        dismissals += 1
        this.journal({ kind: 'trust_dialog_dismissed', id, dismissals })
        await orca(['terminal', 'send', '--terminal', handle, '--text', '', '--enter'])
        await sleep(3000)
      }
      await sleep(2000)
    }
    const banner = await orca(['terminal', 'read', '--terminal', handle, '--limit', '60'])
    if (!JSON.stringify(banner.data ?? '').includes(spec.model)) {
      this.journal({ kind: 'banner_unproven', id, model: spec.model })
    }
    const pointer = `Read the file ${promptPath} and do exactly what it says.`
    const sent = await orca(['terminal', 'send', '--terminal', handle, '--text', pointer, '--enter'])
    if (sent.code !== 0) throw new Error(`prompt delivery failed: ${sent.raw?.slice(0, 200)}`)

    // Collect: poll the report file. Once a minute, probe the terminal: a dead
    // one fails the agent, and an idle one without a report gets a reminder to
    // write the file (an agent that answered into its chat instead of the file
    // looks finished while the runner would otherwise wait out the full
    // timeout). Two ignored reminders fail the agent early.
    const deadline = Date.now() + this.opts.agentTimeoutMs
    let repairs = 0
    let cycles = 0
    let idleNudges = 0
    while (true) {
      if (Date.now() > deadline) {
        this.journal({ kind: 'agent_timeout', id, handle })
        throw new Error(`timed out after ${Math.round(this.opts.agentTimeoutMs / 1000)}s (terminal kept: ${handle})`)
      }
      await sleep(3000)
      cycles += 1
      if (!fs.existsSync(reportPath)) {
        if (cycles % 20 === 0) {
          // `terminal show` answers ok even for closed terminals; `read` with a
          // live status is the reliable liveness probe.
          const alive = await orca(['terminal', 'read', '--terminal', handle, '--limit', '1'])
          const status = alive.data?.result?.terminal?.status
          if (alive.code !== 0 || (status && status !== 'running')) {
            throw new Error(`terminal died before writing a report (${handle}, status=${status ?? 'unreadable'})`)
          }
          const idle = await orca(['terminal', 'wait', '--terminal', handle, '--for', 'tui-idle', '--timeout-ms', '1000'], { timeoutMs: 11_000 })
          const isIdle = idle.code === 0 && !JSON.stringify(idle.data ?? '').includes('"satisfied":false')
          if (isIdle) {
            if (idleNudges >= 2) {
              this.journal({ kind: 'agent_idle_no_report', id, handle, idleNudges })
              throw new Error(`agent went idle without writing a report, ${idleNudges} reminders ignored (terminal kept: ${handle})`)
            }
            idleNudges += 1
            this.journal({ kind: 'idle_nudge', id, idleNudges })
            await orca(['terminal', 'send', '--terminal', handle, '--text',
              `You stopped without writing your report file. It is your only completion signal: write the complete content to ${reportPath}.tmp, then rename that file to ${reportPath}.`,
              '--enter'])
          }
        }
        continue
      }
      const rawReport = fs.readFileSync(reportPath, 'utf8')
      if (!agentOpts.schema) {
        await this.#settle(id, label, handle, { textBytes: rawReport.length })
        return rawReport.trim()
      }
      let value
      let errors = []
      try {
        value = JSON.parse(rawReport)
        errors = validateSchema(value, agentOpts.schema)
      } catch {
        errors = ['$: not valid JSON']
      }
      if (errors.length === 0) {
        await this.#settle(id, label, handle, { report: reportPath })
        return value
      }
      if (repairs >= 1) {
        this.journal({ kind: 'agent_invalid_report', id, errors })
        throw new Error(`report failed validation after repair: ${errors.join('; ')}`)
      }
      repairs += 1
      fs.renameSync(reportPath, `${reportPath}.invalid`)
      this.journal({ kind: 'agent_repair', id, errors })
      await orca(['terminal', 'send', '--terminal', handle, '--text',
        `Your report failed validation: ${errors.join('; ')}. Write the complete corrected JSON to ${reportPath}.tmp, then rename it to ${reportPath}.`,
        '--enter'])
    }
  }

  async #settle(id, label, handle, extra) {
    this.journal({ kind: 'agent_done', id, label, ...extra })
    this.say(`  ✔ ${id} ${label}`)
    if (this.opts.keepTerminals) return
    this.openTerminals.delete(handle)
    const res = await orca(['terminal', 'close', '--terminal', handle])
    if (res.code === 0) {
      this.journal({ kind: 'terminal_closed', id, handle })
    } else {
      this.journal({ kind: 'terminal_close_failed', id, handle, detail: res.raw?.slice(0, 200) })
      this.say(`  ⚠ ${id}: terminal ${handle} did not close; close it in Orca or run cleanup ${this.id}`)
    }
  }
}

// ---------------------------------------------------------------- script load

function loadScriptSource(file) {
  const src = fs.readFileSync(file, 'utf8')
  // Agent scripts are ES modules with a single `export const meta` and a plain
  // body; strip export keywords so the body runs inside an AsyncFunction
  // (which permits top-level `return` and `await`).
  return src.replace(/^export\s+(const|let|var|function|async)/gm, '$1')
}

async function runScript(file, runnerOpts, callerArgs, depth = 0) {
  const run = depth === 0 ? new Run(runnerOpts) : runnerOpts // nested calls share the run
  if (depth > 0 && !(run instanceof Run)) throw new Error('internal: bad nested run')
  const source = loadScriptSource(path.resolve(file))

  const globalsNames = ['agent', 'parallel', 'pipeline', 'phase', 'log', 'args', 'budget', 'workflow']
  const globals = {
    agent: (p, o) => run.agent(p, o),
    parallel: (thunks) =>
      Promise.all(thunks.map((t) => Promise.resolve().then(t).catch((err) => {
        run.journal({ kind: 'thunk_error', error: String(err?.message ?? err) })
        return null
      }))),
    pipeline: (items, ...stages) =>
      Promise.all(items.map(async (item, index) => {
        let prev = item
        for (const stage of stages) {
          try {
            prev = await stage(prev, item, index)
          } catch (err) {
            run.journal({ kind: 'pipeline_stage_error', index, error: String(err?.message ?? err) })
            return null
          }
        }
        return prev
      })),
    phase: (title) => {
      run.phase = title
      run.say(`— ${title}`)
      run.journal({ kind: 'phase', title })
    },
    log: (msg) => run.say(`  ${msg}`),
    args: callerArgs,
    budget: { total: null, spent: () => 0, remaining: () => Infinity },
    workflow: async (ref, nestedArgs) => {
      if (depth >= 1) throw new Error('workflow() nesting is one level only')
      const target = path.resolve(path.dirname(path.resolve(file)), ref)
      return runScript(target, run, nestedArgs, depth + 1)
    },
  }

  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
  const fn = new AsyncFunction(...globalsNames, source)
  const result = await fn(...globalsNames.map((n) => globals[n]))
  if (depth === 0) {
    fs.writeFileSync(path.join(run.dir, 'result.json'), JSON.stringify(result ?? null, null, 2))
    run.journal({ kind: 'run_done', createdWorktrees: run.createdWorktrees })
    if (run.createdWorktrees.length) {
      run.say(`worktrees created (review, merge once, then remove): ${run.createdWorktrees.join(', ')}`)
    }
    if (run.openTerminals.size) {
      run.say(`terminals left open (failures or --keep-terminals): ${[...run.openTerminals].join(', ')}`)
    }
    run.say(`run dir: ${run.dir}`)
  }
  return result
}

// ---------------------------------------------------------------- cleanup

async function cleanupRun(ref, { force = false } = {}) {
  if (!ref) throw new Error('usage: run.mjs cleanup <runId-or-runDir> [--force]')
  const dir = ref.includes('/')
    ? path.resolve(ref)
    : path.join(process.env.TMPDIR ?? '/tmp', 'orca-ultracodex', 'runs', ref)
  const lines = fs
    .readFileSync(path.join(dir, 'journal.jsonl'), 'utf8')
    .trim()
    .split('\n')
    .map((line) => {
      try { return JSON.parse(line) } catch { return {} }
    })
  const spawned = new Map()
  const closed = new Set()
  let settled = false
  for (const e of lines) {
    if (e.kind === 'agent_spawned' && e.handle) spawned.set(e.handle, e.id)
    if (e.kind === 'terminal_closed' && e.handle) closed.add(e.handle)
    if (e.kind === 'run_done' || e.kind === 'run_interrupted') settled = true
  }
  if (!settled && !force) {
    throw new Error(
      `${dir} has no run_done/run_interrupted marker, so its runner may still be ` +
        'alive and its agents mid-work; pass --force only after checking `ps` for run.mjs',
    )
  }
  const results = []
  for (const [handle, id] of spawned) {
    if (closed.has(handle)) {
      results.push({ id, handle, state: 'already_closed' })
      continue
    }
    const res = await orca(['terminal', 'close', '--terminal', handle])
    results.push({ id, handle, state: res.code === 0 ? 'closed' : 'gone_or_failed' })
  }
  process.stdout.write(JSON.stringify({ runDir: dir, results }, null, 2) + '\n')
}

// ---------------------------------------------------------------- main

// argv[1] can be a symlink (the standard install layout) while Node's ESM
// loader canonicalizes import.meta.url to the realpath, so compare realpath to
// realpath; a path-string comparison turns a symlinked invocation into a
// silent exit-0 no-op.
let invokedDirectly = false
try {
  invokedDirectly =
    !!process.argv[1] &&
    fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))
} catch {
  // unreadable argv[1] means this file was imported, not executed
}
if (invokedDirectly) {
  try {
    const argv = process.argv.slice(2)
    if (argv[0] === 'cleanup') {
      await cleanupRun(argv[1], { force: argv.includes('--force') })
    } else {
      const opts = parseArgv(argv)
      const result = await runScript(opts.script, opts, opts.args)
      process.stdout.write(JSON.stringify(result ?? null, null, 2) + '\n')
    }
  } catch (err) {
    process.stderr.write(`run failed: ${err?.message ?? err}\n`)
    process.exit(1)
  }
}
