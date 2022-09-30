import { FileSystemWatcher, Uri, FileSystemProvider, FileType } from 'vscode';
import { workspace, window } from 'vscode';

export async function importFiles(currentFolder: Uri, vfs: FileSystemProvider, scheme: string) {
    for (const [name, type] of await workspace.fs.readDirectory(currentFolder)) {
        if (type === FileType.File) {
            const fileUri = Uri.joinPath(currentFolder, name);
            window.showInformationMessage(`Copying ${fileUri}`);
            

            const segments = currentFolder.path.split('/');
            const directory = segments[segments.length - 1];

            const destinationFileUri = fileUri.with({ scheme, path: `/${name}` });
            window.showInformationMessage(`Copying to ${destinationFileUri}`);
            vfs.writeFile(destinationFileUri, Buffer.from(''), { create: true, overwrite: true });
        } else if (type === FileType.Directory) {
            const folderUri = Uri.joinPath(currentFolder, name);
            window.showInformationMessage(`Recursively Copying from ${folderUri}`);
            await importFiles(folderUri, vfs, scheme);
        }
    }
}

export function mimicChanges(realFileSystem: FileSystemWatcher, virtualFileSystem: FileSystemProvider) {
    realFileSystem.onDidChange(async (entry) => {
        window.showInformationMessage(`onDidChange ${entry.path}`);
        const content = await workspace.fs.readFile(entry);
        virtualFileSystem.writeFile(entry, content, { create: true, overwrite: true });
    });
    realFileSystem.onDidCreate(async (entry) => {
        window.showInformationMessage(`onDidCreate ${entry.path}`);
        // const content = await workspace.fs.readFile(entry);
        virtualFileSystem.writeFile(entry, Buffer.from(''), { create: true, overwrite: true});
    });
    realFileSystem.onDidDelete((entry) => {
        window.showInformationMessage(`onDidDelete ${entry.path}`);
        virtualFileSystem.delete(entry, { recursive: true });
    });
}