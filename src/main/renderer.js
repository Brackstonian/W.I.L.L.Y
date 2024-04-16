function setupGlobalRenderers() {
    window.api.on('load-player', (event) => {
        var containerDiv = document.getElementById("videoContainer");
        containerDiv.style.display = "block";
    });

    window.api.on('show-picker', (sources) => {
        const screenList = document.getElementById('screen-list');
        screenList.innerHTML = '';
        sources.forEach((source, index) => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = source.thumbnail;
            img.alt = `Screen ${index + 1}`;
            img.style.width = '100px';  // Set thumbnail size
            img.style.height = '75px';
            li.textContent = `Screen ${index + 1}: ${source.name}`;
            li.appendChild(img);
            li.addEventListener('click', () => {
                if (selectedListItem) {
                    selectedListItem.style.border = "";  // Remove border from previously selected item
                }
                window.api.send('select-screen', index);
                li.style.border = "solid 5px red";
                selectedListItem = li;  // Update the selected item
            });
            screenList.appendChild(li);
        });
    });
}

module.exports = { setupGlobalRenderers };
