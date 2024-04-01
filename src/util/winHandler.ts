import { BrowserWindow, shell } from 'electron';
import getContext, { Context } from './context';
import { window as gameWindow } from '../windows/game';

export default function handleWindowEvent(
    win: BrowserWindow,
    event: Electron.Event,
    urlString: string
) {
    event.preventDefault();

    let url: URL;
    let currentUrl: URL;

    try {
        url = new URL(urlString);
        currentUrl = new URL(win.webContents.getURL());
    } catch (e) {
        return;
    }

    let currentCtx = getContext(currentUrl);
    let ctx = getContext(url);

    if (ctx === currentCtx) {
        win.loadURL(urlString);
        return;
    }

    if (ctx === Context.Game) {
        gameWindow.loadURL(urlString);
        return;
    }

    shell.openExternal(urlString);
}
