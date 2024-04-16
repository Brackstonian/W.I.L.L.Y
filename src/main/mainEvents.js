const { BrowserWindow, screen, ipcMain, app } = require('electron');
const { getMainWindow, getOverlayWindow } = require('./windowManager');

const Twig = require('twig');
const path = require('path');
const fs = require('fs');

const assetPath = path.join(__dirname, '..', '..', 'public');

function setupGlobalMainEvents() {
    /*
    * Window Events
    */

    // Close stream overlay window;
    ipcMain.on('close-overlay-window', () => {
        const overlayWindow = getOverlayWindow();
        if (overlayWindow && !overlayWindow.isDestroyed()) {
            overlayWindow.close();
        }
    });

    // Open main window Maximized
    ipcMain.on('open-view-page-maximized', () => {
        const mainWindow = getMainWindow();
        mainWindow.maximize();
    });

    // Open main window with default size;
    ipcMain.on('open-view-page-default', () => {
        const mainWindow = getMainWindow();
        mainWindow.setSize(550, 400);
        mainWindow.center();
    });

    // Load the View Twig file;
    ipcMain.on('load-view-page', (event) => {
        Twig.renderFile(path.join(__dirname, '../../views/pages/view.twig'), { assetPath: assetPath }, (err, html) => {
            if (err) {
                console.error('Error rendering Twig template:', err);
                return;
            }
            // Save the rendered HTML to a temporary file or use `data:` URI
            const tempHtmlPath = path.join(app.getPath('temp'), 'view.html');
            fs.writeFileSync(tempHtmlPath, html);
            event.sender.send('navigate-to', tempHtmlPath);
        });
    });

    // Load the Share Twig file;
    ipcMain.on('load-share-page', (event) => {
        Twig.renderFile(path.join(__dirname, '../../views/pages/share.twig'), { assetPath: assetPath }, (err, html) => {
            if (err) {
                console.error('Error rendering Twig template:', err);
                return;
            }
            // Save the rendered HTML to a temporary file or use `data:` URI
            const tempHtmlPath = path.join(app.getPath('temp'), 'share.html');
            fs.writeFileSync(tempHtmlPath, html);
            event.sender.send('navigate-to', tempHtmlPath);
        });
    });

    /*
    * Video Player Events
    */
    // Send request to load the video player container
    ipcMain.on('request-player', async (event) => {
        event.reply('load-player');
    });
}

module.exports = { setupGlobalMainEvents };
