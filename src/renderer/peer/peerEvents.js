// Function to update the status message and show the retry button
function updateStatus(message, showRetry) {
    const statusMessage = document.getElementById('statusMessage');
    const retryButton = document.getElementById('retryButton');

    statusMessage.textContent = message;
    retryButton.style.display = showRetry ? 'block' : 'none';
    console.log('Status updated:', message);
}

export function setupStreamPeerEventHandlers(peerManager, onPeerOpen) {
    const { peer, localStream } = peerManager;
    console.log('Setting up stream peer event handlers with localStream:', localStream ? localStream.id : 'undefined');

    peer.on('open', id => {
        console.log(`Peer opened with ID: ${id}`);
        if (onPeerOpen) {
            onPeerOpen(id); // Call the callback function with the Peer ID
        }
    });

    peer.on('error', err => {
        console.error('Peer error:', err);
        updateStatus('Connection failed. Please retry.', true); // Update the status message and show retry button
        peer.destroy(); // Destroy peer on error
        console.log('Peer destroyed due to error');
        // Retry logic
        setTimeout(() => {
            console.log('Retrying peer connection...');
            peerManager.initializePeer('stream');
        }, 5000); // Retry after 5 seconds
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
            console.log('Data connection closed');
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
            updateStatus('Call error occurred. Please retry.', true); // Update the status message and show retry button
        });
    });

    // Adding timeout to check peer connection
    setTimeout(() => {
        if (!peer.open) {
            console.error('Peer connection timeout');
            updateStatus('Connection timed out. Please retry.', true);
            peer.destroy();
        }
    }, 10000); // 10 seconds timeout
}

export function setupViewPeerEventHandlers(peerManager, onPeerOpen) {
    const { peer } = peerManager;
    console.log('Setting up view peer event handlers');

    peer.on('open', id => {
        console.log(`Viewer peer opened with ID: ${id}`);
        if (onPeerOpen) {
            onPeerOpen(id); // Call the callback function with the Peer ID
        }
    });

    peer.on('error', err => {
        console.error('Peer error:', err);
        updateStatus('Connection failed. Please retry.', true); // Update the status message and show retry button
        // Retry logic
        setTimeout(() => {
            console.log('Retrying peer connection...');
            peerManager.initializePeer('view');
        }, 5000); // Retry after 5 seconds
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
            console.log('Data connection closed in viewer');
            peerManager.removeDataConnection(conn);
        });

        conn.on('error', err => {
            console.error('Data connection error in viewer:', err);
        });
    });

    peer.on('call', call => {
        console.log('Viewer received a call');
        call.answer(); // Answer the call with the optional stream if applicable
        peerManager.addCall(call); // Store the call
        call.on('stream', newStream => {
            console.log('New stream received in viewer');
            const videoElement = document.getElementById('videoElementId'); // Ensure this ID is correct
            // Handle the new stream
            if (videoElement) {
                videoElement.srcObject = newStream;
                console.log('Video element found and stream set');
            } else {
                console.error('Video element not found');
            }
        });
        call.on('close', () => {
            console.log('Viewer call closed');
            peerManager.removeCall(call);
        });
        call.on('error', err => {
            console.error('Call error in viewer:', err);
            updateStatus('Call error occurred. Please retry.', true); // Update the status message and show retry button
        });
    });

    // Adding timeout to check peer connection
    setTimeout(() => {
        if (!peer.open) {
            console.error('Peer connection timeout');
            updateStatus('Connection timed out. Please retry.', true);
            peer.destroy();
        }
    }, 10000); // 10 seconds timeout
}
