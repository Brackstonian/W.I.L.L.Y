const { ipcRenderer } = require('electron');
const Peer = require('peerjs').Peer;

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('close-overlay-window');
    ipcRenderer.send('open-view-page-default');
});