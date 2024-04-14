const { Peer } = require('peerjs');
const { ipcRenderer } = require('electron');

class PeerManager {
    constructor() {
        this.peer = null;
        this.dataConnection = null;
    }

    initializePeer(type) {
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

    handleCall(call) {
        call.answer(localStream);
        call.on('error', err => {
            console.error('Call error:', err);
        });
    }


    handleDataConnection(conn) {
        // similar to existing logic
    }

    closeExistingConnections() {
        if (this.peer && !this.peer.destroyed) {
            this.peer.destroy();
            console.log('Existing peer connection destroyed.');
        }
    }
}

module.exports = PeerManager;
