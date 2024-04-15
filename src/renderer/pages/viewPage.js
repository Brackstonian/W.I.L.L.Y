const { ipcRenderer } = require('electron');
const Peer = require('peerjs').Peer;

ipcRenderer.send('open-view-page-maximized');

const viewButton = document.getElementById('viewButton');

const PeerManager = require('../peerManager.js');
const peerManager = new PeerManager();
const CanvasManager = require('../canvasManager.js');
const canvasManager = new CanvasManager(sendData);

viewButton.addEventListener('click', () => {
    console.log('View button clicked');
    ipcRenderer.send('request-player');
    canvasManager.init();

    const peerId = document.getElementById('inputField').value;
    if (!peerId) return;

    const type = 'view'
    peerManager.initializePeer(type);

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const call = peerManager.peer.call(peerId, stream);
            call.on('stream', remoteStream => {
                document.getElementById('localVideo').srcObject = remoteStream;
            });
            peerManager.setupDataConnection(peerId);
        }).catch(err => {
            console.error('Failed to get local stream', err);
        });
});

function sendData(data) {
    console.log('Sending data:', data);
    if (peerManager.dataConnection && peerManager.dataConnection.open) {
        peerManager.dataConnection.send(data);
    } else {
        console.log('Data connection not ready or open.');
    }
}



