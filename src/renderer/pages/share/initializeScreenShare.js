import { addLog } from '../../components/log.js';
import { initializePeerManager } from './initializePeerManager.js';

export const initializeScreenShare = async (peerManager, sources) => {
    await addLog('Screen sources received.');
    let selectedListItem;
    const screenPicker = document.querySelector('.app-main-screen-picker');
    const screenList = document.querySelector('.app-main-screen-picker__screen-list');
    screenList.innerHTML = '';
    screenPicker.prepend("Select A Screen To Share:");
    sources.forEach((source, index) => {
        const li = document.createElement('li');
        li.classList.add('app-main-button__button');
        li.classList.add('app-main-button__button--primary');
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
                            peerManager = await initializePeerManager(stream);
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
};
