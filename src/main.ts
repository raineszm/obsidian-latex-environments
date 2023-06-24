import { MarkdownView, Notice, Plugin, Editor } from 'obsidian';
import { ensureSettings, LatexEnvironmentsSettings } from './settings';
import { EnvModal } from './envmodal';
import { LatexEnvironmentsSettingTab } from './latexEnvironmentsSettingsTab';
import { InsertAction } from './actions/insertAction';
import { ChangeAction } from './actions/changeAction';
import { Action } from './actions/action';
import { DeleteAction } from './actions/deleteAction';
import { EditorLike, EditorShim } from './editorLike';

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
      editorCallback: this.mathModeCallback(InsertAction),
    });

    this.addCommand({
      id: 'change-latex-env',
      name: 'Change LaTeX environment',
      editorCallback: this.mathModeCallback(ChangeAction),
    });

    this.addCommand({
      id: 'delete-latex-env',
      name: 'Delete LaTeX environment',
      editorCallback: this.mathModeCallback(DeleteAction),
    });

    this.addSettingTab(new LatexEnvironmentsSettingTab(this.app, this));
  }

  private mathModeCallback<A extends Action>(
    ActionType: new (doc: EditorLike) => A,
  ) {
    return (editor: Editor, _view: MarkdownView) => {
      try {
        const doc = new EditorShim(editor);
        const action = new ActionType(doc).prepare();
        this.withPromptName(editor, action);
      } catch (e: any) {
        /* eslint-disable-next-line no-new */
        new Notice(e.message);
      }
    };
  }

  private withPromptName(editor: EditorLike, action: Action): void {
    const call = (envName: string): void => {
      editor.transaction(action.transaction(envName));
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
