// Import required modules from Electron for creating and managing browser windows and for screen information.
const { BrowserWindow, screen, app } = require('electron');

const path = require('path');
const fs = require('fs');
const Twig = require('twig');

const assetPath = path.join(__dirname, '..', '..', 'public');

let overlayWindow;
let mainWindow;

// Function to create the main application window.
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    // Render the Twig template and load it
    Twig.renderFile(path.join(__dirname, '../../views/pages/home.twig'), { assetPath: assetPath }, (err, html) => {
        if (err) {
            console.error('Error rendering Twig template:', err);
            return;
        }
        // Save the rendered HTML to a temporary file
        const tempHtmlPath = path.join(app.getPath('temp'), 'index.html');
        fs.writeFileSync(tempHtmlPath, html);

        // Load the rendered HTML file into the window
        mainWindow.loadFile(tempHtmlPath);
    });

    mainWindow.webContents.openDevTools();

    // Additional mainWindow settings and IPC handlers remain the same
    mainWindow.on('close', (event) => {
        app.quit();
    });

    mainWindow.on('restore', () => {
        mainWindow.show();
    });

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
    overlayWindow.on('focus', () => overlayWindow.blur());

    Twig.renderFile(path.join(__dirname, '../../views/pages/overlay.twig'), { assetPath: assetPath }, (err, html) => {
        if (err) {
            console.error('Error rendering Twig template:', err);
            return;
        }
        // Save the rendered HTML to a temporary file
        const tempHtmlPath = path.join(app.getPath('temp'), 'overlay.html');
        fs.writeFileSync(tempHtmlPath, html);

        // Load the rendered HTML file into the window
        overlayWindow.loadFile(tempHtmlPath);
    });
}

// Function to get the current instance of the main window.
function getMainWindow() {
    return mainWindow; // Return the current overlay window instance.
}
// Function to get the current instance of the overlay window.
function getOverlayWindow() {
    return overlayWindow; // Return the current overlay window instance.
}

// Export functions to be used in other parts of the application.
module.exports = { createMainWindow, createOverlayWindow, getOverlayWindow, getMainWindow };
