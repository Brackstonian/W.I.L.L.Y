// Import the ipcRenderer for inter-process communication and additional modules for networking and peer-to-peer connections.
const { ipcRenderer } = require('electron');
const io = require('socket.io-client');
const Peer = require('peerjs').Peer;

// Connect to a signaling server using socket.io.
const socket = io.connect('https://w-i-l-l-y-server.onrender.com:443');

// Get references to HTML elements to interact with the DOM.
const shareButton = document.getElementById('shareButton');
const viewButton = document.getElementById('viewButton');
const uniqueIdDisplay = document.getElementById('uniqueId');
const localVideo = document.getElementById('localVideo');
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Initialize variables for peer connections and media streams.
let peer = null;
let localStream = null;
let dataConnection = null;
let paths = [];

// Flag to indicate whether the drawing is currently active.
let IS_DRAWING = false;

// Object to manage the canvas drawing.
const CanvasManager = {
    fadeTimeout: null, // Store fade timeout to manage fading effect.

    init() {
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

// Event listeners for share and view buttons.
shareButton.addEventListener('click', () => {
    console.log('Share button clicked');
    ipcRenderer.send('request-screens'); // Request available screens to share.
});

viewButton.addEventListener('click', () => {
    console.log('View button clicked');
    CanvasManager.init(); // Initialize the canvas manager on view click.

    const peerId = document.getElementById('inputField').value; // Get the peer ID from input field.
    if (!peerId) return; // Return if no ID is entered.

    if (!peer) {
        // Create a new Peer instance if one does not exist.
        peer = new Peer(null, {
            host: 'w-i-l-l-y-server.onrender.com',
            port: 443,
            path: '/peerjs',
            secure: true, // Use HTTPS.
            config: {
                'iceServers': [ // ICE servers for handling NAT traversal.
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
                ]
            }
        });
    }

    // Peer event handlers.
    peer.on('open', id => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const call = peer.call(peerId, stream); // Make a call with local video stream.
                call.on('stream', remoteStream => {
                    localVideo.srcObject = remoteStream; // Display the remote video stream.
                });
                setupDataConnection(peerId); // Setup data connection.
            }).catch(err => {
                console.error('Failed to get local stream', err);
            });
    });

    peer.on('error', err => {
        console.error('Peer error:', err); // Log peer errors.
    });
});

function setupDataConnection(otherPeerId) {
    // Function to establish and handle a data connection to another peer.
    dataConnection = peer.connect(otherPeerId);
    dataConnection.on('open', () => {
        console.log('Data connection established with:', otherPeerId);
    });

    peer.on('connection', function (conn) {
        conn.on('data', function (data) {
            console.log('Received data:', data); // Log received data.
            handleReceivedData(data); // Process received data.
            ipcRenderer.send('send-draw-data', data); // Send drawing data via IPC.
        });
    });

    dataConnection.on('error', err => {
        console.error('Data connection error:', err); // Log data connection errors.
    });
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

            setupPeerEventsTwo(); // Setup additional peer events.
        }

        peer.on('open', id => {
            console.log('My peer ID is: ' + id);
            uniqueIdDisplay.innerText = `Your unique ID: ${id}`; // Display peer ID.
            ipcRenderer.send('create-overlay-window'); // Request to create an overlay window.
        });

        // Event handler for incoming calls.
        peer.on('call', call => {
            call.answer(localStream); // Answer call with local stream.
            setupDataConnection(call.peer); // Setup data connection for the call.
        });

    }).catch(err => {
        console.error('Failed to get screen stream', err); // Log errors during stream capture.
    });
});

function setupPeerEventsTwo() {
    // Function to handle additional Peer events.
    peer.on('connection', conn => {
        dataConnection = conn;
        dataConnection.on('data', data => {
            console.log('Received data:', data);
            handleReceivedData(data); // Handle received data.
            ipcRenderer.send('send-draw-data', data); // Send drawing data.
        });
    });

    peer.on('call', call => {
        call.answer(localStream); // Answer call with local stream.
        call.on('stream', remoteStream => {
            localVideo.srcObject = remoteStream; // Display remote stream.
        });
        setupDataConnectionTwo(call.peer); // Setup data connection.
    });

    peer.on('error', err => {
        console.error('Peer error:', err); // Log peer errors.
    });
}

function setupDataConnectionTwo(otherPeerId) {
    // Setup a data connection to another peer.
    dataConnection = peer.connect(otherPeerId);
    dataConnection.on('open', () => {
        console.log('Data connection established with:', otherPeerId); // Log established connection.
    });
}
