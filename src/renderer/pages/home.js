document.addEventListener('DOMContentLoaded', () => {
    // These use the `api` object from the preload script
    window.api.send('close-overlay-window');
    window.api.send('open-view-page-default');

    document.getElementById('viewScreenButton').addEventListener('click', () => {
        console.log('view button clicked');
        window.api.send('load-view-page');
    });

    document.getElementById('shareScreenButton').addEventListener('click', () => {
        console.log('share button clicked');
        window.api.send('load-share-page');
    });

    window.api.receive('navigate-to', (url) => {
        window.location.href = url; // or dynamically load content
    });
});