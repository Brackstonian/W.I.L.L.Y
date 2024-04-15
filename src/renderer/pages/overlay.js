const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('overlayCanvas');
    const ctx = canvas.getContext('2d');

    let paths = [];
    let fadeTimeout = null
    let IS_DRAWING = false;
    ipcRenderer.on('draw-data', (event, data) => {
        const x = data.x * canvas.width;
        const y = data.y * canvas.height;

        switch (data.type) {
            case 'mousedown':
                clearTimeout(fadeTimeout); // Stop the fading process when drawing starts
                IS_DRAWING = true;
                paths.push({
                    points: [{ x, y }],
                    alpha: 1,
                    IS_DRAWING: true
                });
                break;
            case 'mousemove':
                if (IS_DRAWING && paths.length > 0 && paths[paths.length - 1].IS_DRAWING) {
                    paths[paths.length - 1].points.push({ x, y });
                }
                break;
            case 'mouseup':
                IS_DRAWING = false;
                if (paths.length > 0) {
                    paths[paths.length - 1].IS_DRAWING = false;
                }
                startFading();
                break;
        }
        drawPaths();
    });
    function startFading() {
        fadeTimeout = setTimeout(() => {
            let fadeInterval = setInterval(() => {
                let allFaded = true;
                paths.forEach(path => {
                    if (!path.IS_DRAWING && path.alpha > 0) {
                        path.alpha -= 0.01;
                        allFaded = false;
                    }
                });
                drawPaths(); // Redraw paths with updated alpha
                if (allFaded) clearInterval(fadeInterval);
            }, 50);
        }, 1000);
    };
    function drawPaths() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paths.forEach(path => {
            ctx.beginPath();
            ctx.moveTo(path.points[0].x, path.points[0].y);
            path.points.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.strokeStyle = `rgba(255, 0, 0, ${path.alpha})`; // Use dynamic alpha for visibility
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});