import { addLog } from '../../components/log.js';
import { initializeScreenShare } from './initializeScreenShare.js';

export const setupEventHandlers = (peerManager) => {
    window.api.invoke('request-screens')
        .then(async (sources) => {
            await initializeScreenShare(peerManager, sources);
        })
        .catch(async (error) => {
            console.error('Error invoking request-screens:', error);
            await addLog('Error invoking request-screens: ' + error.message);
        });
};
