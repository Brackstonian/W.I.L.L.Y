import getPeerManager from '../peer/peerManager.js';
import CanvasManager from '../canvas/canvasManager.js';
import { addLog } from '../components/log.js';

document.addEventListener('DOMContentLoaded', async () => {
    const viewButton = document.getElementById('viewButton');
    // const inputWrapper = document.getElementById('inputWrapper');

    const drawingMenu = document.querySelector('.app-main-pen-menu');
    const penColorInput = document.querySelector('.app-main-pen-menu__penColor');
    const penWidthInput = document.querySelector('.app-main-pen-menu__penWidth');
    const penContainer = document.querySelector('.app-main-pen-menu__wrapper');
    const penBody = document.querySelector('.app-main-pen-menu__pen-body');
    const sliderContainer = document.querySelector('.app-main-pen-menu__slider-wrapper');

    let peerManager;
    let canvasManager;
    let call;

    await addLog('Ready! Add your Name and ID!');


    const initializePeerManager = async () => {
        peerManager = getPeerManager();
        peerManager.initializePeer('view');

        peerManager.peer.on('disconnected', async () => {
            await addLog('Disconnected. Please retry.');
        });

        peerManager.peer.on('close', async () => {
            await addLog('Connection closed. Please retry.');
        });

        peerManager.peer.on('error', async (err) => {
            console.error('Peer error:', err);
            await addLog('Connection error. Please retry.');
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
                    const videoContainer = document.querySelector('.app-main-video-player');

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

                });

                call.on('error', async err => {
                    console.error('Call error:', err);
                    await addLog('Connection failed. Please retry.');
                });
            }).catch(async err => {
                console.error('Failed to get local stream', err);
                await addLog('Could not access your camera. Please check device permissions.');
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

    penContainer.addEventListener('click', () => {
        sliderContainer.style.display = sliderContainer.style.display === 'none' ? 'flex' : 'none';
    });

    // Set initial pen width and color
    penBody.style.backgroundColor = penColorInput.value;
    penBody.style.height = `${penWidthInput.value}px`;
});
