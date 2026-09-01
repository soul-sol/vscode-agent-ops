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
  }
];
