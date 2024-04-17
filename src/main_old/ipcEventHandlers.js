// Centralized navigation and other IPC handlers
function setupGlobalIpcListeners() {
    // window.api.receive('navigate-to', (url) => {
    //     console.log('Global navigation to:', url);
    //     window.location.href = url;
    // });

    // window.api.receive('peer-data', (data) => {
    //     console.log('Data received from PeerManager:', data);
    //     // You can now use this data in your renderer context
    // });

    // Add other global IPC event handlers here
}

module.exports = { setupGlobalIpcListeners };
