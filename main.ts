import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MyPluginSettings {
	git_url: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	git_url: 'default'
}



const pullChanges = (url: string) => {
	console.log(`pulling from remote branch ${url}`);
	new Notice('Pulling changes');
}

const pushChanges = (url: string) => {
	console.log(`pushing to remote branch ${url}`);
	new Notice('Pushing changes');
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		// Pull git changes	
		pullChanges(this.settings.git_url);

		this.addRibbonIcon('up-arrow-with-tail', 'Push changes', () => {
			pushChanges(this.settings.git_url);
		});

		this.addStatusBarItem().setText('Status Bar Text');

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Git Config' });

		new Setting(containerEl)
			.setName('Git URL')
			.setDesc('Github/Gitlab remote SSH URL')
			.addText(text => text
				.setPlaceholder('git@github.com:username/secondbrain.git')
				.setValue(this.plugin.settings.git_url)
				.onChange(async (value) => {
					console.log(value);
					this.plugin.settings.git_url = value;
					await this.plugin.saveSettings();
					new Notice('Updated Git URL');
				}));
	}
}
