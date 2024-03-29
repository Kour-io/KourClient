import { BrowserWindow, app, ipcMain } from 'electron';
import { join } from 'path';
import { appIcon, isDev } from '../util/config';
import { getBetas } from '../util/beta';
import launchGame from './game';
import isUpdateAvailable from '../util/updater';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import handleWindowEvent from '../util/winHandler';

let window: BrowserWindow;
let updateInfo: UpdateInfo | null | number = -1;
let didInit = false;

function registerListeners() {
    ipcMain.on('launcher-minimize', () => window && window.minimize());
    ipcMain.on(
        'launcher-getAppName',
        (event) => (event.returnValue = app.getName())
    );

    ipcMain.on('launcher-getBetas', async (event) => {
        let betas = await getBetas();
        event.returnValue = betas;
    });

    ipcMain.on('launcher-launchGame', (event, beta) => {
        app.removeAllListeners('window-all-closed');
        window.close();

        launchGame(beta);
    });

    ipcMain.on(
        'launcher-isUpdateAvailable',
        (event) => (event.returnValue = updateInfo)
    );
}

function updateCallback(info: UpdateInfo | null) {
    updateInfo = info;

    autoUpdater.on('download-progress', (progress) => {
        (progress as any).version = (updateInfo as UpdateInfo).version;
        window.webContents.send('launcher-updateProgress', progress);
    });
}

function init() {
    ipcMain.on('fullscreen', (event) => {
        let win = BrowserWindow.fromWebContents(event.sender);
        win?.setFullScreen(!win?.isFullScreen());
    });

    ipcMain.on('devtools', (event) =>
        event.sender.openDevTools({ mode: 'detach' })
    );
}

export default function openLauncher() {
    if (!didInit) init();

    app.removeAllListeners('window-all-closed');
    app.on('window-all-closed', app.quit.bind(app));

    if (updateInfo == -1) isUpdateAvailable().then(updateCallback);

    registerListeners();
    createWindow();
}

function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 600,

        show: false,
        frame: false,
        resizable: false,

        icon: appIcon,

        webPreferences: {
            preload: join(__dirname, '../preload/launcher'),
        },
    });

    if (isDev) window.setMenuBarVisibility(false);
    else window.setMenu(null);

    window.loadFile(join(__dirname, '../../html/launcher.html'));
    window.once('ready-to-show', window.show.bind(window));

    window.webContents.on('new-window', (event, url) =>
        handleWindowEvent(window, event, url)
    );

    window.webContents.on('will-navigate', (event, url) =>
        handleWindowEvent(window, event, url)
    );

    window.on('closed', () => {
        ipcMain.removeAllListeners('launcher-minimize');
        ipcMain.removeAllListeners('launcher-getAppName');
        ipcMain.removeAllListeners('launcher-getBetas');
        ipcMain.removeAllListeners('launcher-launchGame');
        ipcMain.removeAllListeners('launcher-isUpdateAvailable');
        window = null;
    });
}
