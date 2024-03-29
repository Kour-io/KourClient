import { gameURL } from './config';

export enum Context {
    Game,
    File,
    External,
}
export default function getContext(url: URL) {
    if (url.protocol === 'file:') {
        return Context.File;
    }

    if (url.hostname === gameURL.hostname) {
        return Context.Game;
    }

    return Context.External;
}
