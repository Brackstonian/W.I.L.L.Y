// Import ipcMain for inter-process communication and desktopCapturer for capturing screen/media sources.
const { app, ipcMain, desktopCapturer, screen } = require('electron');


const path = require('path');
const fs = require('fs');
const Twig = require('twig');

const assetPath = path.join(__dirname, '..', '..', 'public');

// Import functions from windowManager to manage application windows.
const { createMainWindow, createOverlayWindow, getOverlayWindow } = require('./windowManager');
// Define a function to set up event listeners for various IPC events.
function setupListeners() {

    ipcMain.on('request-player', async (event) => {
        event.reply('load-player');
    });

    ipcMain.on('init-canvas-object', async (event) => {
        event.reply('init-canvas');
    });

    ipcMain.on('request-screens', async (event) => {
        const sources = await desktopCapturer.getSources({ types: ['screen'] }); // Fetch available screen sources.
        event.reply('show-picker', sources); // Send the screen sources back to the renderer to display a picker.
    });

    // Listener for 'select-screen' to handle screen selection based on index and send back the selected screen's source ID.
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

    ipcMain.on('close-overlay-window', () => {
        const overlayWindow = getOverlayWindow();
        if (overlayWindow && !overlayWindow.isDestroyed()) {
            overlayWindow.close();
        }
    });

    // Listener for 'create-overlay-window' to handle the creation of an overlay window.
    ipcMain.on('create-overlay-window', (event) => {
        createOverlayWindow(); // Call to create an overlay window.
    });

    ipcMain.on('create-share-id', (event, data) => {
        event.reply('display-unique-id', data); // Send the selected source ID back to the renderer.
    });

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

    // Listener for 'send-draw-data' to send drawing data to the overlay window if it exists and is not destroyed.
    ipcMain.on('send-draw-data', (event, data) => {
        const overlayWindow = getOverlayWindow(); // Retrieve the overlay window.
        if (overlayWindow && !overlayWindow.isDestroyed()) {
            overlayWindow.webContents.send('draw-data', data); // Send drawing data to the overlay window.
        } else {
            console.log('Overlay window is not available or has been destroyed.'); // Log an error if the overlay window is not available.
        }
    });

}

function createPeer() {
    return new Peer();
}


// Export the setupListeners function to be used elsewhere in the application.
module.exports = { setupListeners, createPeer };
