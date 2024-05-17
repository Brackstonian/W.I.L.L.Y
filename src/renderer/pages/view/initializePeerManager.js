import getPeerManager from '../../peer/peerManager.js';
import { addLog } from '../../components/log.js';

export const initializePeerManager = async () => {
    const peerManager = getPeerManager();
    peerManager.initializePeer('view');

    peerManager.peer.on('disconnected', async () => {
        await addLog('Disconnected. Please retry.');
    });

    peerManager.peer.on('close', async () => {
        await addLog('Connection closed. Please retry.');
    });

    peerManager.peer.on('error', async (err) => {
        console.error('Peer error:', err);
        await addLog('Connection error. Please retry.');
    });

    return peerManager;
};
