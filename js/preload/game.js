"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const config_1 = __importDefault(require("../util/config"));
async function processKey(e) {
    let hotkeys = config_1.default.get('hotkeys') || {};
    if (e.key === hotkeys.fullscreen)
        electron_1.ipcRenderer.send('fullscreen');
    else if (e.key === hotkeys.reload) {
        window.location.hash = '';
        window.location.reload();
    }
    else if (e.key === hotkeys.loadClipboardGame) {
        let clipboard = await navigator.clipboard.readText();
        let url;
        try {
            url = new URL(clipboard);
            console.log(url);
        }
        catch {
            return;
        }
        if (url.hostname === window.location.hostname)
            window.location.href = clipboard;
    }
    else if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I'))
        electron_1.ipcRenderer.send('devtools');
    else if (e.key === 'Escape')
        document.exitPointerLock();
}
document.addEventListener('keydown', (e) => {
    setTimeout(processKey.bind(null, e), 0);
});
