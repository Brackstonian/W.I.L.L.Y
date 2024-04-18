

document.addEventListener('DOMContentLoaded', () => {
    const copyToClipboard = document.getElementById('copyToClipboard');

    copyToClipboard.addEventListener('click', () => {
        navigator.clipboard.writeText(copyToClipboard.dataset.shareid);
    })
});