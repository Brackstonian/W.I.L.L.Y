const { setupGlobalIpcListeners } = require('../../main/ipcEventHandlers');

document.addEventListener('DOMContentLoaded', () => {
    const viewScreenButton = document.getElementById('viewScreenButton');
    const shareScreenButton = document.getElementById('shareScreenButton');

    window.api.send('close-overlay-window');
    window.api.send('open-view-page-default');

    viewScreenButton.addEventListener('click', () => {
        console.log('view button clicked');
        window.api.send('load-view-page');
    });

    shareScreenButton.addEventListener('click', () => {
        console.log('share button clicked');
        window.api.send('load-share-page');
    });

    setupGlobalIpcListeners();
});