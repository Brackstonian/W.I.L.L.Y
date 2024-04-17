const { app, BrowserWindow } = require('electron');

const { setupPageHandlers } = require('./ipc/ipcPageHandler');
const { setupUIHandlers } = require('./ipc/ipcUiHandler');

const { createMainWindow } = require('./windows/windowManager');

app.whenReady().then(() => {
    setupUIHandlers();
    setupPageHandlers();

    createMainWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})