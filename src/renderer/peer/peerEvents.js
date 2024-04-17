export function setupStreamPeerEventHandlers(peerManager) {
    const { peer, localStream } = peerManager;
    let { dataConnection } = peerManager;

    peer.on('open', id => {
        console.log('Peer ID:', id);
        const uniqueIdDisplay = document.getElementById('uniqueId');
        uniqueIdDisplay.innerText = `Share this ID  : ${id}`; // Display peer ID
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
            console.log('Received data:', data);
            window.api.send('send-draw-data', data); // Send drawing data.
        });
        dataConnection.on('open', () => {
            console.log('Data connection established with:', conn.peer);
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

    this.peer.on('open', id => {
        console.log('Peer connection established with ID:', id);
    });

    this.peer.on('error', err => {
        closeExistingConnections();
        console.error('Peer error:', err);
    });

    this.peer.on('connection', conn => {
        this.handleDataConnection(conn);
    });
}
