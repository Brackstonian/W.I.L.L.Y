import { addLog } from '../../components/log.js';

export function logPeerId(peerId) {
    addLog(`Peer ID: ${peerId}`, '.app-main-log--ps');
    addLog(`To share this connection, use the following link:`, '.app-main-log--ps');
    addLog(`<a href="https://w-i-l-l-y-web.onrender.com/view/${peerId}" target="_blank">https://w-i-l-l-y-web.onrender.com/view/${peerId}</a>`, '.app-main-log--ps', true);

    document.getElementById('copyToClipboard').addEventListener('click', () => {
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
