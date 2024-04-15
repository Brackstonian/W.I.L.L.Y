// import { Peer } from 'peerjs';
const Peer = window.Peer; // Use the Peer object exposed by the preload script

import PeerManager from '../peerManager.js';
import CanvasManager from '../canvasManager.js';


const peerManager = new PeerManager(Peer);
const canvasManager = new CanvasManager();

document.addEventListener('DOMContentLoaded', () => {
    window.api.send('open-view-page-maximized');
    window.api.send('request-player');
    window.api.send('request-screens');

    window.api.on('load-player', (event) => {
        var containerDiv = document.getElementById("videoContainer");
        containerDiv.style.display = "block";
    });
    window.api.on('show-picker', (sources) => {
        const screenList = document.getElementById('screen-list');
        screenList.innerHTML = '';
        sources.forEach((source, index) => {
            const li = document.createElement('li');
            li.textContent = `Screen ${index + 1}: ${source.name}`;
            li.addEventListener('click', () => {
                window.api.send('select-screen', index);
            });
            screenList.appendChild(li);
        });
    });
    window.api.on('screen-selected', (sourceId) => {
        // Attempt to get media stream with the selected screen source ID

        navigator.mediaDevices.getUserMedia({
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId
                }
            }
        }).then(stream => {

            localStream = stream;
            localVideo.srcObject = stream;
            // Update the stream in any existing calls
            if (peerManager.currentCall) {
                peerManager.updateStreamInCall(stream);
            }
            const type = 'stream';
            peerManager.initializePeer(type);

            console.log('Screen stream has been initialized and peer connection set up.');
        }).catch(err => {
            console.error('Failed to get screen stream', err);
            // Optionally, inform the user that the stream could not be obtained
            alert('Unable to capture the screen. Please check console for more details.');
        });
    });
    window.api.on('display-unique-id', (event, sourceId) => {
        const uniqueIdDisplay = document.getElementById('uniqueId');
        uniqueIdDisplay.innerText = `Share this ID  : ${sourceId}`; // Display peer ID
    });
    window.api.on('init-canvas', (event, sourceId) => {
        CanvasManager.init(canvas, ctx);
    });

});

