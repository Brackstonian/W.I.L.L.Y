document.addEventListener('DOMContentLoaded', () => {
    const viewScreenButton = document.getElementById('viewScreenButton');
    const shareScreenButton = document.getElementById('shareScreenButton');

    window.api.send('close-overlay-page');


    viewScreenButton.addEventListener('click', async () => {
        window.api.invoke('load-view-page')
            .then(response => {
                window.location.href = response;
            })
            .catch(error => {
                console.error('Error invoking load-view-page:', error);
            });
    });

    shareScreenButton.addEventListener('click', () => {
        window.api.invoke('load-share-page')
            .then(response => {
                window.location.href = response;
            })
            .catch(error => {
                console.error('Error invoking load-view-page:', error);
            });
    });
});