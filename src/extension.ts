import * as vscode from "vscode";
import { CLAUDE_MD_PATTERNS } from "./patterns";
import { REVIEW_PROMPTS, type InsertablePrompt } from "./prompts";

const TASK_BRIEF = `# Task Brief

## TASK

<One-line goal>

## CONTEXT

- Project path: <PROJECT_DIR>
- Files to read first: <FILE_1>, <FILE_2>
- Background: <Why this is needed>

## SCOPE

- <Specific task 1>
- <Specific task 2>

## OUT-OF-SCOPE

- Do not refactor unrelated files
- Do not access or output secrets
- <Additional boundary>

## EXECUTION RULE

Do not ask questions; implement immediately. If unclear, choose the smallest reasonable in-scope default and record the assumption. Stop only for a decision that materially changes scope or requires human-owned authority.

## DONE-CRITERIA

- <File or behavior criterion>
- <Regression condition>
- Final output line: DONE: <change summary>

## VERIFY

<Exact verification command>

Check the command's exit code. If it fails, report the cause and next action.

## REPORT

- Changed files:
- Verification command and exit code:
- Assumptions:
- Remaining risks or blockers:
`;

interface PromptPick extends vscode.QuickPickItem {
  readonly body: string;
}

async function choosePrompt(
  title: string,
  placeholder: string,
  prompts: readonly InsertablePrompt[]
): Promise<string | undefined> {
  const items: PromptPick[] = prompts.map(({ label, description, body }) => ({
    label,
    description,
    body
  }));

  const selected = await vscode.window.showQuickPick(items, {
    title,
    placeHolder: placeholder,
    matchOnDescription: true
  });

  return selected?.body;
}

async function insertAtCursor(text: string): Promise<void> {
  let editor = vscode.window.activeTextEditor;

  if (!editor) {
    const document = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: ""
    });
    editor = await vscode.window.showTextDocument(document);
  }

  const inserted = await editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, text);
  });

  if (!inserted) {
    void vscode.window.showErrorMessage(
      "Agent Ops could not insert text into the active editor. Open a writable document and try again."
    );
  }
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("agentOps.insertReviewPrompt", async () => {
      const prompt = await choosePrompt(
        "Agent Ops: Adversarial Review",
        "Choose the failure mode to investigate",
        REVIEW_PROMPTS
      );
      if (prompt) {
        await insertAtCursor(prompt);
      }
    }),

    vscode.commands.registerCommand("agentOps.insertClaudeMdPattern", async () => {
      const pattern = await choosePrompt(
        "Agent Ops: CLAUDE.md Pattern",
        "Choose an operating rule to insert",
        CLAUDE_MD_PATTERNS
      );
      if (pattern) {
        await insertAtCursor(pattern);
      }
    }),

    vscode.commands.registerCommand("agentOps.newTaskBrief", async () => {
      await insertAtCursor(TASK_BRIEF);
    }),

    vscode.commands.registerCommand("agentOps.getFullKit", async () => {
      const opened = await vscode.env.openExternal(
        vscode.Uri.parse("https://lifestep1.gumroad.com/l/complete-agent-ops-kit")
      );
      if (!opened) {
        void vscode.window.showWarningMessage(
          "Agent Ops could not open the Complete Agent Ops Kit URL."
        );
      }
    })
  );
}

export function deactivate(): void {
  // VS Code disposes registered commands through the extension context.
}
