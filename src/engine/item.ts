import { FileType } from "vscode";

export interface Item {
    readonly name: string;
    readonly children: Record<string, Item>
    readonly type: FileType
    readonly isReal: boolean;
}
