"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Directory = void 0;
const vscode_1 = require("vscode");
class Directory {
    constructor(name) {
        this.type = vscode_1.FileType.Directory;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size = 0;
        this.name = name;
        this.entries = new Map();
    }
}
exports.Directory = Directory;
//# sourceMappingURL=directory.js.map