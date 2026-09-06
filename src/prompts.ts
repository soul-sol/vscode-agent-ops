export interface InsertablePrompt {
  readonly label: string;
  readonly description: string;
  readonly body: string;
}

export const REVIEW_PROMPTS: readonly InsertablePrompt[] = [
  {
    label: "Correctness & regressions",
    description: "Trace changed behavior and find consequential failures",
    body: `Act as the final adversarial correctness gate. Assume this change is broken in at least one consequential way.

Inputs: intended behavior and acceptance criteria: <INTENT>; diff: <DIFF>; relevant contracts and callers: <CONTEXT>; test evidence: <TESTS>.

Trace each changed behavior from input to observable output or side effect. Check conditions, defaults, state transitions, invariants, units/types, mutation, ordering, compatibility, partial failure, and unhappy paths. Treat tests as claims: identify paths they miss and assertions that could pass while behavior is wrong.

Report only real findings as: SEVERITY (BLOCKER/HIGH/MEDIUM/LOW), LOCATION, FAILURE SCENARIO, and MINIMAL REPRO. Exclude style and speculative redesign. If there are no findings, list exactly what you checked and the most important residual risk.`
  },
  {
    label: "Injection & trust boundaries",
    description: "Trace untrusted values into interpreters and dangerous sinks",
    body: `Review <DIFF> as an adversarial application-security reviewer. Treat every value originating outside the current trust boundary—including request data, files, database records, config, queue messages, and LLM output—as attacker-controlled.

Trace those values into SQL, shells, HTML/templates, redirects, filesystem paths, archive extraction, dynamic imports, regexes, parsers, and outbound HTTP. Challenge decoding, canonicalization, concatenation, allowlists, and context-mismatched escaping. Try concrete SQL, shell/option, XSS, traversal, CRLF, SSRF, and regex-DoS payloads where relevant.

For each finding report: SEVERITY, LOCATION, attacker input → propagation → effect, MINIMAL REPRO, and the smallest safe fix. Do not invent missing code. A no-findings result must name every input source and sink class checked and why exploitation is blocked.`
  },
  {
    label: "Test quality that can fail",
    description: "Detect coverage theater, lying mocks, and wrong contracts",
    body: `Audit <TEST_FILES> against <CODE_UNDER_TEST> and <SPEC>. Assume at least one test cannot fail with the feature broken and at least one mock lies.

For every assertion, name the wrong behavior that would make it fail. Flag truthy/defined-only checks, assertions on mocked returns, self-updated snapshots, empty loops, missing awaits, over-mocking, call-only assertions, implementation-detail checks, and mocks whose shape or failure behavior differs from the real dependency. Verify each expected behavior against the spec, not the implementation. Identify the three most dangerous untested boundaries or failure paths.

Report: SEVERITY (P0 wrong contract/cannot fail, P1 lying mock/critical gap, P2 hygiene), LOCATION, FAILURE SCENARIO, and a minimal production-breaking change that the suite would miss. No praise; no findings requires an assertion-by-assertion checked list.`
  },
  {
    label: "Shell & CI exit codes",
    description: "Find silent-green pipelines and portability traps",
    body: `Audit <SCRIPTS_OR_WORKFLOW_DIFF> for <SHELL_AND_OS_MATRIX>. Assume a middle command can fail while the script or CI job reports success.

Reconstruct exit status through every pipeline, function, conditional, subshell, trap, and final command. Check errexit/nounset/pipefail assumptions; stale $? reads; command substitution masked by local; continue-on-error; pipes and xargs; quoting/globbing; unset destructive paths; bashisms under sh; GNU/BSD differences; background jobs; cleanup that overwrites the original status; and mutable CI action tags.

For each finding report: SEVERITY (P0 silent-green, P1 platform failure, P2 robustness), LOCATION, the exact failing command and misleading result, and MINIMAL REPRO. No findings requires a trace of every script, pipeline, and exit path.`
  },
  {
    label: "Agent output verification",
    description: "Audit a worker's done claim against its frozen brief",
    body: `Treat the coding worker's completion report as untrusted testimony. Audit <ACTUAL_DIFF> and repository evidence against <WORKER_BRIEF>, <FILE_SCOPE>, and <ACCEPTANCE_CRITERIA>.

Build a traceability table from every requirement to changed lines and verification evidence. Audit brief → diff for missing, partial, contradicted, or unverified work; then diff → brief for out-of-scope edits, hidden behavior, generated noise, weakened/skipped tests, unexplained dependencies, placeholders, and untracked deliverables. Independently inspect the files and actual command output; do not trust claimed tests or pre-existing-failure labels.

Report failures as SEVERITY, LOCATION, FAILURE SCENARIO, and MINIMAL REPRO. End with VERDICT: ACCEPT, RETURN_TO_WORKER, or REJECT_DIFF. ACCEPT requires complete traceability, authorized scope, and credible final-state verification; always list evidence gaps.`
  },
  {
    label: "Deploy log & success markers",
    description: "Catch rollbacks and partial releases that read as successes",
    body: `Audit <DEPLOY_LOG> and <PIPELINE_CONFIG> for <RELEASE_PROCESS>. Assume the log contains at least one success-shaped line that does not mean the release is live.

Identify every line that could be read as success—including health-check passes, stage verifications, and rollback confirmations—and determine which stage emitted each. Check that exactly one unambiguous success marker exists, that it is printed only after the final post-switch gate, and that nothing on the failure or rollback path can produce or resemble it. An auto-rollback that verifies itself still means the deploy failed. Verify the pipeline reports the active release path and health state from the running system, not from pipeline state.

For each finding report: SEVERITY (P0 false success, P1 ambiguous marker, P2 observability), LOCATION, the exact line and the condition under which it misleads, and MINIMAL REPRO. A no-findings result must list each success-shaped string, the stage that emits it, and why it cannot appear on a failed or rolled-back deploy.`
  },
  {
    label: "Worker completion & stalls",
    description: "Judge parallel agent runs by per-tool markers, not exit codes",
    body: `Audit <WORKER_RUNS> (logs, exit codes, outputs) against <TASK_BRIEFS> for a pool of heterogeneous coding agents. Assume at least one run exited cleanly without completing its task, and at least one completed run looks stalled.

Classify each run as RUNNING, DONE, FAILED, or STALL (the process story and the work story disagree). Decide completion with the marker of that specific tool—a line, event, or exit signature printed only on normal completion—and never generalize one tool's marker to another. A missing marker means UNKNOWN, not FAILED: read the output body for an actual conclusion before judging. Warning strings inside logs are informational unless the exit code is nonzero, and log line count is never a signal—a long single-line output produces a short file. Do not mark the batch complete until every run's result body has been read.

Report per run: state, the evidence line, and any unread or ambiguous output. Then give a batch verdict and separate runs needing reassignment from runs needing only a re-read. A no-findings result must include the marker table used and the classification of every run.`
  },
  {
    label: "Rules-file enforcement",
    description: "Prove CLAUDE.md/AGENTS.md rules actually load and bind",
    body: `Audit <RULES_FILE> against <AGENT_RUNTIME_CONFIG> and <SESSION_EVIDENCE>. Assume at least one critical rule is not in effect despite being present in the file.

Check: total file size against the runtime's combine or truncation limit—rules past the limit are silently unread; that the runtime path resolves to the file actually being edited (symlinks, overrides, nested files); that recent sessions did not shrink or drop sections (compare hash or section list against the last verified state); and that each critical rule is phrased as a checkable instruction rather than background prose. Then verify enforcement, not presence: for every critical rule, name the execution path where it changes behavior—a command, gate, checklist step, or review step—or mark it DOCUMENTATION_ONLY. Where possible, confirm with a fresh read-only agent process reciting the critical rules; correct file contents prove nothing about what the runtime loaded.

Report: SEVERITY (P0 rule not loading, P1 unenforced critical rule, P2 drift risk), LOCATION, evidence, and the smallest enforcement mechanism. No findings requires the size-versus-limit arithmetic, the resolved path, and an enforcement mapping for every critical rule.`
  },
  {
    label: "Pre-publication leak review",
    description: "Scrub public output for internal data before it ships",
    body: `Review <PUBLIC_ARTIFACT> (page, post, README, image, or screenshot transcript) against <INTERNAL_CONTEXT> immediately before publication. Assume at least one internal detail is still present.

Scan for: private IPs, hostnames, ports, and internal URLs; credentials, tokens, and personal paths; internal metrics including revenue, quotas, limits, and costs; infrastructure details such as service and container names; draft notes, TODOs, and backup files; and anything else not intended for the audience. Check that the artifact's language matches its audience, that every linked destination contains no internal data, that no backup or mirror file sits inside the published location, and that nothing adjacent in the directory is accidentally served.

Report: SEVERITY (P0 internal data public, P1 wrong audience, P2 hygiene), the exact match, and the removal action. Publication is blocked until this review returns zero findings. After publication, re-fetch the live artifact and run the same deny list against the served bytes, and confirm that sensitive paths return not-found.`
  },
  {
    label: "Retry & idempotency safety",
    description: "Verify failed verification cannot cause duplicate actions",
    body: `Audit <AUTOMATION_DIFF> for every action with side effects—posts, sends, writes, deploys, purchases, mutations. Assume a verification step can fail after the action succeeded, and that the retry path then performs the action a second time.

For each side-effecting action, trace: the states its result can take (done, verified, cannot-judge, failed); what the retry policy does in each; and whether an idempotency guard exists that detects an already-performed action before re-performing it. Require that cannot-judge states never trigger blind retries—they must be re-resolved through an independent channel—that guards are checked before the action, and that per-item attempt caps and terminal states exist. Check concurrency: two simultaneous runs must not both act.

Report: SEVERITY (P0 duplicate side effect, P1 unbounded retry, P2 classification), LOCATION, the exact interleaving or state sequence that triggers it, and MINIMAL REPRO. No findings requires a state table for every side-effecting action: states, transitions, retry behavior, and guard.`
  }
];
