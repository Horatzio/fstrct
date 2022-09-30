"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimicChanges = exports.importFiles = void 0;
const vscode_1 = require("vscode");
const vscode_2 = require("vscode");
async function importFiles(currentFolder, vfs, scheme) {
    for (const [name, type] of await vscode_2.workspace.fs.readDirectory(currentFolder)) {
        if (type === vscode_1.FileType.File) {
            const fileUri = vscode_1.Uri.joinPath(currentFolder, name);
            vscode_2.window.showInformationMessage(`Copying ${fileUri}`);
            const segments = currentFolder.path.split('/');
            const directory = segments[segments.length - 1];
            const destinationFileUri = fileUri.with({ scheme, path: `/${name}` });
            vscode_2.window.showInformationMessage(`Copying to ${destinationFileUri}`);
            vfs.writeFile(destinationFileUri, Buffer.from(''), { create: true, overwrite: true });
        }
        else if (type === vscode_1.FileType.Directory) {
            const folderUri = vscode_1.Uri.joinPath(currentFolder, name);
            vscode_2.window.showInformationMessage(`Recursively Copying from ${folderUri}`);
            await importFiles(folderUri, vfs, scheme);
        }
    }
}
exports.importFiles = importFiles;
function mimicChanges(realFileSystem, virtualFileSystem) {
    realFileSystem.onDidChange(async (entry) => {
        vscode_2.window.showInformationMessage(`onDidChange ${entry.path}`);
        const content = await vscode_2.workspace.fs.readFile(entry);
        virtualFileSystem.writeFile(entry, content, { create: true, overwrite: true });
    });
    realFileSystem.onDidCreate(async (entry) => {
        vscode_2.window.showInformationMessage(`onDidCreate ${entry.path}`);
        // const content = await workspace.fs.readFile(entry);
        virtualFileSystem.writeFile(entry, Buffer.from(''), { create: true, overwrite: true });
    });
    realFileSystem.onDidDelete((entry) => {
        vscode_2.window.showInformationMessage(`onDidDelete ${entry.path}`);
        virtualFileSystem.delete(entry, { recursive: true });
    });
}
exports.mimicChanges = mimicChanges;
//# sourceMappingURL=real-file-system.js.map