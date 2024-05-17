import getPeerManager from '../peer/peerManager.js';
import { addLog } from '../components/log.js';

function logPeerId(peerId) {
    addLog(`Peer ID: ${peerId}`, '.app-main-log--ps');
    addLog(`To share this connection, use the following link:`, '.app-main-log--ps');
    addLog(`<a href="https://w-i-l-l-y-web.onrender.com/view/${peerId}" target="_blank">https://w-i-l-l-y-web.onrender.com/view/${peerId}</a>`, '.app-main-log--ps', true);

    document.querySelector('.log__button').addEventListener('click', () => {
        const fullText = document.querySelector('.app-main-log--ps').innerText;
        const lines = fullText.split('\n');
        let modifiedText = lines.slice(2).join('\n');
        modifiedText = modifiedText.replace(
            'To share this connection, use the following link:',
            'To connect via the web browser version, use this link, or just use the application and connect via the ID:'
        );
        navigator.clipboard.writeText(modifiedText);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    let peerManager;
    await addLog('Requesting screen sources...');
    window.api.invoke('request-screens')
        .then(async (sources) => {
            await addLog('Screen sources received.');
            let selectedListItem;
            const screenPicker = document.getElementById('screen-picker');
            const screenList = document.getElementById('screen-list');
            screenList.innerHTML = '';
            screenPicker.prepend("Select A Screen To Share:");
            sources.forEach((source, index) => {
                const li = document.createElement('li');
                li.classList.add('app__button');
                const img = document.createElement('img');
                img.src = source.thumbnail;
                img.alt = `Screen ${index + 1}`;
                li.textContent = source.name;
                li.appendChild(img);
                li.addEventListener('click', async () => {
                    if (selectedListItem) {
                        selectedListItem.classList.remove('selected');
                        const previousVideo = selectedListItem.querySelector('video');
                        if (previousVideo) {
                            previousVideo.remove();
                        }
                    }
                    li.classList.add('selected');
                    selectedListItem = li;

                    await addLog(`Selected screen: ${source.name}`);
                    window.api.invoke('select-screen', index)
                        .then(async (sourceId) => {
                            await addLog(`Screen ${source.name} selected. Source ID: ${sourceId}`);
                            navigator.mediaDevices.getUserMedia({
                                video: {
                                    mandatory: {
                                        chromeMediaSource: 'desktop',
                                        chromeMediaSourceId: sourceId
                                    }
                                }
                            }).then(async (stream) => {
                                if (!peerManager) {
                                    await addLog("Initializing PeerManager with stream.");
                                    peerManager = getPeerManager(stream, logPeerId);
                                    peerManager.initializePeer('stream');
                                } else {
                                    await addLog("Updating stream in PeerManager.");
                                    peerManager.updateStream(stream);
                                }

                                // Display the stream in a video element
                                const videoElement = document.createElement('video');
                                videoElement.srcObject = stream;
                                videoElement.autoplay = true;
                                videoElement.style.width = '100%';
                                videoElement.style.height = '100%';

                                // Ensure button text remains and append video
                                li.innerHTML = `${source.name}`;
                                li.appendChild(videoElement);
                            }).catch(async (err) => {
                                console.error('Failed to get screen stream', err);
                                await addLog('Failed to get screen stream: ' + err.message);
                                alert('Unable to capture the screen. Please check console for more details.');
                            });
                        })
                        .catch(async (error) => {
                            console.error('Error invoking load-view-page:', error);
                            await addLog('Error invoking load-view-page: ' + error.message);
                        });
                });
                screenList.appendChild(li);
            });
        })
        .catch(async (error) => {
            console.error('Error invoking request-screens:', error);
            await addLog('Error invoking request-screens: ' + error.message);
        });
});
