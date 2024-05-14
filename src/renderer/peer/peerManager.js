import Peer from 'peerjs';
import { setupStreamPeerEventHandlers, setupViewPeerEventHandlers } from './peerEvents';

export default class PeerManager {
    constructor(localStream) {
        this.peer = null;
        this.localStream = localStream;
        this.dataConnection = null;
        this.calls = [];  // Store active calls
        console.log('PeerManager constructed with localStream:', localStream ? localStream.id : 'undefined');
    }

    initializePeer(type) {
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

        this.peer.on('call', (call) => {
            call.answer(this.localStream);
            call.on('stream', (remoteStream) => {
                // Handle the remote stream
            });
            this.calls.push(call);  // Store the call
        });

        if (type === 'stream') {
            setupStreamPeerEventHandlers(this);
        } else if (type === 'view') {
            setupViewPeerEventHandlers(this);
        }
    }

    updateStream(newStream) {
        this.localStream = newStream;
        this.calls.forEach(call => {
            const videoTrack = newStream.getVideoTracks()[0];
            const sender = call.peerConnection.getSenders().find(s => s.track.kind === 'video');
            if (sender) {
                sender.replaceTrack(videoTrack).then(() => {
                    console.log('Track replaced successfully');
                }).catch(err => {
                    console.error('Error replacing track:', err);
                });
            }
        });
    }

    addCall(call) {
        this.calls.push(call);
    }

    removeCall(call) {
        this.calls = this.calls.filter(c => c !== call);
    }
}
