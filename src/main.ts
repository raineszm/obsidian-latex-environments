import {App, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';

export default class LatexEnvironments extends Plugin {
	onload() {
		console.log('loading plugin');
		this.addCommand({
			id: 'insert-new-env',
			name: 'Insert new environment',
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					const view = leaf.view as MarkdownView;
					const doc = view.sourceMode.cmEditor;
					if (!checking) {
						// new SampleModal(this.app).open();
                        const cursor = doc.getCursor();
                        const line = doc.getLine(cursor.line);
                        const pos = {
                        	line: cursor.line,
							ch: line.length - 1
						};
                        const newEnvironment = '\\begin{equation}\n\n\\end{equation}\n';
						doc.replaceRange(newEnvironment, pos);
                        doc.setCursor({
							line: cursor.line+2,
							ch: 0
						});
					}
					return true;
				}
				return false;
			}
		});

		this.addSettingTab(new LatexEnvironmentsSettingTab(this.app, this));

	}

	onunload() {
		console.log('unloading latex ennvironments');
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

class LatexEnvironmentsSettingTab extends PluginSettingTab {
	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for latex environments.'});

		// new Setting(containerEl)
		// 	.setName('Setting #1')
		// 	.setDesc('It\'s a secret')
		// 	.addText(text => text.setPlaceholder('Enter your secret')
		// 		.setValue('')
		// 		.onChange((value) => {
		// 			console.log('Secret: ' + value);
		// 		}));
		//
	}
}
