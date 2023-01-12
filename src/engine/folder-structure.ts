import { Item } from "./Item";

export class FolderStructure { 
    public readonly root: Item;
    public constructor(root: Item) {
        this.root = root;
    }

    public find(path: string) {
        const segments = path.split('/');

        let current = this.root;

        if (segments[0] !== current.name) {
            return null;
        }

        segments.shift();
        let currentSegment = segments[0] || '';
        while (segments.length) {
            current = current.children[currentSegment];
            segments.shift();
            currentSegment = segments[0] || '';
        }

        return current;
    }
}
