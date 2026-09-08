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
  },
  {
    label: "Completion is the exit code plus the result body",
    description: "Markers are diagnostics; a missing one is never a stall",
    body: `Completion is decided by two things only: the process exit code and the result body. A nonzero exit is FAILED. An exit of 0 is a completion candidate—read the result body before accepting it, because a worker can exit cleanly having only asked a question. Record each agent CLI's completion marker (the line, event, or exit signature it prints on normal completion) if you like, but treat it as supplementary diagnostic evidence that never changes the disposition, and never require one tool's marker from another tool—that is what turns healthy runs into false stalls. Reserve STALL for cases where the outcome cannot be established at all: no pid record, no log, or a process that exited without leaving an exit code. Warning strings in logs are informational unless the exit code is nonzero, and log line count is never a signal—a long single-line output produces a short file. Never report a batch as complete until every result body has been read.`
  },
  {
    label: "Probe before believing 'can't'",
    description: "Test a claimed inability once, cheaply",
    body: `Treat an agent-reported inability—"no permission in this session", "network unavailable", "tool not installed"—as a claim, not a fact. Before propagating it or deferring work, test it once with the cheapest possible probe in the same session: a trivial command, a file touch, a connectivity check. If the probe succeeds, the claim is false—proceed with the original work. If it fails, classify the failure layer precisely (network blocked, dependency missing, credentials invalid, permission denied), because tools tend to report the most plausible downstream symptom instead of the actual cause. Never carry an unverified inability forward into the next cycle; every repetition must cite the probe that proved it.`
  },
  {
    label: "Pin the success marker",
    description: "One unambiguous line decides deploy success",
    body: `Every deploy pipeline prints exactly one success marker—a single unambiguous line emitted only after the final post-switch gate passes—and success is judged solely by that marker. Health-check and verification lines from intermediate stages, and especially from auto-rollback paths, describe their own stage, not the release: a rollback that verifies itself still means the deploy failed. Never grep a deploy log for reassurance substrings like "passed". After every deploy, independently confirm the live state from the running system: which release path is actually active, and a request served by it. If the marker is absent, the deploy failed, no matter how healthy the log reads.`
  },
  {
    label: "Scrub before publishing",
    description: "Public output gets a deny-list review, every time",
    body: `Publishing is a transformation, never a copy. Anything leaving the repository for a public surface—a page, post, image, README, or comment—is reviewed against a deny list immediately before publication: private IPs, hostnames, and ports; credentials and personal paths; internal metrics such as revenue, quotas, and costs; infrastructure names; draft notes and backup files. The artifact's language must match its intended audience. Backups never live inside the published location. After publishing, re-fetch the live artifact and run the same deny list against the served bytes, and confirm sensitive paths return not-found. If any check fails, unpublish first and investigate second.`
  },
  {
    label: "Guard the rules file",
    description: "Treat CLAUDE.md/AGENTS.md as production config",
    body: `The rules file is production configuration. Check its byte size against the agent runtime's combine or truncation limit—rules past the limit are silently unread, not merely ignored—and verify the runtime path resolves to the file actually being edited. After each verified edit, record the file's hash and re-check it after any session that touched files; a shrunken file means rules evaporated inside a "successful" session. Phrase every critical rule as a checkable instruction, and verify enforcement with a fresh read-only agent process reciting the critical rules—correct file contents prove nothing about what the runtime loaded. A rule that exists only in the file, with no execution path that applies it, is documentation.`
  },
  {
    label: "Unverified is not failed",
    description: "Retries require idempotency guards",
    body: `For any action with side effects, define its result states before writing the retry policy, and distinguish FAILED (the action did not happen) from UNVERIFIED (the action may have happened; verification could not judge). UNVERIFIED never triggers an automatic retry—re-resolve it through an independent channel, or a duplicate action goes out. Every retryable action carries an idempotency guard that detects an already-performed action before performing it again, checked before the action, with a per-item attempt cap and terminal states that leave the queue. Concurrent runs must not both act. When automating over an unreliable interface, build the guard first: it is the prerequisite for retries, not an enhancement.`
  },
  {
    label: "No fabricated specifics",
    description: "Numbers and quotes come from records only",
    body: `When writing anything factual—reports, posts, release notes, comments—use numbers, log phrases, file names, and quotes only if they exist in a record you can cite: a log, ledger, or note written before the writing. If the record does not contain the specific figure, describe the phenomenon without inventing precision—"for a long stretch" instead of an imagined count. To write about a new incident, record it in the log first and cite that record; never write the piece and backfill the evidence, because that ordering is what separates documentation from fiction. When uncertain, generalize or ask. Fabricated precision destroys more trust than honest vagueness, and once discovered it is indistinguishable from lying.`
  }
];
