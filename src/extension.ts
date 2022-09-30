import { ExtensionContext, commands, window, workspace } from 'vscode';
import { FolderStructView } from './tree-view/folder-struct-view';
import { FolderStructEngine } from './engine/folder-struct-engine';

export async function activate(context: ExtensionContext) {
    registerCommands(context);

    if (!workspace.workspaceFolders) { throw new Error(); }
    const folder = workspace.workspaceFolders[0];

    const engine = await FolderStructEngine.start({
        rootPath: folder.uri.path
    });
    FolderStructView.create(context, engine);
}

function registerCommands(context: ExtensionContext) {
    const initCommand = commands.registerCommand('fstrct.init', () => {
		window.showInformationMessage('Starting fstrct...');
	});
	context.subscriptions.push(initCommand);
}

export function deactivate() { }
