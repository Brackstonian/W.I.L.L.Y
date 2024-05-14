export function setupStreamPeerEventHandlers(peerManager) {
    const { peer, localStream } = peerManager;
    console.log('Setting up stream peer event handlers with localStream:', localStream ? localStream.id : 'undefined');
    let { dataConnection } = peerManager;

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
        if (dataConnection) {
            console.log('Existing dataConnection found, closing it...');
            dataConnection.close();  // Close existing connection if open
        }
        dataConnection = conn;
        console.log('Data connection established:', dataConnection);
        dataConnection.on('data', data => {
            console.log('Data received:', data);
            window.api.send('send-draw-data', data); // Send drawing data.
        });
    });

    peer.on('call', call => {
        console.log("Received call, answering with localStream:", localStream ? localStream.id : 'undefined');
        call.answer(localStream);
        call.on('error', err => {
            console.error('Call error:', err);
        });
    });
}

export function setupViewPeerEventHandlers(peerManager) {
    const { peer } = peerManager;
    let { dataConnection } = peerManager;
    console.log('Setting up view peer event handlers');

    peer.on('error', err => {
        console.error('Peer error:', err);
    });

    peer.on('connection', conn => {
        console.log('Viewer peer connection event triggered');
        if (dataConnection) {
            console.log('Existing dataConnection found in viewer, closing it...');
            dataConnection.close();  // Close existing connection if open
        }
        dataConnection = conn;
        console.log('Data connection established in viewer:', dataConnection);
        dataConnection.on('error', err => {
            console.error('Data connection error:', err);
        });
    });

    peer.on('call', call => {
        call.answer(); // Answer the call with the optional stream if applicable
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
