export function setupStreamPeerEventHandlers(peerManager) {
    const { peer, localStream } = peerManager;
    console.log('Setting up stream peer event handlers with localStream:', localStream ? localStream.id : 'undefined');

    peer.on('open', id => {
        console.log(`Peer opened with ID: ${id}`);
        window.api.send('load-modal', id);
    });

    peer.on('error', err => {
        console.error('Peer error:', err);
        peer.destroy(); // Destroy peer on error
        console.log('Peer destroyed due to error');
    });

    peer.on('connection', conn => {
        console.log('Peer connection event triggered');
        peerManager.addDataConnection(conn);
        console.log('Data connection established:', conn);

        conn.on('data', data => {
            console.log('Data received:', data);
            window.api.send('send-draw-data', data); // Send drawing data.
        });

        conn.on('close', () => {
            peerManager.removeDataConnection(conn);
        });

        conn.on('error', err => {
            console.error('Data connection error:', err);
        });
    });

    peer.on('call', call => {
        console.log("Received call, answering with localStream:", localStream ? localStream.id : 'undefined');
        if (localStream) {
            call.answer(localStream);
            call.answered = true;
        } else {
            console.warn('Local stream is not set, cannot answer call');
            call.answered = false;
            peerManager.addCall(call); // Store the call to be answered later
        }
        call.on('stream', (remoteStream) => {
            console.log('Remote stream received');
            // Handle the remote stream (this would be used in the viewer code)
        });
        call.on('close', () => {
            console.log('Call closed');
            peerManager.removeCall(call);
        });
        call.on('error', (err) => {
            console.error('Call error:', err);
        });
    });
}

export function setupViewPeerEventHandlers(peerManager) {
    const { peer } = peerManager;
    console.log('Setting up view peer event handlers');

    peer.on('error', err => {
        console.error('Peer error:', err);
    });

    peer.on('connection', conn => {
        console.log('Viewer peer connection event triggered');
        peerManager.addDataConnection(conn);
        console.log('Data connection established in viewer:', conn);

        conn.on('data', data => {
            console.log('Data received in viewer:', data);
            // Handle data received in viewer
        });

        conn.on('close', () => {
            peerManager.removeDataConnection(conn);
        });

        conn.on('error', err => {
            console.error('Data connection error in viewer:', err);
        });
    });

    peer.on('call', call => {
        call.answer(); // Answer the call with the optional stream if applicable
        peerManager.addCall(call); // Store the call
        call.on('stream', newStream => {
            const videoElement = document.getElementById('videoElementId'); // Ensure this ID is correct
            // Handle the new stream
            if (videoElement) {
                videoElement.srcObject = newStream;
            } else {
                console.error('Video element not found');
            }
        });
        call.on('error', err => {
            console.error('Call error:', err);
        });
    });
}
