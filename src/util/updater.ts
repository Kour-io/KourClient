import { UpdateInfo, autoUpdater } from 'electron-updater';

export default function isUpdateAvailable(): Promise<UpdateInfo | null> {
    return new Promise((resolve) => {
        autoUpdater
            .checkForUpdates()
            .then((update) => resolve(update.updateInfo))
            .catch(() => resolve(null));

        autoUpdater.on('update-available', (update) => resolve(update));
        autoUpdater.on('update-not-available', () => resolve(null));
    });
}
