export function setupStreamPeerEventHandlers(peerManager) {
    const { peer, localStream } = peerManager;
    let { dataConnection } = peerManager;

    peer.on('open', id => {
        // navigator.clipboard.writeText(id);
        window.api.send('load-modal', id);
    });

    peer.on('error', err => {
        console.error('Peer error:', err);
        peer.destroy(); // Destroy peer on error
    });

    peer.on('connection', conn => {
        if (dataConnection) {
            dataConnection.close();  // Close existing connection if open
        }
        dataConnection = conn;
        dataConnection.on('data', data => {
            window.api.send('send-draw-data', data); // Send drawing data.
        });
    });

    peer.on('call', call => {
        call.answer(localStream);
        call.on('error', err => {
            console.error('Call error:', err);
        });
    });
}

export function setupViewPeerEventHandlers(peerManager) {
    const { peer } = peerManager;
    let { dataConnection } = peerManager;

    peer.on('error', err => {
        closeExistingConnections();
        console.error('Peer error:', err);
    });

    peer.on('connection', conn => {
        if (dataConnection) {
            dataConnection.close();  // Close existing connection if open
        }
        dataConnection = conn;
        dataConnection.on('error', err => {
            console.error('Data connection error:', err);
        });
    });
}