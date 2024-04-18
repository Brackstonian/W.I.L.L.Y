import { cursorSetup } from './globals/cursor';


document.addEventListener('DOMContentLoaded', () => {
    cursorSetup()
    const copyToClipboard = document.getElementById('copyToClipboard');

    copyToClipboard.addEventListener('click', () => {
        navigator.clipboard.writeText(copyToClipboard.dataset.shareid);
    })
});