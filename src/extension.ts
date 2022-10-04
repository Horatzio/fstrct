import { ExtensionContext, commands, window, workspace } from 'vscode';
import { FolderStructView } from './tree-view/folder-struct-view';
import { FolderStructEngine } from './engine/folder-struct-engine';
import { ConfigReader } from './config/config-reader';

export async function activate(context: ExtensionContext) {
    registerCommands(context);

    const rootPath = (workspace.workspaceFolders && (workspace.workspaceFolders.length > 0))
		? workspace.workspaceFolders[0].uri.fsPath : undefined;

    if (!rootPath) {
        window.showErrorMessage('No open workspace.');
    }

    const config = ConfigReader.read(rootPath);

    const engine = await FolderStructEngine.start(config);
    FolderStructView.create(context, engine);
}

function registerCommands(context: ExtensionContext) {
    const initCommand = commands.registerCommand('fstrct.init', () => {
		window.showInformationMessage('Starting fstrct...');
	});
	context.subscriptions.push(initCommand);
}

export function deactivate() { }
