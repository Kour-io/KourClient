import { app } from 'electron';
import config, { appName } from './util/config';
import openLauncher from './windows/launcher';
import RpcMain from './addons/rpc';

app.name = appName;

let flags = config.get('flags', {} as any);

for (let flag in flags) {
    let enabled = flags[flag] ?? true; // Enabled by default
    let [key, value] = flag.split('=');

    if (enabled) app.commandLine.appendSwitch(key, value ?? '');
}

app.whenReady().then(openLauncher);
app.on('window-all-closed', app.quit.bind(app));

new RpcMain().init();
