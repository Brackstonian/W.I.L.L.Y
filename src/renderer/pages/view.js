import PeerManager from '../peer/peerManager.js';
import CanvasManager from '../canvas/canvasManager.js';

document.addEventListener('DOMContentLoaded', () => {
    window.api.send('view-page-maximized');

    viewButton.addEventListener('click', () => {
        const peerManager = new PeerManager();
        const peerId = document.getElementById('inputField').value;

        if (!peerId) {
            alert('Please enter a Peer ID.');
            return;
        }

        peerManager.initializePeer('view');

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const call = peerManager.peer.call(peerId, stream);
                call.on('stream', remoteStream => {
                    const videoContainer = document.getElementById('videoContainer');
                    videoContainer.style.display = "block";
                    localVideo.srcObject = remoteStream;


                    peerManager.dataConnection = peerManager.peer.connect(peerId);
                    peerManager.dataConnection.on('error', err => {
                        console.error('Data connection error:', err);
                    });

                    const canvasManager = new CanvasManager((data) => {
                        if (peerManager.dataConnection && peerManager.dataConnection.open) {
                            peerManager.dataConnection.send(data);
                        } else {
                            console.log('Data connection not ready or open.');
                        }
                    });
                    canvasManager.init();
                });
                call.on('error', err => {
                    console.error('Call error:', err);
                    alert('An error occurred during the call.');
                });
            }).catch(err => {
                console.error('Failed to get local stream', err);
                alert('Could not access your camera. Please check device permissions.');
            });
    });

});
