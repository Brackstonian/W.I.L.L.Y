document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            window.api.send('open-external-link', link.href);
        });
    });
});