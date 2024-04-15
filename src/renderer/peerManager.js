const { Peer } = require('peerjs');
const { ipcRenderer } = require('electron');

const CanvasManager = require('./canvasManager.js');
const canvasManager = new CanvasManager();

class PeerManager {
    constructor() {
        this.peer = null;
        this.dataConnection = null;
    }

    closeExistingConnections() {
        if (peer && !peer.destroyed) {
            peer.destroy(); // Closes the peer and all associated connections
            console.log('Existing peer connection destroyed.');
        }
    }

    initializePeer(type) {
        this.closeExistingConnections();
        if (this.peer && !this.peer.destroyed) {
            console.log('Using existing this.peer instance.');
            return;  // Use existing this.peer if it's still active
        }
        this.peer = new Peer(null, {
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

        if (type === 'stream') {
            this.setupStreamPeerEventHandlers();
        } else if (type === 'view') {
            this.setupViewPeerEventHandlers();
        }

    }

    setupStreamPeerEventHandlers() {
        this.peer.on('open', id => {
            console.log('Peer ID:', id);
            ipcRenderer.send('create-share-id', id); // Send drawing data.
        });

        this.peer.on('error', err => {
            console.error('Peer error:', err);
            peer.destroy(); // Destroy peer on error
        });

        this.peer.on('connection', conn => {
            if (this.dataConnection) {
                this.dataConnection.close();  // Close existing connection if open
            }
            this.dataConnection = conn;
            this.dataConnection.on('data', data => {
                console.log('Received data:', data);
                ipcRenderer.send('send-draw-data', data); // Send drawing data.
            });
            this.dataConnection.on('open', () => {
                ipcRenderer.send('create-overlay-window'); // Request to create an overlay window.
                console.log('Data connection established with:', conn.peer);
            });
        });

        this.peer.on('call', call => {
            this.handleCall(call);
        });
    }

    setupViewPeerEventHandlers() {
        this.peer.on('open', id => {
            console.log('Peer connection established with ID:', id);
        });

        this.peer.on('error', err => {
            closeExistingConnections();
            console.error('Peer error:', err);
        });

        this.peer.on('connection', conn => {
            this.handleDataConnection(conn);
        });
    }

    handleCall(call) {
        call.answer(localStream);
        call.on('error', err => {
            console.error('Call error:', err);
        });
    }

    handleDataConnection(conn) {
        conn.on('open', () => {
            console.log('Data connection established with:', conn.peer);
        });

        conn.on('data', data => {
            console.log('Received data:', data);
            this.handleReceivedData(data);
        });

        conn.on('error', err => {
            console.error('Data connection error:', err);
        });
    }

    closeExistingConnections() {
        if (this.peer && !this.peer.destroyed) {
            this.peer.destroy();
            console.log('Existing peer connection destroyed.');
        }
    }

    setupDataConnection(otherPeerId) {
        if (!this.dataConnection || this.dataConnection.peer !== otherPeerId) {
            if (this.dataConnection) {
                this.dataConnection.close();  // Close existing connection if different peerId
            }
            this.dataConnection = this.peer.connect(otherPeerId);
            this.handleDataConnection(this.dataConnection);
        }
    }

    handleReceivedData(data) {
        console.log('Data received:', data); // Log received data.
        canvasManager.simulateDrawing(data); // Simulate drawing based on received data.
    }
}

module.exports = PeerManager;
