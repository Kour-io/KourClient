import { ipcRenderer } from 'electron';

function formatProgress(progress: any) {
    let str = '';

    if (progress.transferred > 1024 * 1024)
        str += (progress.transferred / 1024 / 1024).toFixed(2) + ' MB';
    else if (progress.transferred > 1024)
        str += (progress.transferred / 1024).toFixed(2) + ' KB';
    else str += progress.transferred + ' B';

    str += ' / ';

    if (progress.total > 1024 * 1024)
        str += (progress.total / 1024 / 1024).toFixed(2) + ' MB';
    else if (progress.total > 1024)
        str += (progress.total / 1024).toFixed(2) + ' KB';
    else str += progress.total + ' B';

    return str;
}

window.onload = () => {
    let launch = document.getElementById('launch') as HTMLButtonElement;
    let betaSelect = document.getElementById('betaSelect') as HTMLSelectElement;

    let updateText = document.getElementById('updateText');
    let updateProgress = document.getElementById('updateProg');
    let updateInfo: any;

    ipcRenderer.on('launcher-updateProgress', (_, progress) => {
        updateText.textContent = `Downloading update ${
            progress.version
        }... ${formatProgress(progress)} (${~~progress.percent}%)`;
        updateProgress.style.width = ~~progress.percent + '%';
    });

    if ((updateInfo = ipcRenderer.sendSync('launcher-isUpdateAvailable'))) {
        updateText.textContent = `Downloading update ${
            updateInfo.version
        }... ${formatProgress({
            total: 0,
            transferred: 0,
        })} (0%)`;
        updateProgress.style.width = '0%';
    } else {
        updateText.textContent = 'Client is up to date!';
        updateProgress.style.width = '100%';
        updateProgress.className = '';

        launch.disabled = false;
        launch.addEventListener('click', () =>
            ipcRenderer.send('launcher-launchGame', betaSelect.value)
        );
    }

    let close = document.getElementById('close');
    let minimize = document.getElementById('minimize');
    let title = document.getElementById('title');

    close.addEventListener('click', () => window.close());
    minimize.addEventListener('click', () =>
        ipcRenderer.send('launcher-minimize')
    );

    title.textContent = ipcRenderer.sendSync('launcher-getAppName');

    let betas = ipcRenderer.sendSync('launcher-getBetas') || [];
    betas.splice(0, 0, 'Stable');

    betaSelect.innerHTML = '';
    for (let i = 0; i < betas.length; i++) {
        let option = document.createElement('option');
        option.textContent = betas[i];
        option.value = betas[i];
        betaSelect.appendChild(option);
    }
};
