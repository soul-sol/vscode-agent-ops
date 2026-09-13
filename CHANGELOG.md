# Changelog

## 0.2.1

- Corrected the completion-detection doctrine across the pattern, the review prompt, and the README.
  The 0.2.0 pattern "Per-tool completion markers" is replaced by
  **"Completion is the exit code plus the result body"** — a missing marker is never a stall,
  and a marker is supplementary diagnostic evidence, not the completion signal itself.
  The "Worker completion & stalls" review prompt keeps its name and now reflects the same rule.

## 0.2.0

- Expanded adversarial review prompts from 5 to 10:
  - Deploy log & success markers — rollbacks that read as successes
  - Worker completion & stalls — per-tool completion markers for parallel agents
  - Rules-file enforcement — prove CLAUDE.md/AGENTS.md rules load and bind
  - Pre-publication leak review — scrub public output for internal data
  - Retry & idempotency safety — failed verification must not double-fire actions
- Expanded CLAUDE.md patterns from 5 to 12:
  - Per-tool completion markers
  - Probe before believing "can't"
  - Pin the success marker
  - Scrub before publishing
  - Guard the rules file
  - Unverified is not failed
  - No fabricated specifics
- Rewrote the README for the marketplace listing: value-first opening, text examples of inserted prompts, full catalog of prompts and patterns, and an explicit "What this extension does not do" section.
- Tuned `package.json` metadata (description, keywords, categories) around how people actually search for agent tooling.

## 0.1.0

- Initial release.
- Three commands: Insert Adversarial Review Prompt (5 gates), Insert CLAUDE.md Pattern (5 rules), Insert New Task Brief.
- Getting-started walkthrough with links to the free source collections.
