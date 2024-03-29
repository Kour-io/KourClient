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
exports.window = void 0;
const electron_1 = require("electron");
const launcher_1 = __importDefault(require("./launcher"));
const config_1 = __importStar(require("../util/config"));
const winHandler_1 = __importDefault(require("../util/winHandler"));
function launchGame(beta) {
    electron_1.app.removeAllListeners('window-all-closed');
    electron_1.app.on('window-all-closed', (event) => {
        event.preventDefault();
        exports.window = null;
        (0, launcher_1.default)();
    });
    if (beta !== 'Stable')
        config_1.gameURL.pathname = '/' + beta;
    let windowSave = config_1.default.get('window', {}) || {};
    let displaySize = electron_1.screen.getPrimaryDisplay().workAreaSize;
    exports.window = new electron_1.BrowserWindow({
        width: windowSave.width ?? displaySize.width,
        height: windowSave.height ?? displaySize.height,
        x: windowSave.x,
        y: windowSave.y,
        show: false,
        icon: config_1.appIcon,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            enableRemoteModule: false,
            preload: require.resolve('../preload/game'),
        },
    });
    exports.window.once('ready-to-show', () => exports.window.show());
    exports.window.setMenu(null);
    exports.window.loadURL(config_1.gameURL.href);
    exports.window.webContents.on('new-window', (event, url) => (0, winHandler_1.default)(exports.window, event, url));
    exports.window.webContents.on('will-navigate', (event, url) => (0, winHandler_1.default)(exports.window, event, url));
    exports.window.on('close', () => {
        config_1.default.set('window', {
            width: exports.window.getSize()[0],
            height: exports.window.getSize()[1],
            x: exports.window.getPosition()[0],
            y: exports.window.getPosition()[1],
        });
        exports.window = null;
    });
}
exports.default = launchGame;
