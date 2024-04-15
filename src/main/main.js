// Import 'app' from the 'electron' module to control the application's lifecycle.
const { app } = require('electron');

// Import functions from windowManager to manage application windows.
const { createMainWindow, createOverlayWindow } = require('./windowManager');
// Import the setupListeners function to configure inter-process communication.
const { setupListeners } = require('./eventHandlers');

// Execute the following code block when the Electron app is ready to create browser windows.
app.whenReady().then(() => {
    createMainWindow();  // Call to create the main window of the application.
    setupListeners();    // Initialize IPC event listeners defined in eventHandlers.

});

// Add an event listener that triggers when all windows have been closed.
app.on('window-all-closed', () => {
    // Ensure the application quits only if it's not running on macOS (darwin).
    // This is because applications on macOS typically continue running even without open windows.
    if (process.platform !== 'darwin') {
        app.quit();  // Quit the application.
    }
});
