const { BrowserWindow, screen } = require('electron');
const path = require('path');
const { renderMainWindowContent, renderOverlayWindowContent } = require('./windowHelpers');

let mainWindow;
let overlayWindow;

// Function to create the main application window.
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        center: true,
        webPreferences: {
            preload: path.join(__dirname, '..', '..', 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    renderMainWindowContent(mainWindow);

    mainWindow.on('restore', () => {
        mainWindow.show();
    });

    mainWindow.on('close', () => {
        mainWindow = null;
    });

    return mainWindow;
}
// Function to create an overlay window.
function createOverlayWindow(targetScreen) {
    const display = targetScreen || screen.getPrimaryDisplay();
    overlayWindow = new BrowserWindow({
        x: display.bounds.x,
        y: display.bounds.y,
        width: display.bounds.width,
        height: display.bounds.height,
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

    renderOverlayWindowContent(overlayWindow);

    overlayWindow.on('close', () => {
        overlayWindow = null;
    });

    return overlayWindow;
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
