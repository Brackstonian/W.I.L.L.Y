const { ipcRenderer } = require('electron');
const Peer = require('peerjs').Peer;


let IS_DRAWING = false;

let localStream = null;
let peer = null;  // Moved to top for global scope reuse
let dataConnection = null;
let paths = [];
let canvas = null;
let ctx = null;

const { setupPlayer, setupShowPicker, setupSceenSelected } = require('../renderer');
// const { setupDataConnection, initializePeerConnection } = require('../peerSetup.js');

ipcRenderer.send('open-view-page-maximized');

const viewButton = document.getElementById('viewButton');
const localVideo = document.getElementById('localVideo');
const backButton = document.getElementById('backButton');

function closeExistingConnections() {
    if (peer && !peer.destroyed) {
        peer.destroy(); // Closes the peer and all associated connections
        console.log('Existing peer connection destroyed.');
    }
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


viewButton.addEventListener('click', () => {
    console.log('View button clicked');
    ipcRenderer.send('request-player');
    CanvasManager.init(canvas, ctx);

    const peerId = document.getElementById('inputField').value;
    if (!peerId) return;

    initializePeerConnection();  // Initialize or reuse peer connection

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const call = peer.call(peerId, stream);
            call.on('stream', remoteStream => {
                document.getElementById('localVideo').srcObject = remoteStream;
            });
            setupDataConnection(peerId);
        }).catch(err => {
            console.error('Failed to get local stream', err);
        });
});


const CanvasManager = {
    fadeTimeout: null, // Store fade timeout to manage fading effect.

    init() {

        canvas = document.getElementById('drawingCanvas');
        ctx = canvas.getContext('2d');
        this.resizeCanvas(); // Adjust canvas size.
        this.drawPaths(); // Start the drawing process.
        window.onresize = this.resizeCanvas.bind(this); // Ensure canvas resizes properly on window resize.

        // Set up mouse event handlers for drawing on the canvas.
        canvas.onmousedown = (e) => {
            clearTimeout(this.fadeTimeout); // Clear fading timeout on new interaction.
            IS_DRAWING = true; // Set drawing flag.
            const normalizedX = e.offsetX / canvas.width;
            const normalizedY = e.offsetY / canvas.height;
            const newPath = {
                points: [{ x: e.offsetX, y: e.offsetY }],
                alpha: 1,
                IS_DRAWING: true
            };
            paths.push(newPath); // Add new path to paths array.
            sendData({ type: 'mousedown', x: normalizedX, y: normalizedY }); // Send data for new path start.
        };

        canvas.onmousemove = (e) => {
            if (IS_DRAWING) {
                const normalizedX = e.offsetX / canvas.width;
                const normalizedY = e.offsetY / canvas.height;
                let currentPath = paths[paths.length - 1];
                currentPath.points.push({ x: e.offsetX, y: e.offsetY }); // Append new point to current path.
                sendData({ type: 'mousemove', x: normalizedX, y: normalizedY }); // Send data for movement.
            }
        };

        // End drawing on mouse up or mouse out.
        canvas.onmouseup = canvas.onmouseout = () => {
            if (IS_DRAWING) {
                IS_DRAWING = false;
                paths[paths.length - 1].IS_DRAWING = false;
                sendData({ type: 'mouseup' });
                this.startFading(); // Start fading the drawing after interaction stops.
            }
        };
    },

    drawPaths() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas.
        paths.forEach(path => {
            ctx.beginPath();
            ctx.moveTo(path.points[0].x, path.points[0].y);
            path.points.forEach(point => ctx.lineTo(point.x, point.y)); // Draw each path.
            ctx.strokeStyle = `rgba(255, 0, 0, ${path.alpha})`; // Set line color with alpha for fading effect.
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        requestAnimationFrame(this.drawPaths.bind(this)); // Continue animation.
    },

    resizeCanvas() {
        canvas.width = canvas.offsetWidth; // Adjust canvas width to element's width.
        canvas.height = canvas.offsetHeight; // Adjust canvas height to element's height.
    },

    startFading() {
        // Start a timeout to fade lines after drawing is completed.
        this.fadeTimeout = setTimeout(() => {
            let fadeInterval = setInterval(() => {
                let allFaded = true;
                paths.forEach(path => {
                    if (!path.IS_DRAWING && path.alpha > 0) {
                        path.alpha -= 0.01; // Gradually reduce alpha to create fading effect.
                        allFaded = false;
                    }
                });
                this.drawPaths(); // Redraw paths with updated alpha.
                if (allFaded) clearInterval(fadeInterval); // Stop interval when all paths have faded.
            }, 50);
        }, 1000);
    },
};

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


function handleReceivedData(data) {
    console.log('Data received:', data); // Log received data.
    simulateDrawing(data); // Simulate drawing based on received data.
}

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