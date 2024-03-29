const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const platformType = require('os').platform();
const log = require('electron-log');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const gwnd = require('./js/utils/gameWindow.js');
const os = require('os');
Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  },
});

const url = 'https://kour.io';
const chromiumFlags = [
  ['disable-frame-rate-limit', null, true],
  ['disable-gpu-vsync', null, true],
  ['enable-gpu-rasterization', null, true],
  ['enable-oop-rasterization', null, true],
  ['enable-webgl2-compute-context', null, true],
  ['enable-highres-timer', null, true],
  ['disable-background-timer-throttling', null, true],
  ['enable-future-v8-vm-features', null, true],
  ['enable-webgl', null, true],
  ['renderer-process-limit', '100', true],
  ['enable-accelerated-2d-canvas', null, true],
  ['enable-native-gpu-memory-buffers', null, true],
  ['high-dpi-support', '1', true],
  ['ignore-gpu-blacklist', null, true],
  ['enable-accelerated-video-decode', null, true],
];


app.whenReady().then(() => {
  chromiumFlags.forEach(flag => {
    const [flagName, flagValue, condition] = flag;
    if (condition !== false) {
      app.commandLine.appendSwitch(flagName, flagValue);
    }
  });
  gwnd.launchGame(url);
});

app.on('window-all-closed', () => {
  app.quit();
});
