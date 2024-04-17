const { desktopCapturer, BrowserWindow, screen, ipcMain, app } = require('electron');
const { createOverlayWindow, getMainWindow, getOverlayWindow } = require('./windowManager');

const Twig = require('twig');
const path = require('path');
const fs = require('fs');

const assetPath = path.join(__dirname, '..', '..', 'public');

function setupGlobalMainEvents() {
    ipcMain.on('peer-data', (event, data) => {
        mainWindow.webContents.send('peer-data', data);
    });

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
    // Listener to load the video player container
    ipcMain.on('request-player', async (event) => {
        event.reply('load-player');
    });

    // Listener to load the screen selector
    ipcMain.on('request-screens', async (event) => {
        const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 200, height: 150 } });
        event.reply('show-picker', sources.map(source => ({
            name: source.name,
            thumbnail: source.thumbnail.toDataURL(),
            id: source.id
        })));
    });

    // Listener for selection based on index and send back the selected screen's source ID.
    ipcMain.on('select-screen', async (event, index) => {
        const overlayWindow = getOverlayWindow();
        // Close the existing window if it's open
        if (overlayWindow && !overlayWindow.isDestroyed()) {
            overlayWindow.close();
        }

        const sources = await desktopCapturer.getSources({ types: ['screen'] });
        const displays = screen.getAllDisplays();

        if (index >= 0 && index < displays.length) {
            const selectedDisplay = displays[index];
            createOverlayWindow(selectedDisplay);
            const sourceId = sources[index].id;
            event.reply('screen-selected', sourceId);
        } else {
            console.error('Selected screen index is out of range.');
        }
    });

    /*
    * Share ID Events
    */

    // Listener to display unique id;
    ipcMain.on('create-share-id', (event, data) => {
        event.reply('display-unique-id', data); // Send the selected source ID back to the renderer.
    });

}

function setupGlobalPeerEvents() {
    ipcMain.on('peer-data-request', (event, data) => {
        mainWindow.webContents.send('peer-data', data);
    });

    ipcMain.on('peer-error', (event, error) => {
        mainWindow.webContents.send('peer-error', error);
    });
}

module.exports = { setupGlobalMainEvents, setupGlobalPeerEvents };
