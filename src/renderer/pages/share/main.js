import { addLog } from '../../components/log.js';
import { setupEventHandlers } from './eventHandlers.js';

document.addEventListener('DOMContentLoaded', async () => {
    let peerManager;
    await addLog('Requesting screen sources...');
    setupEventHandlers(peerManager);
});
