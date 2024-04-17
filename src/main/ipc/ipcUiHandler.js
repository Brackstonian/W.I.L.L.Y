const { ipcMain, desktopCapturer, screen } = require('electron');
const { getOverlayWindow, createOverlayWindow } = require('../windows/windowManager');


function setupUIHandlers() {
    ipcMain.handle('request-screens', async () => {
        try {
            const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 200, height: 150 } });
            return sources.map(source => ({
                name: source.name,
                thumbnail: source.thumbnail.toDataURL(),
                id: source.id
            }));
        } catch (err) {
            console.error(`Error rendering view page:`, err);
            throw err;
        }
    });

    ipcMain.handle('select-screen', async (event, index) => {
        const overlayWindow = getOverlayWindow();
        if (overlayWindow && !overlayWindow.isDestroyed()) {
            overlayWindow.close();
        }

        const sources = await desktopCapturer.getSources({ types: ['screen'] });
        const displays = screen.getAllDisplays();

        if (index >= 0 && index < displays.length) {
            const selectedDisplay = displays[index];
            createOverlayWindow(selectedDisplay);
            const sourceId = sources[index].id;
            return sourceId;
        } else {
            console.error('Selected screen index is out of range.');
        }
    });

    ipcMain.on('create-share-id', (event, data) => {
        event.reply('display-unique-id', data); // Send the selected source ID back to the renderer.
    });

    ipcMain.on('send-draw-data', (event, data) => {
        const overlayWindow = getOverlayWindow(); // Retrieve the overlay window.
        if (overlayWindow && !overlayWindow.isDestroyed()) {
            overlayWindow.webContents.send('draw-data', data); // Send drawing data to the overlay window.
        } else {
            console.log('Overlay window is not available or has been destroyed.'); // Log an error if the overlay window is not available.
        }
    });
}

module.exports = { setupUIHandlers };
