const { ipcRenderer } = require('electron');

function shareButtonListener(shareButton) {
    shareButton.addEventListener('click', () => {
        console.log('Share button clicked');
        ipcRenderer.send('request-screens');
    });
}
module.exports = { shareButtonListener };
