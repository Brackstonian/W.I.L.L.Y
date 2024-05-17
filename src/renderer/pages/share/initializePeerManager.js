import getPeerManager from '../../peer/peerManager.js';
import { logPeerId } from './logPeerId.js';
import { addLog } from '../../components/log.js';

export const initializePeerManager = async (stream) => {
    await addLog("Initializing PeerManager with stream.");
    const peerManager = getPeerManager(stream, logPeerId);
    peerManager.initializePeer('stream');
    return peerManager;
};
