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
function createOverlayWindow() {
    const { width, height } = screen.getPrimaryDisplay().size; // Get the size of the primary display.
    const { workAreaSize, bounds } = screen.getPrimaryDisplay();
    const menuBarHeight = bounds.height - workAreaSize.height; // Calculate the height of the menu bar (if any).

    overlayWindow = new BrowserWindow({
        x: 0, // Position the window at the leftmost edge of the screen.
        y: 0, // Position the window at the topmost edge of the screen.
        width: width, // Set the window width to span the entire screen width.
        height: height, // Set the window height to span the entire screen height.
        frame: false, // Create a frameless window.
        transparent: true, // Make the window transparent.
        alwaysOnTop: true, // Keep the window always on top.
        focusable: false, // The window should not be focusable.
        resizable: false, // Make the window non-resizable.
        movable: false, // The window should not be movable.
        minimizable: false, // Disable minimizing of the window.
        maximizable: false, // Disable maximizing of the window.
        webPreferences: {
            nodeIntegration: true, // Enable Node.js integration.
            contextIsolation: false // Disable context isolation.
        }
    });

    overlayWindow.setIgnoreMouseEvents(true); // Ignore all mouse events.
    overlayWindow.loadFile('views/overlayWindow.html'); // Load the HTML file for the overlay window.
    overlayWindow.on('focus', () => overlayWindow.blur()); // Force the window to lose focus if it gains focus.
    // return overlayWindow; (Commented out return statement as it's not used in the example)
}

// Function to get the current instance of the overlay window.
function getOverlayWindow() {
    return overlayWindow; // Return the current overlay window instance.
}

// Export functions to be used in other parts of the application.
module.exports = { createMainWindow, createOverlayWindow, getOverlayWindow };
