import { MarkdownView, Notice, Plugin } from 'obsidian';
import { ensureSettings, LatexEnvironmentsSettings } from './settings';
import CodeMirror from 'codemirror';
import { MathBlock } from './mathblock';
import { EnvModal } from './envmodal';
import { LatexEnvironmentsSettingTab } from './latexEnvironmentsSettingsTab';
import { InsertAction } from './actions/insertAction';
import { ChangeAction } from './actions/changeAction';
import { Action } from './actions/action';
import { DeleteAction } from './actions/deleteAction';

export default class LatexEnvironments extends Plugin {
  public settings: LatexEnvironmentsSettings = new LatexEnvironmentsSettings();

  async onload(): Promise<void> {
    const settings = await this.loadData();
    if (settings !== null) {
      this.settings = ensureSettings(settings);
    }

    this.addCommand({
      id: 'insert-latex-env',
      name: 'Insert LaTeX environment',
      checkCallback: this.mathModeCallback(InsertAction),
    });

    this.addCommand({
      id: 'change-latex-env',
      name: 'Change LaTeX environment',
      checkCallback: this.mathModeCallback(ChangeAction),
    });

    this.addCommand({
      id: 'delete-latex-env',
      name: 'Delete LaTeX environment',
      checkCallback: this.mathModeCallback(DeleteAction),
    });

    this.addSettingTab(new LatexEnvironmentsSettingTab(this.app, this));
  }

  private mathModeCallback<A extends Action>(
    ActionType: new (doc: CodeMirror.Doc) => A,
  ) {
    return (checking: boolean) => {
      const leaf = this.app.workspace.activeLeaf;
      if (leaf.view instanceof MarkdownView) {
        const editor = leaf.view.sourceMode.cmEditor;
        const cursor = editor.getCursor();

        if (!MathBlock.isMathMode(cursor, editor)) {
          return false;
        }

        if (!checking) {
          try {
            const action = new ActionType(editor.getDoc()).prepare();
            this.withPromptName(editor, action);
          } catch (e) {
            /* eslint-disable-next-line no-new */
            new Notice(e.message);
          }
        }
        return true;
      }
      return false;
    };
  }

  private withPromptName(editor: CodeMirror.Editor, action: Action): void {
    const call = (envName: string): void => {
      editor.operation(() => action.execute(envName));
      editor.focus();
    };

    if (action.needsName) {
      const suggested = action.suggestName();
      EnvModal.callback(
        this.app,
        this.settings,
        suggested !== undefined ? suggested : this.settings.defaultEnvironment,
        call,
      );
    } else {
      call('*');
    }
  }
}
