import { App, Modal, TextComponent } from 'obsidian';

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
    new TextComponent(contentEl).then((textEl) => {
      textEl.setValue(this.name).onChange((name) => (this.name = name));
      const { inputEl } = textEl;
      inputEl.className = 'prompt-input';
      inputEl.addEventListener('keypress', (event) => {
        if (event.key == 'Enter') {
          this.submit();
        }
      });
      inputEl.focus();
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
