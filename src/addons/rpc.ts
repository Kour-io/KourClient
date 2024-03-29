import Addon from '../util/addon';
import RPC from 'discord-rpc-revamp';
import { rpcClientId as clientId, gameURL } from '../util/config';
import { app } from 'electron';

export default class RpcMain extends Addon {
    client: RPC.Client;
    initTime: number;
    activityInterval: NodeJS.Timeout;

    connect() {
        this.client
            .connect({ clientId })
            .catch(() => setTimeout(this.connect.bind(this), 5e3));
    }

    async init() {
        let main = await import('../windows/game');

        this.client = new RPC.Client();
        this.connect();
        this.initTime = Date.now();

        this.client.on('ready', () => this.client.subscribe('ACTIVITY_JOIN'));

        this.client.on('ACTIVITY_JOIN', ({ secret }) => {
            let joinUrl = new URL(gameURL.href);
            joinUrl.hash = '#' + secret;

            if (main.window) main.window.loadURL(joinUrl.href);
        });

        this.activityInterval = setInterval(() => {
            let currentURLStr = main.window?.webContents.getURL();
            let currentURL: URL | null = null;

            try {
                currentURL = new URL(currentURLStr);
            } catch {}

            this.client
                .setActivity({
                    details: app.getName(),
                    state: '',
                    largeImageKey: 'okc_logo',
                    largeImageText: currentURL
                        ? currentURL.pathname == '/'
                            ? 'Stable'
                            : currentURL.pathname.slice(1, -1)
                        : '',
                    startTimestamp: this.initTime,

                    joinSecret: currentURL ? currentURL.hash.slice(1) : '',
                    partyId: currentURL ? 'p-' + currentURL.hash.slice(1) : '',
                })
                .catch(() => {});
        }, 5e3);
    }

    stop() {
        clearInterval(this.activityInterval);
        this.client.clearActivity();
        this.client.destroy();
    }
}
