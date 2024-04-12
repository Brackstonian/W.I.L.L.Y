const { ipcRenderer } = require('electron');

function shareButtonListener(shareButton) {
    shareButton.addEventListener('click', () => {
        console.log('Share button clicked');
        ipcRenderer.send('request-screens');
    });
}

function viewButtonListener(viewButton) {
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
}

let IS_DRAWING = false;


let dataConnection = null;
let paths = [];
let peer = null;

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

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

module.exports = { shareButtonListener, viewButtonListener };
