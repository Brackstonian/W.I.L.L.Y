import Peer from 'peerjs';
import { setupStreamPeerEventHandlers, setupViewPeerEventHandlers } from './peerEvents';

export default class PeerManager {
    constructor(localStream) {
        this.peer = null;
        this.localStream = localStream;
        this.dataConnection = null;
        console.log('PeerManager constructed with localStream:', localStream ? localStream.id : 'undefined');
    }

    initializePeer(type) {
        console.log(`Initializing peer of type ${type} with localStream:`, this.localStream ? this.localStream.id : 'undefined');
        if (this.peer && !this.peer.destroyed) {
            console.log('Peer already exists and is not destroyed, initialization skipped');
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
        console.log('Peer initialized:', this.peer);
    }
}
