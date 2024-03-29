const { app, BrowserWindow, globalShortcut, clipboard, ipcRenderer } = require('electron');
const log = require('electron-log');
const colors = require('colors');
const platformType = require('os').platform();
const fs = require('fs');
const path = require('path');
const rpc = require('./rpc.js');
const Toastify = require('toastify-js');
const { registerShortcut, unregisterAllShortcuts } = require('./shortcuts.js');
let wombo = null; // Initialize wombo to null
try {
    wombo = require('../../private.js');
} 
catch (error) {
    wombo = null; // Set wombo to null if private.js cannot be loaded
    console.log('wombo set to', wombo);
}

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
});

const Store = require('electron-store');
const store = new Store();
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0';
const windows = {
    game: null,
};


exports.launchGame = (url = null) => {
    windows.game = new this.gameWindow(url);
    return windows.game;
};


exports.gameWindow = class {
    constructor(url) {
        const win = new BrowserWindow({
            width: 1920,
            height: 1080,
            titleBarStyle: 'hidden',
            webPreferences: {
                preload: path.join(__dirname, '../preload/game.js'),
                userAgent: userAgent,
                contextIsolation: false,
                nodeIntegration: true,
                devTools: true,
            },
        });

        win.removeMenu();
        win.maximize();
        win.once('focus', () => win.flashFrame(false));
        win.flashFrame(true);
        win.loadURL((!url) ? 'https://kour.io' : url);
        console.log('[MAIN]'.bgGreen, 'Page loaded'.green);
        // Store the fullscreen state when it changes
        win.on('enter-full-screen', () => {
            store.set('Fullscreen', true);
        });

        win.on('leave-full-screen', () => {
            store.set('Fullscreen', false);
        });
        win.setFullScreen(store.get('Fullscreen'));
        win.once('ready-to-show', () => {
            console.log('[MAIN]'.bgGreen, 'Web Content Ready To Show'.green);

            registerShortcut('F11', () => {
                const brWin = BrowserWindow.getFocusedWindow();
                if (brWin) {
                    const isFullScreen = brWin.isFullScreen();
                    brWin.setFullScreen(!isFullScreen);
                }
            });

            registerShortcut('Escape', () => {
                const focusedWindow = BrowserWindow.getFocusedWindow();
                if (focusedWindow) {
                    focusedWindow.webContents.executeJavaScript(`
                        if (document.pointerLockElement) {
                            document.exitPointerLock();
                        }
                    `);
                }
            });

            registerShortcut('F5', () => {
                win.loadURL('https://kour.io');
                
            });

            registerShortcut('F6', () => {
                const clipboardText = clipboard.readText();
                const focusedWindow = BrowserWindow.getFocusedWindow();
                
                if (focusedWindow && clipboardText.startsWith('https://kour.io')) {
                    focusedWindow.loadURL(clipboardText);
                }
            });
        });

        const rpcInstance = new rpc();
    }
};