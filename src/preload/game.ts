import { ipcRenderer } from 'electron';
import config from '../util/config';

async function processKey(e: KeyboardEvent) {
    let hotkeys = config.get('hotkeys') || ({} as any);

    if (e.key === hotkeys.fullscreen) ipcRenderer.send('fullscreen');
    else if (e.key === hotkeys.reload) {
        window.location.hash = '';
        window.location.reload();
    } else if (e.key === hotkeys.loadClipboardGame) {
        let clipboard = await navigator.clipboard.readText();
        let url: URL;

        try {
            url = new URL(clipboard);
        } catch {
            return;
        }

        if (url.hostname === 'kour.io' && url.hash.length > 1) {
            window.location.href = clipboard;
            window.location.reload();
        }
    } else if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I'))
        ipcRenderer.send('devtools');
    else if (e.key === 'Escape') document.exitPointerLock();
}

document.addEventListener('keydown', (e) => {
    setTimeout(processKey.bind(null, e), 0);
});
