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
    callback: (cursor: CodeMirror.Position, doc: CodeMirror.Doc) => void,
  ) {
    return (checking: boolean) => {
      const leaf = this.app.workspace.activeLeaf;
      if (leaf && leaf.view instanceof MarkdownView) {
        const editor = leaf.view.sourceMode.cmEditor;
        const cursor = editor.getCursor();

        if (!MathBlock.isMathMode(cursor, editor)) {
          return false;
        }

        if (!checking) {
          callback(cursor, editor.getDoc());
        }
        return true;
      }
      return false;
    };
  }

  private insertEnvironment = (
    cursor: CodeMirror.Position,
    doc: CodeMirror.Doc,
  ) => {
    if (doc.somethingSelected()) {
      return this.wrapEnvironment(
        doc,
        doc.getCursor('from'),
        doc.getCursor('to'),
      );
    }
    this.withPromptName(
      doc.getEditor(),
      this.settings.defaultEnvironment,
      (envName: string) => {
        Environment.create(envName, doc, cursor);
      },
    );
  };

  private changeEnvironment = (
    cursor: CodeMirror.Position,
    doc: CodeMirror.Doc,
  ) => {
    const block = new MathBlock(doc, cursor);
    const current =
      block.getEnclosingEnvironment(cursor) ||
      new Environment(
        doc,
        this.settings.defaultEnvironment,
        { from: block.startPosition, to: block.startPosition },
        { from: block.endPosition, to: block.endPosition },
      );
    this.withPromptName(
      doc.getEditor(),
      (current && current.name) || this.settings.defaultEnvironment,
      (envName: string) => current.replace(envName),
    );
  };

  // onUnload(): void {}
  private wrapEnvironment(
    doc: CodeMirror.Doc,
    from: CodeMirror.Position,
    to: CodeMirror.Position,
  ) {
    this.withPromptName(
      doc.getEditor(),
      this.settings.defaultEnvironment,
      (envName: string) => {
        doc.replaceRange(`\n\\end{${envName}}`, to);
        doc.replaceRange(`\\begin{${envName}}\n`, from);
        doc.setSelection({
          line: from.line + 1,
          ch: 0,
        });
      },
    );
  }

  private withPromptName(
    editor: CodeMirror.Editor | null,
    defaultName: string,
    callback: (envName: string) => void,
  ) {
    EnvModal.promise(this.app, defaultName).then((envName) => {
      if (editor) {
        editor.operation(() => callback(envName));
        editor.focus();
      } else {
        callback(envName);
      }
    });
  }
}
