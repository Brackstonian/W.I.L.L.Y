import CanvasManager from '../../canvas/canvasManager.js';
import { addLog } from '../../components/log.js';
import { initializePeerManager } from './initializePeerManager.js';

export const handleConnection = async (peerId, userName, penColorInput, penWidthInput, penBody) => {
    let peerManager = await initializePeerManager();

    await addLog('Connecting...');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const call = peerManager.peer.call(peerId, stream);
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

                const canvasManager = new CanvasManager((data) => {
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
