import { handleConnection } from './handleConnection.js';
import { addLog } from '../../components/log.js';

export const setupEventHandlers = (viewButton, penColorInput, penWidthInput, penContainer, penBody, sliderContainer) => {
    viewButton.addEventListener('click', async () => {
        const peerId = document.getElementById('inputField').value;
        const userName = document.getElementById('nameField').value;
        if (!peerId) {
            await addLog('Please enter a Peer ID.');
            return;
        }
        if (!userName) {
            await addLog('Please enter your name.');
            return;
        }
        await handleConnection(peerId, userName, penColorInput, penWidthInput, penBody);
    });

    penContainer.addEventListener('click', () => {
        sliderContainer.style.display = sliderContainer.style.display === 'none' ? 'flex' : 'none';
    });

    // Set initial pen width and color
    penBody.style.backgroundColor = penColorInput.value;
    penBody.style.height = `${penWidthInput.value}px`;
};
