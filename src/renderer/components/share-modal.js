import { cursorSetup } from './globals/cursor';


document.addEventListener('DOMContentLoaded', () => {
    cursorSetup()
    const copyToClipboard = document.getElementById('copyToClipboard');
    const copyToClipboardUrl = document.getElementById('copyToClipboardUrl');

    copyToClipboard.addEventListener('click', () => {
        navigator.clipboard.writeText(copyToClipboard.dataset.shareid);
    })
    copyToClipboardUrl.addEventListener('click', () => {
        navigator.clipboard.writeText(copyToClipboardUrl.dataset.shareurl);
    })
});