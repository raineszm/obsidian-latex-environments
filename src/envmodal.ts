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
    const prompt = document.createElement('h2');
    prompt.innerText = 'Environment?';
    contentEl.appendChild(prompt);
    const setting = new Setting(contentEl)
      .setName('new name')
      .addText((text) => {
        text.setValue(this.name).onChange((value) => (this.name = value));
      })
      .addButton((button) => {
        button
          .setButtonText('Go')
          .setCta()
          .onClick(() => {
            this.submit();
          });
      });
    const textEntry = setting.controlEl.children[0] as HTMLElement;
    textEntry.focus();
    textEntry.addEventListener('keydown', (event) => {
      if (event.key == 'Enter') {
        this.submit();
      }
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
