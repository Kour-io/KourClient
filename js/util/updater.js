"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_updater_1 = require("electron-updater");
function isUpdateAvailable() {
    return new Promise((resolve) => {
        electron_updater_1.autoUpdater
            .checkForUpdates()
            .then((update) => resolve(update.updateInfo))
            .catch(() => resolve(null));
        electron_updater_1.autoUpdater.on('update-available', (update) => resolve(update));
        electron_updater_1.autoUpdater.on('update-not-available', () => resolve(null));
    });
}
exports.default = isUpdateAvailable;
