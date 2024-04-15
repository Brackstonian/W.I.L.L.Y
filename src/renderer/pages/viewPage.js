window.api.send('open-view-page-maximized');

const viewButton = document.getElementById('viewButton');



import PeerManager from '../peerManager.js';
const peerManager = new PeerManager();

import CanvasManager from '../canvasManager.js';

const canvasManager = new CanvasManager(sendData);

viewButton.addEventListener('click', () => {
    console.log('View button clicked');
    window.api.send('request-player');

    const peerId = document.getElementById('inputField').value;
    if (!peerId) {
        alert('Please enter a Peer ID.');
        return;
    }

    initializeViewing(peerId);
});

function initializeViewing(peerId) {
    peerManager.initializePeer('view');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const call = peerManager.peer.call(peerId, stream);
            setupCallHandlers(call);
            peerManager.setupDataConnection(peerId);
        }).catch(err => {
            console.error('Failed to get local stream', err);
            alert('Could not access your camera. Please check device permissions.');
        });
}

function setupCallHandlers(call) {
    call.on('stream', remoteStream => {
        const videoContainer = document.getElementById('videoContainer');
        const videoElement = document.getElementById('localVideo');
        videoContainer.style.display = "block";
        canvasManager.init();
        videoElement.srcObject = remoteStream;
    });
    call.on('error', err => {
        console.error('Call error:', err);
        alert('An error occurred during the call.');
    });
}


function sendData(data) {
    console.log('Sending data:', data);
    if (peerManager.dataConnection && peerManager.dataConnection.open) {
        peerManager.dataConnection.send(data);
    } else {
        console.log('Data connection not ready or open.');
    }
}
