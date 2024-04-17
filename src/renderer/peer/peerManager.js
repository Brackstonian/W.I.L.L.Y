import Peer from 'peerjs';
import { setupStreamPeerEventHandlers, setupViewPeerEventHandlers } from './peerEvents';

export default class PeerManager {
    constructor(localStream) {
        this.peer = null;
        this.localStream = localStream;
        this.dataConnection = null;
    }
    initializePeer(type) {
        if (this.peer && !this.peer.destroyed) {
            return;
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
            setupViewPeerEventHandlers(this);
        }
    }
}
