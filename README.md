# Agent Ops — Claude Code & Codex

Paste-ready AI code review prompts, `CLAUDE.md` / `AGENTS.md` operating rules, and task briefs for Claude Code, Codex, and other coding agents — inserted at your cursor from the Command Palette.

Every prompt and rule here comes from a real agent-ops failure: a worker that reported success while nothing was implemented, a deploy that rolled back while logging "health checks passed", a rules file that was silently never loaded. The fix in each case was one short, checkable instruction — so that is what this extension inserts.

## Install

Not on the Marketplace yet. Grab the `.vsix` from the [latest release](https://github.com/soul-sol/vscode-agent-ops/releases/latest) and install it:

```
code --install-extension agent-ops-claude-code-codex-0.2.1.vsix
```

Or run **Extensions: Install from VSIX...** from the Command Palette and pick the file. Cursor, Windsurf, and VSCodium take the same file.

## What it inserts

Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and type **Agent Ops**.

**Agent Ops: Insert Adversarial Review Prompt** → pick a failure mode → the full prompt lands at your cursor. Choosing *Shell & CI exit codes* inserts:

```text
Audit <SCRIPTS_OR_WORKFLOW_DIFF> for <SHELL_AND_OS_MATRIX>. Assume a middle
command can fail while the script or CI job reports success.

Reconstruct exit status through every pipeline, function, conditional, subshell,
trap, and final command. Check errexit/nounset/pipefail assumptions; stale $?
reads; command substitution masked by local; continue-on-error; pipes and
xargs; quoting/globbing; ...
```

**Agent Ops: Insert CLAUDE.md Pattern** → pick a rule → paste it into your `CLAUDE.md`, `AGENTS.md`, or system prompt. Choosing *Unverified is not failed* inserts:

```text
For any action with side effects, define its result states before writing the
retry policy, and distinguish FAILED (the action did not happen) from UNVERIFIED
(the action may have happened; verification could not judge). UNVERIFIED never
triggers an automatic retry—re-resolve it through an independent channel, or a
duplicate action goes out. ...
```

**Agent Ops: Insert New Task Brief** — an eight-field task contract (task, context, scope, exclusions, execution rule, done criteria, verification, report) for clean handoffs to any agent.

If no text editor is open, insertion commands create a new untitled Markdown document. Otherwise, text is inserted at the active cursor.

## The ten review prompts

1. **Correctness & regressions** — trace changed behavior to consequential failures
2. **Injection & trust boundaries** — follow untrusted values into dangerous sinks
3. **Test quality that can fail** — coverage theater, lying mocks, wrong contracts
4. **Shell & CI exit codes** — silent-green pipelines and portability traps
5. **Agent output verification** — audit a worker's "done" against its brief
6. **Deploy log & success markers** — rollbacks that read as successes
7. **Worker completion & stalls** — judge parallel agents by exit code and result body
8. **Rules-file enforcement** — prove `CLAUDE.md`/`AGENTS.md` rules load and bind
9. **Pre-publication leak review** — scrub public output for internal data
10. **Retry & idempotency safety** — failed verification must not double-fire actions

## The twelve CLAUDE.md patterns

1. **Autonomy clause** — implement defined work instead of stopping at a plan
2. **Done is evidence** — diff and verification output before any completion claim
3. **Browser profile quarantine** — automation never touches the real browser profile
4. **Look before destroy** — inspect, back up, approve, then act
5. **Reassign, not retry** — break identical failed-worker loops
6. **Completion is the exit code plus the result body** — a missing marker is never a stall
7. **Probe before believing "can't"** — test a claimed inability once, cheaply
8. **Pin the success marker** — one unambiguous line decides deploy success
9. **Scrub before publishing** — deny-list review for anything public
10. **Guard the rules file** — treat `CLAUDE.md`/`AGENTS.md` as production config
11. **Unverified is not failed** — retries require idempotency guards
12. **No fabricated specifics** — numbers and quotes come from records only

## A useful workflow

1. Insert a task brief and replace the placeholders with the real repository context and verification command.
2. Add only the `CLAUDE.md` rule that addresses the failure mode you actually need to prevent.
3. Before accepting a change, insert the matching adversarial review prompt with the real diff and test evidence.
4. Fix evidence-backed findings, then rerun verification on the final code state.

## What this extension does not do

Trust is the product, so the boundaries are explicit:

- It does not run an agent, a model, or any background process.
- It does not read, send, or analyze your code. Insertion commands operate entirely inside VS Code.
- It does not replace tests or human review — it gives you sharper prompts and rules for both.
- The only network action is the "Complete Agent Ops Kit" command, which opens a product page in your browser through VS Code's standard external-link API.

No telemetry, no account system, no tracking.

## Free source collections

- [AI Code Review Prompts](https://github.com/soul-sol/ai-code-review-prompts)
- [CLAUDE.md Patterns](https://github.com/soul-sol/claude-md-patterns)
- [Agent Watch](https://github.com/soul-sol/agent-watch)

The extension contains concise, paste-ready selections from these broader free collections.

## Complete Agent Ops Kit

For the expanded prompt, pattern, and orchestration collection, see the [Complete Agent Ops Kit](https://lifestep1.gumroad.com/l/complete-agent-ops-kit?utm_source=github&utm_medium=readme&utm_campaign=vscode-agent-ops).

## Development

```bash
npm install
npm run compile
npm run package
```

The package command uses `@vscode/vsce` and creates a `.vsix` locally. Publishing is intentionally a separate manual action.

## License

MIT
