// // Import 'app' from the 'electron' module to control the application's lifecycle.
// const { app } = require('electron');

// // Import functions from windowManager to manage application windows.
// const { createMainWindow, createOverlayWindow } = require('./windowManager');
// // Import the setupListeners function to configure inter-process communication.
// // const { setupListeners } = require('./eventHandlers');

// const { setupGlobalMainEvents } = require('./mainEvents');


// app.whenReady().then(() => {
//     setupGlobalMainEvents();

//     createMainWindow();

//     app.on('activate', function () {
//         if (BrowserWindow.getAllWindows().length === 0) {
//             createMainWindow();
//         }
//     })
// })

// app.on('window-all-closed', function () {
//     if (process.platform !== 'darwin') app.quit()
// })