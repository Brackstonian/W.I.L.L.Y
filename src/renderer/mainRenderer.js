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

// Event listeners for share and view buttons.
shareButtonListener(shareButton);
viewButtonListener(viewButton);


// IPC event handlers for screen sharing.
ipcRenderer.on('show-picker', (event, sources) => {
    const screenList = document.getElementById('screen-list'); // Get screen list element.
    screenList.innerHTML = ''; // Clear previous screen list.
    sources.forEach((source, index) => {
        const li = document.createElement('li'); // Create a new list item for each source.
        li.textContent = `Screen ${index + 1}: ${source.name}`; // Set text of list item.
        li.addEventListener('click', () => {
            ipcRenderer.send('select-screen', index); // Send selected screen index back to main process.
        });
        screenList.appendChild(li); // Append list item to screen list.
    });
});

ipcRenderer.on('screen-selected', (event, sourceId) => {
    // Handler for when a screen is selected.
    navigator.mediaDevices.getUserMedia({
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: sourceId // Use selected source ID for desktop capture.
            }
        }
    }).then(stream => {
        localVideo.srcObject = stream; // Display local video stream.
        localStream = stream;

        // Check if Peer instance does not exist and then initialize it.
        if (!peer) {
            peer = new Peer(null, {
                host: 'w-i-l-l-y-server.onrender.com',  // Host for peer server.
                port: 443,
                path: '/peerjs',
                secure: true,  // Use HTTPS.
                config: {
                    'iceServers': [ // Configuration for ICE servers.
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
                    ]
                }
            });

            peer.on('connection', conn => {
                dataConnection = conn;
                dataConnection.on('data', data => {
                    console.log('Received data:', data);
                    dataConnection = peer.connect(data);
                    dataConnection.on('open', () => {
                        console.log('Data connection established with:', otherPeerId); // Log established connection.
                    }); // Handle received data.
                    ipcRenderer.send('send-draw-data', data); // Send drawing data.
                });
            });

            peer.on('call', call => {
                call.answer(localStream); // Answer call with local stream.
                call.on('stream', remoteStream => {
                    localVideo.srcObject = remoteStream; // Display remote stream.
                });
                dataConnection = peer.connect(call.peer);
                dataConnection.on('open', () => {
                    console.log('Data connection established with:', otherPeerId); // Log established connection.
                }); // Setup data connection.
            });

            peer.on('error', err => {
                console.error('Peer error:', err); // Log peer errors.
            });
        }

        peer.on('open', id => {
            console.log('My peer ID is: ' + id);
            uniqueIdDisplay.innerText = `Your unique ID: ${id}`; // Display peer ID.
            ipcRenderer.send('create-overlay-window'); // Request to create an overlay window.
        });

        // Event handler for incoming calls.
        peer.on('call', call => {
            call.answer(localStream); // Answer call with local stream.
            dataConnection = peer.connect(call.peer);
            dataConnection.on('open', () => {
                console.log('Data connection established with:', otherPeerId); // Log established connection.
            });
        });

    }).catch(err => {
        console.error('Failed to get screen stream', err); // Log errors during stream capture.
    });
});