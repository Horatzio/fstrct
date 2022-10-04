import { FolderStructConfiguration } from '../engine/folder-struct-configuration';
import * as fs from 'fs';
import * as path from 'path';

export class ConfigReader {
    public static read(rootPath: string): FolderStructConfiguration {

        const reader = new ConfigReader(rootPath);
        return reader.read();
    }

    private rootPath: string;
    private constructor(rootPath: string) {
        this.rootPath = rootPath;
    }

    private readonly configFile = 'fstrct.json';
    private read(): FolderStructConfiguration {
        const configPath = path.join(this.rootPath, this.configFile);

        if (!fs.existsSync(configPath)) {
            return this.defaultConfig(this.rootPath);
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        return this.verifyAndValidate(config);
    }

    private verifyAndValidate(config: any): FolderStructConfiguration {
        throw new Error('Method not implemented.');
    }

    private defaultConfig(rootPath: string): FolderStructConfiguration {
        return {
            rootPath
        };
    }
}