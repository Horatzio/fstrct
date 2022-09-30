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

        let currentSegment = segments.shift() || '';
        while (segments.length) {
            current = current.children[currentSegment];
            currentSegment = segments.shift() || '';
        }

        return current;
    }
}
