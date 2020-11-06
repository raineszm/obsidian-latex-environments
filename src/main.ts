import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { LatexEnvironmentsSettings } from './settings';
import * as CodeMirror from 'codemirror';

export default class LatexEnvironments extends Plugin {
  public settings: LatexEnvironmentsSettings;

  onload(): void {
    this.loadData().then((settings) => {
      this.settings = settings || new LatexEnvironmentsSettings();
    });

    this.addCommand({
      id: 'insert-new-env',
      name: 'Insert new environment',
      checkCallback: (checking) => {
        const leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          const view = leaf.view as MarkdownView;
          const doc = view.sourceMode.cmEditor;
          const cursor = doc.getCursor();

          if (doc.getModeAt(cursor).name !== 'stex') {
            return false;
          }

          if (!checking) {
            this.insertEnvironment(cursor, doc);
          }
          return true;
        }
        return false;
      },
    });

    this.addSettingTab(new LatexEnvironmentsSettingTab(this.app, this));
  }

  private insertEnvironment(
    cursor: CodeMirror.Position,
    doc: CodeMirror.Editor,
    envName?: string,
  ) {
    const pos = {
      line: cursor.line + 1,
      ch: 0,
    };
    envName ||= this.settings.defaultEnvironment;
    const newEnvironment = `\\begin{${envName}}\n\n\\end{${envName}}\n`;
    doc.replaceRange(newEnvironment, pos);
    doc.setCursor({ line: cursor.line + 2, ch: 0 });
    doc.focus();
  }

  // onUnload(): void {}
}

// class SampleModal extends Modal {
//   constructor(app: App) {
//     super(app);
//   }
//
//   onOpen() {
//     const { contentEl } = this;
//     contentEl.setText('Woah!');
//   }
//
//   onClose() {
//     const { contentEl } = this;
//     contentEl.empty();
//   }
// }

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
