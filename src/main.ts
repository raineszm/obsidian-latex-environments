import { MarkdownView, Notice, Plugin } from 'obsidian';
import { LatexEnvironmentsSettings } from './settings';
import * as CodeMirror from 'codemirror';
import { MathBlock } from './mathblock';
import { EnvModal } from './envmodal';
import { LatexEnvironmentsSettingTab } from './latexEnvironmentsSettingsTab';
import { InsertAction } from './actions/insertAction';
import { ChangeAction } from './actions/changeAction';
import { Action } from './actions/action';

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
      checkCallback: this.mathModeCallback((doc) => new InsertAction(doc)),
    });

    this.addCommand({
      id: 'change-latex-env',
      name: 'Change LaTeX environment',
      checkCallback: this.mathModeCallback((doc) => new ChangeAction(doc)),
    });

    this.addCommand({
      id: 'delete-latex-env',
      name: 'Delete LaTeX environment',
      checkCallback: this.mathModeCallback((doc) => new ChangeAction(doc)),
    });

    this.addSettingTab(new LatexEnvironmentsSettingTab(this.app, this));
  }

  private mathModeCallback(actionFactory: (doc: CodeMirror.Doc) => Action) {
    return (checking: boolean) => {
      const leaf = this.app.workspace.activeLeaf;
      if (leaf && leaf.view instanceof MarkdownView) {
        const editor = leaf.view.sourceMode.cmEditor;
        const cursor = editor.getCursor();

        if (!MathBlock.isMathMode(cursor, editor)) {
          return false;
        }

        if (!checking) {
          try {
            const action = actionFactory(editor.getDoc()).prepare();
            this.withPromptName(editor, action);
          } catch (e) {
            new Notice(e.message);
          }
        }
        return true;
      }
      return false;
    };
  }

  private withPromptName(editor: CodeMirror.Editor, action: Action) {
    const call = (envName: string) => {
      editor.operation(() => action.execute(envName));
      editor.focus();
    };

    if (action.needsName) {
      EnvModal.promise(
        this.app,
        action.suggestName() || this.settings.defaultEnvironment,
      ).then(call);
    } else {
      action.execute('*');
    }
  }
}
