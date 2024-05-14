import getPeerManager from '../peer/peerManager.js';
import CanvasManager from '../canvas/canvasManager.js';
import { cursorSetup } from '../components/globals/cursor';

document.addEventListener('DOMContentLoaded', () => {
    cursorSetup();
    const viewButton = document.getElementById('viewButton');
    const retryButton = document.getElementById('retryButton');
    const inputWrapper = document.getElementById('inputWrapper');
    const statusWrapper = document.getElementById('statusWrapper');
    const statusMessage = document.getElementById('statusMessage');

    const handleConnection = (peerId) => {
        const peerManager = getPeerManager();

        statusMessage.textContent = 'Connecting...';
        inputWrapper.style.display = 'none';
        statusWrapper.style.display = 'block';

        peerManager.initializePeer('view');

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const call = peerManager.peer.call(peerId, stream);
                call.on('stream', remoteStream => {
                    const videoContainer = document.getElementById('videoContainer');

                    videoContainer.classList.add('active');
                    videoContainer.style.display = "block";

                    const localVideo = document.getElementById('localVideo');
                    localVideo.srcObject = remoteStream;
                    localVideo.onloadedmetadata = function () {
                        // Function to calculate the greatest common divisor
                        function gcd(a, b) {
                            return b ? gcd(b, a % b) : a;
                        }

                        // Calculate the GCD of the video dimensions
                        let divisor = gcd(this.videoWidth, this.videoHeight);

                        // Simplify the width and height by the GCD
                        let simplifiedWidth = this.videoWidth / divisor;
                        let simplifiedHeight = this.videoHeight / divisor;

                        // Display the aspect ratio as a fraction
                        videoContainer.style.setProperty('--video-aspect-ratio', `${simplifiedWidth}/${simplifiedHeight}`);
                    }

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
                    window.api.send('view-page-maximized');
                });
                call.on('error', err => {
                    console.error('Call error:', err);
                    statusMessage.textContent = 'Connection failed. Please retry.';
                    retryButton.style.display = 'block';
                });
            }).catch(err => {
                console.error('Failed to get local stream', err);
                statusMessage.textContent = 'Could not access your camera. Please check device permissions.';
                retryButton.style.display = 'block';
            });
    };

    viewButton.addEventListener('click', () => {
        const peerId = document.getElementById('inputField').value;
        if (!peerId) {
            alert('Please enter a Peer ID.');
            return;
        }
        handleConnection(peerId);
    });

    retryButton.addEventListener('click', () => {
        const peerId = document.getElementById('inputField').value;
        statusMessage.textContent = 'Retrying connection...';
        retryButton.style.display = 'none';
        handleConnection(peerId);
    });
});
