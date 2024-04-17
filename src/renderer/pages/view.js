import PeerManager from '../peer/peerManager.js';


document.addEventListener('DOMContentLoaded', () => {
    window.api.send('view-page-maximized');

    viewButton.addEventListener('click', () => {
        const peerManager = new PeerManager();
        const peerId = document.getElementById('inputField').value;
        console.log("🚀 ~ viewButton.addEventListener ~ peerId:", peerId)

        if (!peerId) {
            alert('Please enter a Peer ID.');
            return;
        }

        peerManager.initializePeer('view');

        // const call = peerManager.peer.call(peerId, null);

        // call.on('stream', remoteStream => {
        //     const videoContainer = document.getElementById('videoContainer');
        //     const videoElement = document.getElementById('localVideo');
        //     videoContainer.style.display = "block";
        //     canvasManager.init();
        //     videoElement.srcObject = remoteStream;
        // });
        // call.on('error', err => {
        //     console.error('Call error:', err);
        //     alert('An error occurred during the call.');
        // });
    });

});

