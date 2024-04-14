// commonFunctions.js
const { ipcRenderer } = require('electron');
// const Peer = require('peerjs').Peer;

const PeerManager = require('./peerManager.js');
const peerManager = new PeerManager();


const { CanvasManager } = require('./canvasManager.js');


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
function setupScreenSelected() {
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
            const type = 'stream'
            peerManager.initializePeer(type);
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
    setupPlayer, setupShowPicker, setupScreenSelected, setupUniqueIdDisplay, initCanvas
};

