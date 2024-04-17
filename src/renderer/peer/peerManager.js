// const Peer = require('peerjs')
import Peer from 'peerjs';
import { setupStreamPeerEventHandlers, setupViewPeerEventHandlers } from './peerEvents';
// import { closeExistingConnections } from './connectionHandlers';

export default class PeerManager {
    constructor(localStream) {
        this.peer = null;
        this.dataConnection = null;
        this.localStream = localStream;
    }

    initializePeer(type) {
        // closeExistingConnections(this);
        if (this.peer && !this.peer.destroyed) {
            console.log('Using existing peer instance.');
            return;  // Use existing peer if it's still active
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
            setupStreamPeerEventHandlers(this);
        } else if (type === 'view') {
            // setupViewPeerEventHandlers(this);
        }
    }
}
