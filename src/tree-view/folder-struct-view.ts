import { window, ExtensionContext, TreeDataProvider, CancellationToken, Event, ProviderResult, TreeItem, EventEmitter, TreeItemCollapsibleState } from 'vscode';
import { FolderStructEngine } from '../engine/folder-struct-engine';
import { FolderStructure } from '../engine/folder-structure';

export class FolderStructView {
    public static create(context: ExtensionContext, engine: FolderStructEngine) {
		const provider = new FolderStructTreeDataProvider();
        const view = window.createTreeView('fstrctView', { treeDataProvider: provider, showCollapseAll: true });
        context.subscriptions.push(view);

		engine.addSubscriber((fstrct) => {
			provider.update(fstrct);
		});
    }
}

interface FolderStructNode {
    path: string;
	name: string;
}

class FolderStructTreeDataProvider implements TreeDataProvider<FolderStructNode> {

	private eventEmitter = new EventEmitter<void | FolderStructNode | FolderStructNode[] | null | undefined>();
	private folderStructure: FolderStructure | null = null;
    public update(fstrct: FolderStructure) {
		this.folderStructure = fstrct;
		this.eventEmitter.fire(undefined);
	}
	
	onDidChangeTreeData?: Event<void | FolderStructNode | FolderStructNode[] | null | undefined> = this.eventEmitter.event;
    getTreeItem(element: FolderStructNode): TreeItem | Thenable<TreeItem> {
        return {
			id: element.path,
			label: element.name,
			contextValue: 'fstrctView',
			collapsibleState: TreeItemCollapsibleState.Collapsed
		}; 
    }
    getChildren(element?: FolderStructNode): ProviderResult<FolderStructNode[]> {
		if (!this.folderStructure) {
			return [];
		}
        
		if (!element) {

			const root = this.folderStructure.root;
			return [{
				path: `${root.name}`,
				name: root.name,
			}];
		}

		const item = this.folderStructure.find(element.path);
		if (!item) {
			return [];
		}

		return Object.keys(item.children)
			.map(child => ({
				path: `${element.path}/${child}`,
				name: child
			} as FolderStructNode));
    }
}