const { Client } = require('discord-rpc');

const clientId = '1091132902370197614';
const client = new Client({ transport: 'ipc' });

class rpc {
    constructor() {
        client.on('ready', () => {
            console.log('Discord RPC connected');
            client.setActivity({
                details: 'Official Kour Client',
                largeImageKey: 'okc_logo',
                startTimestamp: Date.now(),
                buttons: [{ label: 'Join Server', url: 'https://discord.gg/CvvBXY4Y5V' }],
            });
        });

        client.login({ clientId }).catch(console.error);
    }
}

module.exports = rpc;
