const { ipcRenderer } = require('electron');
const io = require('socket.io-client');
const Peer = require('peerjs').Peer;

const socket = io.connect('https://w-i-l-l-y-server.onrender.com:443');
let dataConnection = null;
let localStream = null;
let peer = null;

// Used For Share Portion
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

//Used For View Portion
function setupDataConnection(otherPeerId) {
    if (!dataConnection || dataConnection.peer !== otherPeerId) {
        if (dataConnection) {
            dataConnection.close();  // Close existing connection if different peerId
        }
        dataConnection = peer.connect(otherPeerId);
        handleDataConnection(dataConnection);
    }
}
function handleDataConnection(conn) {
    conn.on('open', () => {
        console.log('Data connection established with:', conn.peer);
    });

    conn.on('data', data => {
        console.log('Received data:', data);
        handleReceivedData(data);
    });

    conn.on('error', err => {
        console.error('Data connection error:', err);
    });
}

function handleReceivedData(data) {
    console.log('Data received:', data); // Log received data.
    simulateDrawing(data); // Simulate drawing based on received data.
}

function initializePeerConnection() {
    closeExistingConnections(); // Ensure any existing connection is closed before initializing a new one

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
    setupPeerEventHandlers();
}
function closeExistingConnections() {
    if (peer && !peer.destroyed) {
        peer.destroy(); // Closes the peer and all associated connections
        console.log('Existing peer connection destroyed.');
    }
}
function setupPeerEventHandlers() {
    peer.on('open', id => {
        console.log('Peer connection established with ID:', id);
    });

    peer.on('error', err => {
        closeExistingConnections();
        console.error('Peer error:', err);
    });

    peer.on('connection', conn => {
        handleDataConnection(conn);
    });
}
//temp
function simulateDrawing(data) {
    // Function to simulate drawing on the canvas based on received data.
    const x = data.x * canvas.width; // Calculate x coordinate.
    const y = data.y * canvas.height; // Calculate y coordinate.
    switch (data.type) {
        case 'mousedown':
            IS_DRAWING = true; // Start drawing.
            paths.push({
                points: [{ x, y }],
                alpha: 1,
                IS_DRAWING: true
            });
            break;
        case 'mousemove':
            if (IS_DRAWING && paths.length > 0 && paths[paths.length - 1].IS_DRAWING) {
                paths[paths.length - 1].points.push({ x, y }); // Add points to path.
            }
            break;
        case 'mouseup':
            if (paths.length > 0) {
                paths[paths.length - 1].IS_DRAWING = false; // Stop drawing.
            }
            IS_DRAWING = false;
            CanvasManager.startFading(); // Start fading drawing.
            break;
    }
    CanvasManager.drawPaths(); // Redraw paths.
}


// Function to send data over the data connection.
function sendData(data) {
    console.log('sending data');
    if (dataConnection && dataConnection.open) {
        console.log('Sending data:', data);
        dataConnection.send(data);
    } else {
        console.log('Data connection not ready or open.');
    }
}


module.exports = { initializePeer, handleCall, setupDataConnection, handleDataConnection, handleReceivedData, initializePeerConnection };
