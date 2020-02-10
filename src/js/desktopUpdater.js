export const updaterFunctions = {
    desktopUpdater,
    closeNotification,
    restartApp
}
export function desktopUpdater() {
    const electron = window.require('electron');
    const ipcRenderer  = electron.ipcRenderer;
    const version = document.getElementById('version');
    const notification = document.getElementById('notification');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart-button');

    ipcRenderer.send('app_version');
    ipcRenderer.on('app_version', (event, arg) => {
      ipcRenderer.removeAllListeners('app_version');
      version.innerText = 'Version ' + arg.version;
    });

    ipcRenderer.on('update_available', () => {
      ipcRenderer.removeAllListeners('update_available');
      message.innerText = 'A new update is available. Downloading now...';
      removeClass(notification);
    });
    ipcRenderer.on('update_downloaded', () => {
      ipcRenderer.removeAllListeners('update_downloaded');
      message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
      removeClass(restartButton);
      removeClass(notification);
    });
}

function removeClass(elem) {
    const classVal = elem.classList.value;
    const classValues = classVal.split(' ');
    classValues.forEach(c => {
        if (c.includes("hidden")) {
            elem.classList.remove(c);
        }
    });
}

// Handles closing the notification
export function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('hidden');
}
// Handles restarting the app to immediately install the downloaded update
export function restartApp() {
    const electron = window.require('electron');
    const ipcRenderer  = electron.ipcRenderer;
    const message = document.getElementById('message');
    message.innerText = 'Restarting';
    ipcRenderer.send('restart_app');
}

export default updaterFunctions