const { ipcRenderer } = require('electron');
const Peer = require('peerjs').Peer;

const { setupPlayer, setupShowPicker, setupScreenSelected, setupUniqueIdDisplay } = require('../renderer.js');

setupPlayer();
setupShowPicker();
setupScreenSelected();
setupUniqueIdDisplay();

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('open-view-page-maximized');
    ipcRenderer.send('request-player');
    ipcRenderer.send('request-screens');
});
