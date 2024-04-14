const CanvasManager = {
    fadeTimeout: null, // Store fade timeout to manage fading effect.

    init() {

        canvas = document.getElementById('drawingCanvas');
        ctx = canvas.getContext('2d');
        this.resizeCanvas(); // Adjust canvas size.
        this.drawPaths(); // Start the drawing process.
        window.onresize = this.resizeCanvas.bind(this); // Ensure canvas resizes properly on window resize.

        // Set up mouse event handlers for drawing on the canvas.
        canvas.onmousedown = (e) => {
            clearTimeout(this.fadeTimeout); // Clear fading timeout on new interaction.
            IS_DRAWING = true; // Set drawing flag.
            const normalizedX = e.offsetX / canvas.width;
            const normalizedY = e.offsetY / canvas.height;
            const newPath = {
                points: [{ x: e.offsetX, y: e.offsetY }],
                alpha: 1,
                IS_DRAWING: true
            };
            paths.push(newPath); // Add new path to paths array.
            sendData({ type: 'mousedown', x: normalizedX, y: normalizedY }); // Send data for new path start.
        };

        canvas.onmousemove = (e) => {
            if (IS_DRAWING) {
                const normalizedX = e.offsetX / canvas.width;
                const normalizedY = e.offsetY / canvas.height;
                let currentPath = paths[paths.length - 1];
                currentPath.points.push({ x: e.offsetX, y: e.offsetY }); // Append new point to current path.
                sendData({ type: 'mousemove', x: normalizedX, y: normalizedY }); // Send data for movement.
            }
        };

        // End drawing on mouse up or mouse out.
        canvas.onmouseup = canvas.onmouseout = () => {
            if (IS_DRAWING) {
                IS_DRAWING = false;
                paths[paths.length - 1].IS_DRAWING = false;
                sendData({ type: 'mouseup' });
                this.startFading(); // Start fading the drawing after interaction stops.
            }
        };
    },

    drawPaths() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas.
        paths.forEach(path => {
            ctx.beginPath();
            ctx.moveTo(path.points[0].x, path.points[0].y);
            path.points.forEach(point => ctx.lineTo(point.x, point.y)); // Draw each path.
            ctx.strokeStyle = `rgba(255, 0, 0, ${path.alpha})`; // Set line color with alpha for fading effect.
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        requestAnimationFrame(this.drawPaths.bind(this)); // Continue animation.
    },

    resizeCanvas() {
        canvas.width = canvas.offsetWidth; // Adjust canvas width to element's width.
        canvas.height = canvas.offsetHeight; // Adjust canvas height to element's height.
    },

    startFading() {
        // Start a timeout to fade lines after drawing is completed.
        this.fadeTimeout = setTimeout(() => {
            let fadeInterval = setInterval(() => {
                let allFaded = true;
                paths.forEach(path => {
                    if (!path.IS_DRAWING && path.alpha > 0) {
                        path.alpha -= 0.01; // Gradually reduce alpha to create fading effect.
                        allFaded = false;
                    }
                });
                this.drawPaths(); // Redraw paths with updated alpha.
                if (allFaded) clearInterval(fadeInterval); // Stop interval when all paths have faded.
            }, 50);
        }, 1000);
    },
};

module.exports = {
    CanvasManager
}