import * as vscode from 'vscode';
import { ExtensionContext, Uri, FileSystemError } from 'vscode';
import { VirtualFileSystem } from './file-system/virtual-file-system';
import { importFiles, mimicChanges } from './file-system/real-file-system';

let scheme = '';

export function activate(context: ExtensionContext) {
    let fstrctInit = vscode.commands.registerCommand('fstrct.init', () => {
		vscode.window.showInformationMessage('Starting fstrct...');
	});
	context.subscriptions.push(fstrctInit);

	const currentFolder = getCurrentFolder();

	const vfs = new VirtualFileSystem();

    const segments = currentFolder.uri.path.split('/');

    const pattern = `**/${segments[segments.length - 1]}/**`;

    const realFs = vscode.workspace.createFileSystemWatcher(pattern);
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider(scheme, vfs, { isCaseSensitive: true }));

    importFiles(currentFolder.uri, vfs, scheme);
    vscode.window.showInformationMessage(`Watching ${pattern}`);
    mimicChanges(realFs, vfs);
}

function getCurrentFolder() {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No folder or workspace opened');
        throw new FileSystemError();
    }

    const currentFolder = vscode.workspace.workspaceFolders.filter(f => !f.uri?.scheme.match(/fstrct-.+-scaffolded/))[0];
    if (!currentFolder) {
        throw new FileSystemError();
    }
    
    const fstrctFolder = vscode.workspace.workspaceFolders?.find(f => f.uri?.scheme.match(/fstrct-.+-scaffolded/));

    if (fstrctFolder) {
        scheme = fstrctFolder.uri.scheme;
        return currentFolder;
    }

    const virtualScheme = `fstrct-${currentFolder.uri.scheme}-scaffolded`;
    const root = '/';
    const virtualWorkspaceUri = Uri.parse(`${virtualScheme}:${root}`);

    vscode.workspace.updateWorkspaceFolders(0, 0, 
    { 
            uri: virtualWorkspaceUri,
            name: `${currentFolder.name} (scaffolded)`
    });
    
    scheme = virtualScheme;

    return currentFolder;
}

export function deactivate(context: ExtensionContext) {
    const fstrctFolderIndex = vscode.workspace.workspaceFolders?.findIndex((folder) => folder.uri.scheme === scheme);
    if (fstrctFolderIndex) {
        vscode.workspace.updateWorkspaceFolders(fstrctFolderIndex, 1);
    }
}
