import { BrowserWindow, app, screen } from 'electron';
import openLauncher from './launcher';
import config, { appIcon, gameURL } from '../util/config';
import handleWindowEvent from '../util/winHandler';

export let window: Electron.BrowserWindow;

export default function launchGame(beta: string) {
    app.removeAllListeners('window-all-closed');
    app.on('window-all-closed', (event: Electron.Event) => {
        event.preventDefault();
        window = null;

        openLauncher();
    });

    if (beta !== 'Stable') gameURL.pathname = '/' + beta;

    let windowSave = config.get('window', {}) || ({} as any);
    let displaySize = screen.getPrimaryDisplay().workAreaSize;

    window = new BrowserWindow({
        width: windowSave.width ?? displaySize.width,
        height: windowSave.height ?? displaySize.height,
        x: windowSave.x,
        y: windowSave.y,

        show: false,
        icon: appIcon,

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            enableRemoteModule: false,

            preload: require.resolve('../preload/game'),
        },
    });

    window.once('ready-to-show', () => window.show());

    window.setMenu(null);
    window.loadURL(gameURL.href);

    window.webContents.on('new-window', (event, url) =>
        handleWindowEvent(window, event, url)
    );

    window.webContents.on('will-navigate', (event, url) =>
        handleWindowEvent(window, event, url)
    );

    window.on('close', () => {
        config.set('window', {
            width: window.getSize()[0],
            height: window.getSize()[1],
            x: window.getPosition()[0],
            y: window.getPosition()[1],
        });

        window = null;
    });
}
