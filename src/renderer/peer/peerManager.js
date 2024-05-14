import Peer from 'peerjs';
import { setupStreamPeerEventHandlers, setupViewPeerEventHandlers } from './peerEvents';

let peerManagerInstance = null;

class PeerManager {
    constructor(localStream = null) {
        this.peer = null;
        this.localStream = localStream;
        this.dataConnections = [];  // Store multiple data connections
        this.calls = [];  // Store active calls
        console.log('PeerManager constructed with localStream:', localStream ? localStream.id : 'undefined');
    }

    setLocalStream(localStream) {
        this.localStream = localStream;
        console.log('Local stream set:', localStream ? localStream.id : 'undefined');
        // Answer any pending calls that arrived before the localStream was set
        this.calls.forEach(call => {
            if (!call.answered) {
                call.answer(localStream);
                call.answered = true;
            }
        });
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
                    { urls: 'stun:stun2.l.google.com:19302' },
                    { urls: 'stun:stun3.l.google.com:19302' },
                    { urls: 'stun:stun4.l.google.com:19302' }
                    // You can add more TURN servers here if needed
                ]
            }
        });

        this.peer.on('call', (call) => {
            if (this.localStream) {
                console.log('Incoming call, answering with localStream:', this.localStream.id);
                call.answer(this.localStream);
                call.answered = true;
            } else {
                console.warn('Local stream is not set, cannot answer call');
                call.answered = false;
                // Store the call to be answered later when localStream is set
                this.calls.push(call);
            }
            call.on('stream', (remoteStream) => {
                console.log('Remote stream received');
                // Handle the remote stream (this would be used in the viewer code)
            });
            call.on('close', () => {
                console.log('Call closed');
                this.removeCall(call);
            });
            call.on('error', (err) => {
                console.error('Call error:', err);
            });
            this.addCall(call);
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

    addDataConnection(conn) {
        this.dataConnections.push(conn);
    }

    removeDataConnection(conn) {
        this.dataConnections = this.dataConnections.filter(c => c !== conn);
    }
}

export default function getPeerManager(localStream = null) {
    if (!peerManagerInstance) {
        peerManagerInstance = new PeerManager(localStream);
    } else if (localStream) {
        peerManagerInstance.setLocalStream(localStream);
    }
    return peerManagerInstance;
}
