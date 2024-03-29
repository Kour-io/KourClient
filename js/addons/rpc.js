"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addon_1 = __importDefault(require("../util/addon"));
const discord_rpc_revamp_1 = __importDefault(require("discord-rpc-revamp"));
const config_1 = require("../util/config");
const electron_1 = require("electron");
class RpcMain extends addon_1.default {
    client;
    initTime;
    activityInterval;
    connect() {
        this.client
            .connect({ clientId: config_1.rpcClientId })
            .catch(() => setTimeout(this.connect.bind(this), 5e3));
    }
    async init() {
        let main = await Promise.resolve().then(() => __importStar(require('../windows/game')));
        this.client = new discord_rpc_revamp_1.default.Client();
        this.connect();
        this.initTime = Date.now();
        this.client.on('ready', () => this.client.subscribe('ACTIVITY_JOIN'));
        this.client.on('ACTIVITY_JOIN', ({ secret }) => {
            let joinUrl = new URL(config_1.gameURL.href);
            joinUrl.hash = '#' + secret;
            if (main.window)
                main.window.loadURL(joinUrl.href);
        });
        this.activityInterval = setInterval(() => {
            let currentURLStr = main.window?.webContents.getURL();
            let currentURL = null;
            try {
                currentURL = new URL(currentURLStr);
            }
            catch { }
            this.client
                .setActivity({
                details: electron_1.app.getName(),
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
                .catch(() => { });
        }, 5e3);
    }
    stop() {
        clearInterval(this.activityInterval);
        this.client.clearActivity();
        this.client.destroy();
    }
}
exports.default = RpcMain;
