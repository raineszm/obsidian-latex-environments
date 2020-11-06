import { MarkdownView, Plugin, PluginSettingTab } from 'obsidian';

export default class LatexEnvironments extends Plugin {
  onload(): void {
    this.addCommand({
      id: 'insert-new-env',
      name: 'Insert new environment',
      callback: () => {
        const leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          const view = leaf.view as MarkdownView;
          const doc = view.sourceMode.cmEditor;
          const cursor = doc.getCursor();
          const pos = {
            line: cursor.line + 1,
            ch: 0,
          };
          const newEnvironment = '\\begin{equation}\n\n\\end{equation}\n';
          doc.replaceRange(newEnvironment, pos);
          doc.setCursor({ line: cursor.line + 2, ch: 0 });
          doc.focus();
          return true;
        }
        return false;
      },
    });

    this.addSettingTab(new LatexEnvironmentsSettingTab(this.app, this));
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
  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Settings for latex environments.' });

    // new Setting(containerEl)
    //   .setName('Default environment')
    //   .setDesc('The default environment to insert')
    //   .addText((text) =>
    //     text
    //       .setPlaceholder('environment')
    //       .setValue('equation')
    //       .onChange((value) => {
    //         console.log('Secret: ' + value);
    //       }),
    //   );
  }
}
