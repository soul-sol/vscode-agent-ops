# Agent Ops — Claude Code & Codex

Paste-ready prompts and operating rules for developers working with Claude Code, Codex, and other AI coding agents. Agent Ops puts focused review gates, reusable `CLAUDE.md` rules, and a practical task brief directly in the VS Code Command Palette.

This extension is free. It does not run an agent, send your code anywhere, or claim to replace tests and human review. It inserts text into your editor; the only network action is the command that opens the paid kit in your browser.

## Commands

Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux) and search for **Agent Ops**.

- **Agent Ops: Insert Adversarial Review Prompt** — choose from five short review gates: correctness, injection, test quality, shell/CI exit codes, and agent-output verification.
- **Agent Ops: Insert CLAUDE.md Pattern** — choose from five compact operating rules: autonomy, done-is-evidence, browser-profile quarantine, look-before-destroy, and reassign-not-retry.
- **Agent Ops: Insert New Task Brief** — insert an eight-field task contract covering task, context, scope, exclusions, execution, completion, verification, and reporting.
- **Agent Ops: Get the Complete Agent Ops Kit** — open the paid Complete Agent Ops Kit page.

If no text editor is open, insertion commands create a new untitled Markdown document. Otherwise, text is inserted at the active cursor.

## A useful workflow

1. Insert a task brief and replace the placeholders with the real repository context and verification command.
2. Add only the `CLAUDE.md` rule that addresses the failure mode you actually need to prevent.
3. Before accepting a change, insert the matching adversarial review prompt with the real diff and test evidence.
4. Fix evidence-backed findings, then rerun verification on the final code state.

## Free source collections

- [AI Code Review Prompts](https://github.com/soul-sol/ai-code-review-prompts)
- [CLAUDE.md Patterns](https://github.com/soul-sol/claude-md-patterns)
- [Agent Watch](https://github.com/soul-sol/agent-watch)

The extension contains concise, paste-ready selections from these broader free collections.

## Complete Agent Ops Kit

For the expanded prompt, pattern, and orchestration collection, see the [Complete Agent Ops Kit](https://lifestep1.gumroad.com/l/complete-agent-ops-kit).

## Privacy

Agent Ops has no telemetry, no account system, and no background network service. Insertion commands operate entirely inside VS Code. The paid-kit command uses VS Code's standard external-link API to open the URL above.

## Development

```bash
npm install
npm run compile
npm run package
```

The package command uses `@vscode/vsce` and creates a `.vsix` locally. Publishing is intentionally a separate manual action.

## License

MIT
