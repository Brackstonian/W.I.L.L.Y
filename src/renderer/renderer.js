// commonFunctions.js
const { ipcRenderer } = require('electron');
const Peer = require('peerjs').Peer;

// const { initializePeer } = require('./peerSetup.js');
const { CanvasManager } = require('./canvasManager.js');

let dataConnection = null;
let localStream = null;
let peer = null;


function initializePeer() {
    if (peer && !peer.destroyed) {
        console.log('Using existing peer instance.');
        return;  // Use existing peer if it's still active
    }
    peer = new Peer(null, {
        host: 'w-i-l-l-y-server.onrender.com',
        port: 443,
        path: '/peerjs',
        secure: true,
        config: {
            'iceServers': [
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
            ]
        }
    });

    peer.on('open', id => {
        console.log('Peer ID:', id);
        ipcRenderer.send('create-share-id', id); // Send drawing data.
    });

    peer.on('error', err => {
        console.error('Peer error:', err);
        peer.destroy(); // Destroy peer on error
    });

    peer.on('connection', conn => {
        if (dataConnection) {
            dataConnection.close();  // Close existing connection if open
        }
        dataConnection = conn;
        dataConnection.on('data', data => {
            console.log('Received data:', data);
            ipcRenderer.send('send-draw-data', data); // Send drawing data.
        });
        dataConnection.on('open', () => {
            ipcRenderer.send('create-overlay-window'); // Request to create an overlay window.
            console.log('Data connection established with:', conn.peer);
        });
    });

    peer.on('call', call => {
        handleCall(call);
    });
}
function handleCall(call) {
    call.answer(localStream);
    call.on('error', err => {
        console.error('Call error:', err);
    });
}
function setupPlayer() {
    ipcRenderer.on('load-player', (event) => {
        var containerDiv = document.getElementById("videoContainer");
        containerDiv.style.display = "block";
    });
}
function setupShowPicker() {
    return ipcRenderer.on('show-picker', (event, sources) => {
        const screenList = document.getElementById('screen-list');
        screenList.innerHTML = '';
        sources.forEach((source, index) => {
            const li = document.createElement('li');
            li.textContent = `Screen ${index + 1}: ${source.name}`;
            li.addEventListener('click', () => {
                ipcRenderer.send('select-screen', index);
            });
            screenList.appendChild(li);
        });
    });
}
function setupSceenSelected() {
    return ipcRenderer.on('screen-selected', (event, sourceId) => {
        navigator.mediaDevices.getUserMedia({
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId
                }
            }
        }).then(stream => {
            localVideo.srcObject = stream;
            localStream = stream;
            initializePeer();
        }).catch(err => {
            console.error('Failed to get screen stream', err);
        });
    });
}
function setupUniqueIdDisplay() {
    return ipcRenderer.on('display-unique-id', (event, sourceId) => {
        const uniqueIdDisplay = document.getElementById('uniqueId');
        uniqueIdDisplay.innerText = `Share this ID  : ${sourceId}`; // Display peer ID
    });
}
function initCanvas() {
    return ipcRenderer.on('init-canvas', (event, sourceId) => {
        CanvasManager.init(canvas, ctx);
    });
    console.log("🚀 ~ ipcRenderer.on ~ CanvasManager:", CanvasManager)
}

module.exports = {
    setupPlayer, setupShowPicker, setupSceenSelected, setupUniqueIdDisplay, initCanvas
};

