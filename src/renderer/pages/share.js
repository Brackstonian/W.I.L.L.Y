
import PeerManager from '../peer/peerManager.js';

document.addEventListener('DOMContentLoaded', () => {
    let localStream;

    // window.api.send('view-page-maximized');

    window.api.invoke('request-screens')
        .then(sources => {
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
                    li.style.border = "solid 5px red";
                    selectedListItem = li;  // Update the selected item
                    console.log('Sending index:', index, typeof index);

                    window.api.invoke('select-screen', index)
                        .then(sourceId => {
                            console.log('Source ID' + sourceId);
                            navigator.mediaDevices.getUserMedia({
                                video: {
                                    mandatory: {
                                        chromeMediaSource: 'desktop',
                                        chromeMediaSourceId: sourceId
                                    }
                                }
                            }).then(stream => {
                                // const mainWindow = getMainWindow();  

                                localStream = stream;
                                // videoElement.srcObject = stream;
                                // localVideo.srcObject = stream;
                                const peerManager = new PeerManager(localStream);
                                return peerManager.initializePeer('stream');
                            }).catch(err => {
                                console.error('Failed to get screen stream', err);
                                alert('Unable to capture the screen. Please check console for more details.');
                            });
                        })
                        .catch(error => {
                            console.error('Error invoking load-view-page:', error);
                        });
                });
                screenList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error invoking request-screens:', error);
        });
});
