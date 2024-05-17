import getPeerManager from '../peer/peerManager.js';
import CanvasManager from '../canvas/canvasManager.js';
import { addLog } from '../components/log.js';

document.addEventListener('DOMContentLoaded', async () => {
    const viewButton = document.getElementById('viewButton');
    const retryButton = document.getElementById('retryButton');
    // const inputWrapper = document.getElementById('inputWrapper');

    const drawingMenu = document.getElementById('drawingMenu');
    const penColorInput = document.getElementById('penColor');
    const penWidthInput = document.getElementById('penWidth');
    const penContainer = document.getElementById('penContainer');
    const penBody = document.getElementById('penBody');
    const sliderContainer = document.getElementById('sliderContainer');

    let peerManager;
    let canvasManager;
    let call;

    await addLog('Ready! Add your Name and ID!');


    const initializePeerManager = async () => {
        peerManager = getPeerManager();
        peerManager.initializePeer('view');

        peerManager.peer.on('disconnected', async () => {
            await addLog('Disconnected. Please retry.');
            retryButton.style.display = 'block';
        });

        peerManager.peer.on('close', async () => {
            await addLog('Connection closed. Please retry.');
            retryButton.style.display = 'block';
        });

        peerManager.peer.on('error', async (err) => {
            console.error('Peer error:', err);
            await addLog('Connection error. Please retry.');
            retryButton.style.display = 'block';
        });
    };

    const handleConnection = async (peerId, userName) => {
        if (peerManager && peerManager.peer && peerManager.peer.open) {
            peerManager.peer.destroy();
        }

        initializePeerManager();

        await addLog('Connecting...');

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                call = peerManager.peer.call(peerId, stream);
                call.on('stream', remoteStream => {
                    const videoContainer = document.getElementById('videoContainer');

                    videoContainer.classList.add('active');
                    videoContainer.style.display = "block";

                    const localVideo = document.getElementById('localVideo');
                    localVideo.srcObject = remoteStream;
                    localVideo.onloadedmetadata = function () {
                        function gcd(a, b) {
                            return b ? gcd(b, a % b) : a;
                        }

                        let divisor = gcd(this.videoWidth, this.videoHeight);
                        let simplifiedWidth = this.videoWidth / divisor;
                        let simplifiedHeight = this.videoHeight / divisor;
                        videoContainer.style.setProperty('--video-aspect-ratio', `${simplifiedWidth}/${simplifiedHeight}`);
                    };

                    peerManager.dataConnection = peerManager.peer.connect(peerId);
                    peerManager.dataConnection.on('error', err => {
                        console.error('Data connection error:', err);
                    });

                    canvasManager = new CanvasManager((data) => {
                        if (peerManager.dataConnection && peerManager.dataConnection.open) {
                            peerManager.dataConnection.send({ ...data, userName });
                        } else {
                            console.log('Data connection not ready or open.');
                        }
                    });
                    canvasManager.init();

                    // Set the user's name in CanvasManager
                    canvasManager.setUserName(userName);

                    // Set initial pen settings in CanvasManager
                    canvasManager.setPenColor(penColorInput.value);
                    canvasManager.setPenWidth(penWidthInput.value);

                    // Update CanvasManager with pen settings in real-time
                    penColorInput.addEventListener('input', () => {
                        canvasManager.setPenColor(penColorInput.value);
                        penBody.style.backgroundColor = penColorInput.value;
                    });

                    penWidthInput.addEventListener('input', () => {
                        canvasManager.setPenWidth(penWidthInput.value);
                        penBody.style.height = `${penWidthInput.value}px`;
                    });

                    window.api.send('view-page-maximized');
                    canvasManager.resizeCanvas();
                });

                call.on('close', async () => {
                    await addLog('Call closed. Please retry.');
                    retryButton.style.display = 'block';
                });

                call.on('error', async err => {
                    console.error('Call error:', err);
                    await addLog('Connection failed. Please retry.');
                    retryButton.style.display = 'block';
                });
            }).catch(async err => {
                console.error('Failed to get local stream', err);
                await addLog('Could not access your camera. Please check device permissions.');
                retryButton.style.display = 'block';
            });
    };

    viewButton.addEventListener('click', async () => {
        const peerId = document.getElementById('inputField').value;
        const userName = document.getElementById('nameField').value;
        if (!peerId) {
            await addLog('Please enter a Peer ID.');
            return;
        }
        if (!userName) {
            await addLog('Please enter your name.');
            return;
        }
        handleConnection(peerId, userName);
    });

    retryButton.addEventListener('click', async () => {
        const peerId = document.getElementById('inputField').value;
        const userName = document.getElementById('nameField').value;
        if (!peerId) {
            await addLog('Please enter a Peer ID.');
            return;
        }
        if (!userName) {
            await addLog('Please enter your name.');
            return;
        }
        await addLog('Retrying connection...');

        retryButton.style.display = 'none';
        handleConnection(peerId, userName);
    });

    penContainer.addEventListener('click', () => {
        sliderContainer.style.display = sliderContainer.style.display === 'none' ? 'flex' : 'none';
    });

    // Set initial pen width and color
    penBody.style.backgroundColor = penColorInput.value;
    penBody.style.height = `${penWidthInput.value}px`;
});
