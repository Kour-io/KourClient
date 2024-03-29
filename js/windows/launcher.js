"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const config_1 = require("../util/config");
const beta_1 = require("../util/beta");
const game_1 = __importDefault(require("./game"));
const updater_1 = __importDefault(require("../util/updater"));
const electron_updater_1 = require("electron-updater");
const winHandler_1 = __importDefault(require("../util/winHandler"));
let window;
let updateInfo = -1;
function registerListeners() {
    electron_1.ipcMain.on('launcher-minimize', () => window && window.minimize());
    electron_1.ipcMain.on('launcher-getAppName', (event) => (event.returnValue = electron_1.app.getName()));
    electron_1.ipcMain.on('launcher-getBetas', async (event) => {
        let betas = await (0, beta_1.getBetas)();
        event.returnValue = betas;
    });
    electron_1.ipcMain.on('launcher-launchGame', (event, beta) => {
        electron_1.app.removeAllListeners('window-all-closed');
        window.close();
        (0, game_1.default)(beta);
    });
    electron_1.ipcMain.on('launcher-isUpdateAvailable', (event) => (event.returnValue = updateInfo));
    electron_1.ipcMain.on('fullscreen', (event) => {
        let win = electron_1.BrowserWindow.fromWebContents(event.sender);
        win?.setFullScreen(!win?.isFullScreen());
    });
    electron_1.ipcMain.on('devtools', (event) => event.sender.openDevTools({ mode: 'detach' }));
}
function updateCallback(info) {
    updateInfo = info;
    electron_updater_1.autoUpdater.on('download-progress', (progress) => {
        progress.version = updateInfo.version;
        window.webContents.send('launcher-updateProgress', progress);
    });
}
function openLauncher() {
    electron_1.app.removeAllListeners('window-all-closed');
    electron_1.app.on('window-all-closed', electron_1.app.quit.bind(electron_1.app));
    if (updateInfo == -1)
        (0, updater_1.default)().then(updateCallback);
    registerListeners();
    createWindow();
}
exports.default = openLauncher;
function createWindow() {
    window = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        frame: false,
        resizable: false,
        icon: config_1.appIcon,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, '../preload/launcher'),
        },
    });
    if (config_1.isDev)
        window.setMenuBarVisibility(false);
    else
        window.setMenu(null);
    window.loadFile((0, path_1.join)(__dirname, '../../html/launcher.html'));
    window.once('ready-to-show', window.show.bind(window));
    window.webContents.on('new-window', (event, url) => (0, winHandler_1.default)(window, event, url));
    window.webContents.on('will-navigate', (event, url) => (0, winHandler_1.default)(window, event, url));
    window.on('closed', () => {
        electron_1.ipcMain.removeAllListeners('launcher-minimize');
        electron_1.ipcMain.removeAllListeners('launcher-getAppName');
        electron_1.ipcMain.removeAllListeners('launcher-getBetas');
        electron_1.ipcMain.removeAllListeners('launcher-launchGame');
        electron_1.ipcMain.removeAllListeners('launcher-isUpdateAvailable');
        window = null;
    });
}
