import { FileType, Uri, workspace } from "vscode";
import { FolderStructure } from "./folder-structure";
import { FolderStructConfiguration } from "./folder-struct-configuration";
import { Item } from "./item";
import { getName } from "./uri-helper";

type Callback = (fstrct: FolderStructure) => void;

export class FolderStructEngine {
    private readonly config: FolderStructConfiguration;
    private folderStructure: FolderStructure;
    public constructor(config: FolderStructConfiguration, folderStructure: FolderStructure) {
        this.config = config;
        this.folderStructure = folderStructure;
    }

    public static async start(config: FolderStructConfiguration) {
        const rootUri = Uri.file(config.rootPath);
        const children = await this.parseFolder(rootUri);
        const rootStat = await workspace.fs.stat(rootUri);
        const root: Item = {
            name: getName(rootUri),
            isReal: true,
            children,
            type: rootStat.type
        };
        const engine = new FolderStructEngine(config, new FolderStructure(root));
        engine.startWatcher();
        return engine;
    }

    private static async parseFolder(folderUri: Uri): Promise<Record<string, Item>> {
        const entries = await workspace.fs.readDirectory(folderUri);

        const items = entries.map(([name, type]) => ({
            name,
            type,
            children: {},
            isReal: true
        }))
        .filter(item => item.type === FileType.File || item.type === FileType.Directory);

        for(const folder of items.filter(i => i.type === FileType.Directory)) {
            folder.children = await this.parseFolder(
                folderUri.with({
                    path: `${folderUri.path}/${folder.name}`
                })
            );
        }

        const children = items.reduce((acc, item) => ({
            ...acc,
            [item.name]: item
        }), {});

        return children;
    }

    private startWatcher() {
        const watcher = workspace.createFileSystemWatcher(`${this.config.rootPath}/**`, 
            false, true, false);

        watcher.onDidCreate(async (uri) => {
            const { type } = await workspace.fs.stat(uri);

            if (type === FileType.Unknown) { 
                return; 
            }

            if (type === FileType.File) {
                this.addFile(uri.path);
                this.notifySubscribers();
                return;
            }

            const children = await FolderStructEngine.parseFolder(uri);
            this.addFolder(uri.path, {
                name: getName(uri),
                isReal: true,
                type,
                children
            });
            this.notifySubscribers();
        });
        watcher.onDidDelete((uri) => {
            this.delete(uri.path);
            this.notifySubscribers();
        });
    }


    public addFile(path: string) {
    }

    public addFolder(path: string, item: Item) {
    }

    public delete(path: string) {
    }

    private subscribers: Callback[] = [];
    public addSubscriber(callback: Callback) {
        this.subscribers.push(callback);
        callback(this.folderStructure);
    }

    private notifySubscribers() {
        for(const callback of this.subscribers) {
            callback(this.folderStructure);
        }
    }
}