const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'api', {

    on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },

    send: (channel, data) => {
        // Define a list of channels that the renderer is allowed to send to
        const validSendChannels = ["load-view-page", "load-share-page", "open-new-window", "close-overlay-window", "open-view-page-default", "open-view-page-maximized", "request-player", "request-screens", "show-picker", "select-screen"];
        if (validSendChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        } else {
            console.error(`Attempted to send to an invalid channel: ${channel}`);
        }
    },

    receive: (channel, func) => {
        // Define a list of channels the renderer is allowed to receive from
        const validReceiveChannels = ["navigate-to"];
        if (validReceiveChannels.includes(channel)) {
            // Filter the callback function from IPC events to avoid exposing low-level IPC details
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else {
            console.error(`Attempted to receive from an invalid channel: ${channel}`);
        }
    }
}
);
