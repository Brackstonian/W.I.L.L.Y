const { contextBridge, ipcRenderer } = require('electron');

// Helper functions to manage IPC channels
const validSendChannels = [
    "view-page-maximized",
    "view-page-default",
    "close-overlay-page",
    "load-view-page",
    "load-share-page",
    "initialize-peer",
    "open-new-window",
    "request-screens",
    "show-picker",
    "select-screen",
    "create-share-id",
    "send-draw-data",
    "draw-data"
];
const validReceiveChannels = [
    "navigate-to"
];

function invoke(channel, data) {
    return ipcRenderer.invoke(channel, data);
}

function send(channel, data) {
    if (validSendChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
    } else {
        console.error(`Attempted to send to an invalid channel: ${channel}`);
    }
}

function receive(channel, func) {
    if (validReceiveChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    } else {
        console.error(`Attempted to receive from an invalid channel: ${channel}`);
    }
}

function subscribeToRenderer(channel, func) {
    // This creates a more secure, generic listener function that is used internally
    ipcRenderer.on(channel, (event, ...args) => func(...args));
}

// Exposing the 'api' object to the renderer
contextBridge.exposeInMainWorld('api', {
    invoke,
    send,
    receive,
    on: subscribeToRenderer
});
