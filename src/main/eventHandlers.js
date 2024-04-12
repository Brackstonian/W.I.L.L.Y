// Import ipcMain for inter-process communication and desktopCapturer for capturing screen/media sources.
const { ipcMain, desktopCapturer } = require('electron');
// Import functions from windowManager to manage application windows.
const { createMainWindow, createOverlayWindow, getOverlayWindow } = require('./windowManager');

// Define a function to set up event listeners for various IPC events.
function setupListeners() {

    ipcMain.on('request-player', async (event) => {
        event.reply('load-player');
    });

    ipcMain.on('request-screens', async (event) => {
        const sources = await desktopCapturer.getSources({ types: ['screen'] }); // Fetch available screen sources.
        event.reply('show-picker', sources); // Send the screen sources back to the renderer to display a picker.
    });

    // Listener for 'select-screen' to handle screen selection based on index and send back the selected screen's source ID.
    ipcMain.on('select-screen', async (event, index) => {
        const sources = await desktopCapturer.getSources({ types: ['screen'] }); // Fetch the screen sources again.
        const sourceId = sources[index].id; // Get the ID of the selected screen source.
        event.reply('screen-selected', sourceId); // Send the selected source ID back to the renderer.
    });

    // Listener for 'create-overlay-window' to handle the creation of an overlay window.
    ipcMain.on('create-overlay-window', (event) => {
        createOverlayWindow(); // Call to create an overlay window.
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

// Export the setupListeners function to be used elsewhere in the application.
module.exports = { setupListeners };
