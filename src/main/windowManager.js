// Import required modules from Electron for creating and managing browser windows and for screen information.
const { BrowserWindow, screen } = require('electron');

const path = require('path');
const iconPath = path.join(__dirname, '..', '..', 'public', 'icons', 'mac', 'icon.ics');

let overlayWindow; // Define a module-level variable to hold the overlay window instance.

// Function to create the main application window.
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 800, // Set the width of the window.
        height: 600, // Set the height of the window.
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true, // Enable Node.js integration.
            contextIsolation: false, // Disable context isolation.
            enableRemoteModule: true // Enable the remote module (should be used cautiously due to security implications).
        }
    });

    console.log(iconPath);

    mainWindow.loadFile('views/index.html'); // Load the HTML file for the main window.
    // mainWindow.webContents.openDevTools(); // Open Developer Tools
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
