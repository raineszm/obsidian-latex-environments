import { MarkdownView, Plugin } from 'obsidian';
import { LatexEnvironmentsSettings } from './settings';
import * as CodeMirror from 'codemirror';
import { MathBlock } from './mathblock';
import { EnvModal } from './envmodal';
import { Environment } from './environment';
import { LatexEnvironmentsSettingTab } from './latexEnvironmentsSettingsTab';

export default class LatexEnvironments extends Plugin {
  public settings: LatexEnvironmentsSettings = new LatexEnvironmentsSettings();

  async onload(): Promise<void> {
    const settings = await this.loadData();
    if (settings) {
      this.settings = settings;
    }

    this.addCommand({
      id: 'insert-latex-env',
      name: 'Insert LaTeX environment',
      checkCallback: this.mathModeCallback(this.insertEnvironment),
    });

    this.addCommand({
      id: 'change-latex-env',
      name: 'Change LaTeX environment',
      checkCallback: this.mathModeCallback(this.changeEnvironment),
    });

    this.addSettingTab(new LatexEnvironmentsSettingTab(this.app, this));
  }

  private mathModeCallback(
    callback: (cursor: CodeMirror.Position, editor: CodeMirror.Editor) => void,
  ) {
    return (checking: boolean) => {
      const leaf = this.app.workspace.activeLeaf;
      if (leaf && leaf.view instanceof MarkdownView) {
        const doc = leaf.view.sourceMode.cmEditor;
        const cursor = doc.getCursor();

        if (!MathBlock.isMathMode(cursor, doc)) {
          return false;
        }

        if (!checking) {
          callback(cursor, doc);
        }
        return true;
      }
      return false;
    };
  }

  private insertEnvironment = (
    cursor: CodeMirror.Position,
    editor: CodeMirror.Editor,
  ) => {
    if (editor.somethingSelected()) {
      return this.wrapEnvironment(
        editor,
        editor.getCursor('from'),
        editor.getCursor('to'),
      );
    }
    this.withPromptName(
      editor,
      this.settings.defaultEnvironment,
      (envName: string) => {
        const newEnvironment = `\n\\begin{${envName}}\n\n\\end{${envName}}\n`;
        editor.replaceRange(newEnvironment, cursor);
        editor.setCursor({ line: cursor.line + 2, ch: 0 });
      },
    );
  };

  private changeEnvironment = (
    cursor: CodeMirror.Position,
    editor: CodeMirror.Editor,
  ) => {
    const block = new MathBlock(editor, cursor);
    const current =
      block.getEnclosingEnvironment(cursor) ||
      new Environment(
        editor,
        this.settings.defaultEnvironment,
        { from: block.startPosition, to: block.startPosition },
        { from: block.endPosition, to: block.endPosition },
      );
    this.withPromptName(
      editor,
      (current && current.name) || this.settings.defaultEnvironment,
      (envName: string) => current.replace(envName),
    );
  };

  // onUnload(): void {}
  private wrapEnvironment(
    editor: CodeMirror.Editor,
    from: CodeMirror.Position,
    to: CodeMirror.Position,
  ) {
    this.withPromptName(
      editor,
      this.settings.defaultEnvironment,
      (envName: string) => {
        editor.replaceRange(`\n\\end{${envName}}`, to);
        editor.replaceRange(`\\begin{${envName}}\n`, from);
        editor.setSelection({
          line: from.line + 1,
          ch: 0,
        });
      },
    );
  }

  private withPromptName(
    editor: CodeMirror.Editor,
    defaultName: string,
    callback: (envName: string) => void,
  ) {
    new EnvModal(this.app, defaultName, (envName) => {
      editor.operation(() => callback(envName));
      editor.focus();
    }).open();
  }
}
