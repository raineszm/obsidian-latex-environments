import { App, FuzzySuggestModal } from 'obsidian';
import { LatexEnvironmentsSettings } from './settings';

export class EnvModal extends FuzzySuggestModal<string> {
  private matched: boolean = false;
  static ENVIRONMENTS = ['equation', 'multline'];
  constructor(
    app: App,
    private readonly settings: LatexEnvironmentsSettings,
    private readonly name: string,
    private readonly callback: (name: string) => void,
  ) {
    super(app);
    this.setInstructions([
      { command: '↑↓', purpose: 'to navigate' },
      { command: '↵', purpose: 'to select' },
      { command: 'esc', purpose: 'to dismiss' },
    ]);
    this.setPlaceholder('environment name');
  }

  public getItems(): string[] {
    return Array.from(
      new Set(
        [this.settings.defaultEnvironment].concat(
          this.settings.customEnvironments,
          EnvModal.ENVIRONMENTS,
        ),
      ),
    );
  }

  public getItemText(item: string): string {
    this.matched = true;
    return item;
  }

  public onNoSuggestion(): void {
    this.matched = false;
  }

  public onChooseItem(item: string, _evt: MouseEvent | KeyboardEvent): void {
    if (this.matched) {
      this.callback(item);
    } else {
      this.callback(this.inputEl.value);
    }
  }

  static callback(
    app: App,
    settings: LatexEnvironmentsSettings,
    defaultName: string,
    call: (name: string) => void,
  ): void {
    new EnvModal(app, settings, defaultName, call).open();
  }
}
