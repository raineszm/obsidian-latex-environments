import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { LatexEnvironmentsSettings } from './settings';
import * as CodeMirror from 'codemirror';
import { MathBlock } from './mathblock';
import { EnvModal } from './envmodal';

export default class LatexEnvironments extends Plugin {
  public settings: LatexEnvironmentsSettings;

  onload(): void {
    this.loadData().then((settings) => {
      this.settings = settings || new LatexEnvironmentsSettings();
    });

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

  private static isMathMode(
    cursor: CodeMirror.Position,
    doc: CodeMirror.Editor,
  ) {
    const token = doc.getTokenAt(cursor);
    const state = token.state;
    return state.hmdInnerStyle === 'math';
  }

  private mathModeCallback(
    callback: (cursor: CodeMirror.Position, doc: CodeMirror.Editor) => void,
  ) {
    return (checking: boolean) => {
      const leaf = this.app.workspace.activeLeaf;
      if (leaf) {
        const view = leaf.view as MarkdownView;
        const doc = view.sourceMode.cmEditor;
        const cursor = doc.getCursor();

        if (!LatexEnvironments.isMathMode(cursor, doc)) {
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
    doc: CodeMirror.Editor,
  ) => {
    const picker = new EnvModal(
      this.app,
      this.settings.defaultEnvironment,
      (envName: string) => {
        const newEnvironment = `\n\\begin{${envName}}\n\n\\end{${envName}}\n`;
        doc.replaceRange(newEnvironment, cursor);
        doc.setCursor({ line: cursor.line + 2, ch: 0 });
        doc.focus();
      },
    );
    picker.open();
  };

  private changeEnvironment = (
    cursor: CodeMirror.Position,
    doc: CodeMirror.Editor,
  ) => {
    const block = new MathBlock(doc, cursor);
    const current = block.getEnclosingEnvironment(cursor);
    let start = { from: block.startPosition, to: block.startPosition };
    let end = { from: block.endPosition, to: block.endPosition };
    if (current) {
      start = current.start;
      if (current.end) {
        end = current.end;
      }
    }
    const picker = new EnvModal(
      this.app,
      current.name || this.settings.defaultEnvironment,
      (envName: string) => {
        doc.replaceRange(`\\begin{${envName}}`, start.from, start.to);
        doc.replaceRange(`\\end{${envName}}`, end.from, end.to);
        doc.focus();
      },
    );
    picker.open();
  };

  // onUnload(): void {}
}

class LatexEnvironmentsSettingTab extends PluginSettingTab {
  private plugin: LatexEnvironments;

  constructor(app: App, plugin: LatexEnvironments) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Settings for latex environments.' });

    new Setting(containerEl)
      .setName('Default environment')
      .setDesc('The default environment to insert')
      .addText((text) =>
        text
          .setPlaceholder('environment')
          .setValue(this.plugin.settings.defaultEnvironment)
          .onChange(async (value) => {
            this.plugin.settings.defaultEnvironment = value;
            await this.plugin.saveData(this.plugin.settings);
          }),
      );
  }
}
