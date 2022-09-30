import { Uri } from "vscode";

export function getName(uri: Uri) {
    const segments = uri.path.split('/');
    return segments[segments.length - 1];
}