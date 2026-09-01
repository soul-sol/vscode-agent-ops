import type { InsertablePrompt } from "./prompts";

export const CLAUDE_MD_PATTERNS: readonly InsertablePrompt[] = [
  {
    label: "Autonomy clause",
    description: "Implement defined work instead of stopping at a plan",
    body: `For implementation tasks with defined SCOPE and OUT-OF-SCOPE, begin immediately. Do not stop at a plan or approval request. If ambiguity does not alter files, public interfaces, data formats, dependencies, external state, or human-owned actions, choose the smallest reversible in-scope option and record the assumption; otherwise name the missing decision. Run <VERIFY_COMMAND> after editing and report its exact exit code. Use "DONE: <result>" only when requested files changed and verification passed; otherwise use "FAILED: <blocker>". Stop before destructive, payment, identity, publication, secret, or out-of-scope actions and report "HUMAN_ACTION_REQUIRED: <action>".`
  },
  {
    label: "Done is evidence",
    description: "Require diff and verification evidence before completion",
    body: `Treat every completion statement as unverified until evidence passes. Before completing <TASK_ID>, inspect git status --short, git diff --stat, git diff --check, the relevant diff, and untracked files. Map every done criterion to changed lines, preserved behavior, a test, or a reproducible command. Run <VERIFY_COMMAND> after the final edit with pipeline failures propagated and record the command, relevant output, and actual exit code. Mark FIX_REQUIRED for an unexpectedly empty diff, unexplained out-of-scope files, whitespace errors, unmapped criteria, or nonzero verification. A worker's DONE or confident prose never replaces repository evidence.`
  },
  {
    label: "Browser profile quarantine",
    description: "Keep automation away from the user's real browser data",
    body: `Run browser automation only in a quarantined project profile such as <PROJECT_DIR>/.automation-profile, using --user-data-dir or the library's equivalent. Never read, copy, enumerate, or write the user's real Chrome/Chromium/Firefox profile, cookies, or saved sessions. If login is required, let the user log in manually inside the quarantine profile. Tool-managed embedded browsers are allowed when they already isolate state. Log the launch command before running; abort if it lacks quarantine configuration or references a real browser data directory. Gitignore the quarantine directory.`
  },
  {
    label: "Look before destroy",
    description: "Inspect, back up, and obtain exact approval",
    body: `Before any destructive or hard-to-reverse action—delete, overwrite, truncate, drop, hard reset, force push, clean, or schema migration—follow this sequence or cancel the action: (1) LOOK: resolve and inspect the exact target and current repository state. (2) BACK UP: create a timestamped copy outside the command's blast radius, or a verified recovery branch for tracked data. (3) APPROVE: for user-owned or external data, state the exact change and obtain approval for this operation. If a reliable backup/export is impossible, the action is human-only. After an accident, stop; do not automate recovery from an unknown state.`
  },
  {
    label: "Reassign, not retry",
    description: "Prevent identical failed worker loops",
    body: `Track each <TASK_ID> attempt by worker, failure signature, changed variable, and result. Allow one same-worker retry only when a decision-relevant input changes, such as scope, source files, verification command, observed evidence, or an invalid assumption. Never repeat an identical task/context/command/worker combination. After the same failure twice, stop that worker, mark REASSIGN_REQUIRED, and assign a different eligible worker with prior evidence and unchanged acceptance criteria. Reassign immediately for worker-specific quota, authentication, tool, permission, or availability failures. If no eligible executor remains, report the external blocker instead of retrying.`
  }
];
