// Import required modules from Electron for creating and managing browser windows and for screen information.
const { BrowserWindow, screen, ipcMain, app } = require('electron');

const path = require('path');
const iconPath = path.join(__dirname, '..', '..', 'public', 'icons', 'mac', 'icon.ics');

let overlayWindow; // Define a module-level variable to hold the overlay window instance.

// Function to create the main application window.
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 550,
        height: 400,
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true, // Consider security implications of this setting.
            contextIsolation: false, // Recommend enabling contextIsolation for security.
            enableRemoteModule: true // Evaluate if necessary due to security risks.
        }
    });

    // Load the initial HTML file into the window.
    mainWindow.loadFile('views/index.html');

    // Open Developer Tools 
    mainWindow.webContents.openDevTools();

    // Event triggered when the window is asked to close (e.g., clicking the red close button).
    mainWindow.on('close', (event) => {
        // Uncomment the next line if you want to prompt the user before closing the window.
        // event.preventDefault(); // Prevent default close operation and handle manually.

        // This ensures that the application will quit when the window is closed.
        app.quit();
    });

    ipcMain.on('open-view-page-default', () => {
        mainWindow.setSize(550, 400);
        mainWindow.center();
    });

    ipcMain.on('open-view-page-maximized', () => {
        mainWindow.maximize();
    });

    mainWindow.on('restore', () => {
        mainWindow.show();
    });

    // Center the window initially.
    mainWindow.center();
}


// Function to create an overlay window.
function createOverlayWindow(targetScreen) {
    // If no screen is provided, default to the primary display
    const display = targetScreen || screen.getPrimaryDisplay();

    overlayWindow = new BrowserWindow({
        x: display.bounds.x, // Start at the leftmost edge of the target screen.
        y: display.bounds.y, // Start at the topmost edge of the target screen.
        width: display.bounds.width, // Span the entire screen width.
        height: display.bounds.height, // Span the entire screen height.
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        focusable: false,
        resizable: false,
        movable: false,
        minimizable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    overlayWindow.setIgnoreMouseEvents(true);
    overlayWindow.loadFile('views/overlayWindow.html');
    overlayWindow.on('focus', () => overlayWindow.blur());
}


// Function to get the current instance of the overlay window.
function getOverlayWindow() {
    return overlayWindow; // Return the current overlay window instance.
}

// Export functions to be used in other parts of the application.
module.exports = { createMainWindow, createOverlayWindow, getOverlayWindow };
