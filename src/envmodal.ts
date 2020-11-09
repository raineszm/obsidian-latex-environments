import { App, Modal, Setting } from 'obsidian';

export class EnvModal extends Modal {
  private submitted = false;
  constructor(
    app: App,
    private name: string,
    private resolve: (name: string) => void,
    private reject: () => void,
  ) {
    super(app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'Environment?' });
    new Setting(contentEl)
      .setName('new name')
      .addText((text) => {
        text.setValue(this.name).onChange((value) => (this.name = value));
        const textEl = text.inputEl;
        textEl.addEventListener('keypress', (event) => {
          if (event.key == 'Enter') {
            this.submit();
          }
        });
        textEl.focus();
      })
      .addButton((button) => {
        button
          .setButtonText('Go')
          .setCta()
          .onClick(() => {
            this.submit();
          });
      });
  }

  private submit(): void {
    this.submitted = true;
    this.resolve(this.name);
    this.close();
  }

  onClose(): void {
    const { contentEl } = this;
    contentEl.empty();
    if (!this.submitted) this.reject();
  }

  static promise(app: App, defaultName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      new EnvModal(app, defaultName, resolve, reject).open();
    });
  }
}
