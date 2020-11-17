import { App, PluginSettingTab, Setting } from 'obsidian';
import LatexEnvironments from './main';

export class LatexEnvironmentsSettingTab extends PluginSettingTab {
  private readonly plugin: LatexEnvironments;

  constructor(app: App, plugin: LatexEnvironments) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Settings for latex environments' });

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
