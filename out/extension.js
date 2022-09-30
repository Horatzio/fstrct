"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const vscode_1 = require("vscode");
const virtual_file_system_1 = require("./file-system/virtual-file-system");
const real_file_system_1 = require("./file-system/real-file-system");
let scheme = '';
function activate(context) {
    let fstrctInit = vscode.commands.registerCommand('fstrct.init', () => {
        vscode.window.showInformationMessage('Starting fstrct...');
    });
    context.subscriptions.push(fstrctInit);
    const currentFolder = getCurrentFolder();
    const vfs = new virtual_file_system_1.VirtualFileSystem();
    const segments = currentFolder.uri.path.split('/');
    const pattern = `**/${segments[segments.length - 1]}/**`;
    const realFs = vscode.workspace.createFileSystemWatcher(pattern);
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider(scheme, vfs, { isCaseSensitive: true }));
    (0, real_file_system_1.importFiles)(currentFolder.uri, vfs, scheme);
    vscode.window.showInformationMessage(`Watching ${pattern}`);
    (0, real_file_system_1.mimicChanges)(realFs, vfs);
}
exports.activate = activate;
function getCurrentFolder() {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No folder or workspace opened');
        throw new vscode_1.FileSystemError();
    }
    const currentFolder = vscode.workspace.workspaceFolders.filter(f => !f.uri?.scheme.match(/fstrct-.+-scaffolded/))[0];
    if (!currentFolder) {
        throw new vscode_1.FileSystemError();
    }
    const fstrctFolder = vscode.workspace.workspaceFolders?.find(f => f.uri?.scheme.match(/fstrct-.+-scaffolded/));
    if (fstrctFolder) {
        scheme = fstrctFolder.uri.scheme;
        return currentFolder;
    }
    const virtualScheme = `fstrct-${currentFolder.uri.scheme}-scaffolded`;
    const root = '/';
    const virtualWorkspaceUri = vscode_1.Uri.parse(`${virtualScheme}:${root}`);
    vscode.workspace.updateWorkspaceFolders(0, 0, {
        uri: virtualWorkspaceUri,
        name: `${currentFolder.name} (scaffolded)`
    });
    scheme = virtualScheme;
    return currentFolder;
}
function deactivate(context) {
    const fstrctFolderIndex = vscode.workspace.workspaceFolders?.findIndex((folder) => folder.uri.scheme === scheme);
    if (fstrctFolderIndex) {
        vscode.workspace.updateWorkspaceFolders(fstrctFolderIndex, 1);
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map