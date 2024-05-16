const { contextBridge, ipcRenderer } = require('electron');

function invoke(channel, data) {
    return ipcRenderer.invoke(channel, data);
}

function send(channel, data) {
    return ipcRenderer.send(channel, data);
}

contextBridge.exposeInMainWorld('api', {
    invoke,
    send
});