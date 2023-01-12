import { FolderStructConfiguration } from '../engine/folder-struct-configuration';
import * as fs from 'fs';
import * as path from 'path';

export class ConfigReader {
    public static read(workspaceRootPath: string): FolderStructConfiguration {

        const reader = new ConfigReader(workspaceRootPath);
        return reader.read();
    }

    private workspaceRootPath: string;
    private constructor(workspaceRootPath: string) {
        this.workspaceRootPath = workspaceRootPath;
    }

    private readonly configFile = 'fstrct.json';
    private read(): FolderStructConfiguration {
        const configPath = path.join(this.workspaceRootPath, this.configFile);

        if (!fs.existsSync(configPath)) {
            return this.defaultConfig(this.workspaceRootPath);
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        return this.verifyAndValidate(config);
    }

    private verifyAndValidate(config: any): FolderStructConfiguration {
        const configRootPath: string = typeof config?.rootPath === 'string' ? config.rootPath : '.';

        const unresolvedPath = path.join(this.workspaceRootPath, configRootPath);
        const resolvedPath = path.resolve(unresolvedPath);

        return {
            ...config,
            rootPath: resolvedPath
        };
    }

    private defaultConfig(rootPath: string): FolderStructConfiguration {
        return {
            rootPath
        };
    }
}