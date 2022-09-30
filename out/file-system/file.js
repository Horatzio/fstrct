"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const vscode_1 = require("vscode");
class File {
    constructor(name) {
        this.type = vscode_1.FileType.File;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size = 0;
        this.name = name;
    }
}
exports.File = File;
//# sourceMappingURL=file.js.map