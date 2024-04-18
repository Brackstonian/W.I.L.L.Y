import PeerManager from '../peer/peerManager.js';
import CanvasManager from '../canvas/canvasManager.js';
import { cursorSetup } from '../components/globals/cursor';

document.addEventListener('DOMContentLoaded', () => {
    cursorSetup();
    viewButton.addEventListener('click', () => {
        const peerManager = new PeerManager();
        const peerId = document.getElementById('inputField').value;

        const viewPageButton = document.querySelector('.viewPage__button');

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

                    videoContainer.classList.add('active')
                    viewPageButton.classList.add('fullscreen');
                    videoContainer.style.display = "block";

                    localVideo.srcObject = remoteStream;
                    localVideo.onloadedmetadata = function () {
                        console.log('width is', this.videoWidth);
                        console.log('height is', this.videoHeight);

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
                        console.log('aspect ratio is', `${simplifiedWidth}/${simplifiedHeight}`);
                        videoContainer.style.setProperty('--video-aspect-ratio', `${simplifiedWidth}/${simplifiedHeight}`);
                    }

                    // videoContainer.classList.add('player-fullscreen')
                    // viewPageButton.classList.add('fullscreen');


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
                    alert('An error occurred during the call.');
                });
            }).catch(err => {
                console.error('Failed to get local stream', err);
                alert('Could not access your camera. Please check device permissions.');
            });
    });

});
