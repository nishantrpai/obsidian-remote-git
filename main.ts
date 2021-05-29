import { App, Vault, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import simpleGit, { SimpleGit } from 'simple-git';
const git: SimpleGit = simpleGit();


interface MyPluginSettings {
	git_url: string;
	branch: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	git_url: 'default',
	branch: 'main'
}



const pullChanges = async (url: string, branch: string) => {
	console.log(`pulling from remote branch ${url}, ${branch}`);
	console.log(process.cwd());
	console.log(new Vault());
	// await git.pull('origin', branch);
	new Notice('Pulling changes');
}

const pushChanges = async (url: string, branch: string) => {
	console.log(`pushing to remote branch ${url}, ${branch}`);
	// await git.add('./*').commit("commit from plugin").push('origin', branch);
	new Notice('Pushing changes');
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;


	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		// Pull git changes	
		pullChanges(this.settings.git_url, this.settings.branch);

		this.addRibbonIcon('up-arrow-with-tail', 'Push changes', () => {
			pushChanges(this.settings.git_url, this.settings.branch);
		});

		this.addStatusBarItem().setText('Status Bar Text');

		this.addSettingTab(new SampleSettingTab(this.app, this));
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
				}));

		new Setting(containerEl)
			.setName('Branch Name')
			.setDesc('')
			.addText(text => text
				.setPlaceholder('main')
				.setValue(this.plugin.settings.branch)
				.onChange(async (value) => {
					console.log(value);
					this.plugin.settings.branch = value;
					await this.plugin.saveSettings();
				}));

	}
}
