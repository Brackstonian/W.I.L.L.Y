// Centralized navigation and other IPC handlers
function setupGlobalIpcListeners() {
    window.api.receive('navigate-to', (url) => {
        console.log('Global navigation to:', url);
        window.location.href = url;
    });

    // Add other global IPC event handlers here
}

module.exports = { setupGlobalIpcListeners };
