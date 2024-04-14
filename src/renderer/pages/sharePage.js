const { ipcRenderer } = require('electron');
const Peer = require('peerjs').Peer;

let dataConnection = null;
let localStream = null;
let peer = null;

const { setupPlayer, setupShowPicker, setupScreenSelected, setupUniqueIdDisplay } = require('../renderer.js');

setupPlayer();
setupShowPicker();
setupScreenSelected();
setupUniqueIdDisplay();

const shareButton = document.getElementById('shareButton');
const localVideo = document.getElementById('localVideo');
const backButton = document.getElementById('backButton');

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('open-view-page-maximized');
    ipcRenderer.send('request-player');
    ipcRenderer.send('request-screens');
});
