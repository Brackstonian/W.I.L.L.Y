const { ipcMain } = require('electron');
const { renderPage } = require('../windows/windowHelpers');
const { getMainWindow, getOverlayWindow } = require('../windows/windowManager');


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
        mainWindow.maximize();
    });
    ipcMain.on('view-page-default', () => {
        const mainWindow = getMainWindow();
        mainWindow.setSize(800, 600);
        mainWindow.center();
    });
    ipcMain.on('close-overlay-page', () => {
        const overlayWindow = getOverlayWindow();
        if (overlayWindow && !overlayWindow.isDestroyed()) {
            overlayWindow.close();
        }
    });
}

module.exports = { setupPageHandlers };