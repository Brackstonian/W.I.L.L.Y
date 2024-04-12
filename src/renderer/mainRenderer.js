// Import the ipcRenderer for inter-process communication and additional modules for networking and peer-to-peer connections.
const { ipcRenderer } = require('electron');
const io = require('socket.io-client');
const Peer = require('peerjs').Peer;

const { shareButtonListener, viewButtonListener } = require('../src/renderer/ui.js');

// Connect to a signaling server using socket.io.
const socket = io.connect('https://w-i-l-l-y-server.onrender.com:443');

// Get references to HTML elements to interact with the DOM.
const shareButton = document.getElementById('shareButton');
const viewButton = document.getElementById('viewButton');
const uniqueIdDisplay = document.getElementById('uniqueId');
const localVideo = document.getElementById('localVideo');

let dataConnection = null;
let localStream = null;
let peer = null;

// Ensure only one peer instance and manage its lifecycle.
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
        uniqueIdDisplay.innerText = `Your unique ID: ${id}`; // Display peer ID
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
    call.on('stream', remoteStream => {
        localVideo.srcObject = remoteStream;
    });
    call.on('close', () => {
        console.log('Call ended.');
    });
    call.on('error', err => {
        console.error('Call error:', err);
    });
}

// Event listeners for share and view buttons.
shareButtonListener(shareButton);
viewButtonListener(viewButton);

// IPC event handlers for screen sharing.
ipcRenderer.on('show-picker', (event, sources) => {
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

ipcRenderer.on('screen-selected', (event, sourceId) => {
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
