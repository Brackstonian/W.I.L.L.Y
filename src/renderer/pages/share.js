import PeerManager from '../peer/peerManager.js';
import { cursorSetup } from '../components/globals/cursor';

document.addEventListener('DOMContentLoaded', () => {
    cursorSetup();
    let peerManager; // Make peerManager persistent

    window.api.invoke('request-screens')
        .then(sources => {
            let selectedListItem;  // Variable to keep track of the currently selected screen
            const screenList = document.getElementById('screen-list');
            screenList.innerHTML = '';
            sources.forEach((source, index) => {
                const li = document.createElement('li');
                li.classList.add('app__button');
                const img = document.createElement('img');
                console.log(source);
                img.src = source.thumbnail;
                img.alt = `Screen ${index + 1}`;
                li.textContent = source.name;
                li.appendChild(img);
                li.addEventListener('click', () => {
                    if (selectedListItem) {
                        selectedListItem.style.border = "";  // Remove border from previously selected item
                    }
                    li.style.background = "var(--c-black)";
                    li.style.color = "var(--c-white)";
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
                                if (!peerManager) {
                                    peerManager = new PeerManager(stream);
                                    console.log("Initializing PeerManager with stream");
                                    peerManager.initializePeer('stream');
                                } else {
                                    console.log("Updating stream in PeerManager");
                                    peerManager.updateStream(stream);
                                }
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
