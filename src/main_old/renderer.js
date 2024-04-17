const { createOverlayWindow, getMainWindow, getOverlayWindow } = require('../main/windowManager');

function setupGlobalRenderers() {
    window.api.on('load-player', (event) => {
        var containerDiv = document.getElementById("videoContainer");
        containerDiv.style.display = "block";
    });

    window.api.on('show-picker', (sources) => {
        console.log('show-picker');
        let selectedListItem;  // Variable to keep track of the currently selected screen
        const screenList = document.getElementById('screen-list');
        screenList.innerHTML = '';
        sources.forEach((source, index) => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = source.thumbnail;
            img.alt = `Screen ${index + 1}`;
            img.style.width = '100px';  // Set thumbnail size
            img.style.height = '75px';
            li.textContent = `Screen ${index + 1}: ${source.name}`;
            li.appendChild(img);
            li.addEventListener('click', () => {
                if (selectedListItem) {
                    selectedListItem.style.border = "";  // Remove border from previously selected item
                }
                window.api.send('select-screen', index);
                li.style.border = "solid 5px red";
                selectedListItem = li;  // Update the selected item
            });
            screenList.appendChild(li);
        });
    });

    window.api.on('screen-selected', (sourceId) => {
        navigator.mediaDevices.getUserMedia({
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId
                }
            }
        }).then(stream => {
            localStream = stream;

            const mainWindow = getMainWindow();

            const peerManager = new PeerManager(localStream, mainWindow.webContents);

            localVideo.srcObject = stream;
            peerManager.initializePeer('stream');
            console.log('Screen stream has been initialized and peer connection set up.');
        }).catch(err => {
            console.error('Failed to get screen stream', err);
            alert('Unable to capture the screen. Please check console for more details.');
        });
    });

    window.api.on('display-unique-id', (sourceId) => {
        const uniqueIdDisplay = document.getElementById('uniqueId');
        uniqueIdDisplay.innerText = `Share this ID  : ${sourceId}`; // Display peer ID
    });
}

module.exports = { setupGlobalRenderers };
