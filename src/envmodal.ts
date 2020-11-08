import { App, Modal, Setting } from 'obsidian';

export class EnvModal extends Modal {
  constructor(
    app: App,
    private name: string,
    private callback: (name: string) => void,
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
    this.callback(this.name);
    this.close();
  }

  onClose(): void {
    const { contentEl } = this;
    contentEl.empty();
  }
}
