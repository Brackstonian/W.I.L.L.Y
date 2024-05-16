const { ipcMain } = require('electron');
const { renderPage } = require('../windows/windowHelpers');
const { getMainWindow, getOverlayWindow, createModalWindow } = require('../windows/windowManager');


function setupPageHandlers() {
    ipcMain.handle('load-view-page', async () => {
        try {
            const filePath = await renderPage('view');
            return filePath;
        } catch (err) {
            console.error(`Error rendering view page:`, err);
            throw err;
        }
    });
    ipcMain.handle('load-share-page', async () => {
        try {
            const filePath = await renderPage('share');
            return filePath;
        } catch (err) {
            console.error(`Error rendering view page:`, err);
            throw err;
        }
    });
    ipcMain.on('view-page-maximized', () => {
        const mainWindow = getMainWindow();
        mainWindow.resizable = true;
        mainWindow.maximize();
    });
    ipcMain.on('close-overlay-page', () => {
        const overlayWindow = getOverlayWindow();
        if (overlayWindow && !overlayWindow.isDestroyed()) {
            overlayWindow.close();
        }
    });
    ipcMain.on('load-modal', (event, id) => {
        createModalWindow(id);
    });
}

module.exports = { setupPageHandlers };