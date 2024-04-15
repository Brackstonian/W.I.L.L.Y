const { ipcRenderer } = require('electron');
const PeerManager = require('./peerManager.js');

class CanvasManager {
    constructor(sendDataCallback) {
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fadeTimeout = null;
        this.paths = [];
        this.IS_DRAWING = false;
        this.sendData = sendDataCallback;  // Store the callback for later use
    }

    init() {
        this.resizeCanvas(); // Adjust canvas size.
        this.drawPaths(); // Start the drawing process.
        window.onresize = this.resizeCanvas.bind(this); // Ensure canvas resizes properly on window resize.

        // Set up mouse event handlers for drawing on the canvas.
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.canvas.onmousedown = (e) => {
            clearTimeout(this.fadeTimeout);
            this.IS_DRAWING = true;
            const normalizedX = e.offsetX / this.canvas.width;
            const normalizedY = e.offsetY / this.canvas.height;
            const newPath = { points: [{ x: e.offsetX, y: e.offsetY }], alpha: 1, IS_DRAWING: true };
            this.paths.push(newPath);
            this.sendData({ type: 'mousedown', x: normalizedX, y: normalizedY });
        };

        this.canvas.onmousemove = (e) => {
            if (this.IS_DRAWING) {
                const normalizedX = e.offsetX / this.canvas.width;
                const normalizedY = e.offsetY / this.canvas.height;
                let currentPath = this.paths[this.paths.length - 1];
                currentPath.points.push({ x: e.offsetX, y: e.offsetY });
                this.sendData({ type: 'mousemove', x: normalizedX, y: normalizedY });
            }
        };

        this.canvas.onmouseup = this.canvas.onmouseout = () => {
            if (this.IS_DRAWING) {
                this.IS_DRAWING = false;
                this.paths[this.paths.length - 1].this.IS_DRAWING = false;
                this.sendData({ type: 'mouseup' });
                this.startFading();
            }
        };
    }

    drawPaths() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paths.forEach(path => {
            this.ctx.beginPath();
            this.ctx.moveTo(path.points[0].x, path.points[0].y);
            path.points.forEach(point => this.ctx.lineTo(point.x, point.y));
            this.ctx.strokeStyle = `rgba(255, 0, 0, ${path.alpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
        requestAnimationFrame(this.drawPaths.bind(this));
    }

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    startFading() {
        this.fadeTimeout = setTimeout(() => {
            let fadeInterval = setInterval(() => {
                let allFaded = true;
                this.paths.forEach(path => {
                    if (path.alpha > 0) {
                        path.alpha -= 0.01;
                        allFaded = false;
                    }
                });
                this.drawPaths();
                if (allFaded) clearInterval(fadeInterval);
            }, 50);
        }, 1000);
    }

    sendData(data) {
        console.log('sending data');
        if (peerManager.dataConnection && peerManager.dataConnection.open) {
            console.log('Sending data:', data);
            peerManager.dataConnection.send(data);
        } else {
            console.log('Data connection not ready or open.');
        }
    }

    simulateDrawing(data) {
        // Function to simulate drawing on the canvas based on received data.
        const x = data.x * canvas.width; // Calculate x coordinate.
        const y = data.y * canvas.height; // Calculate y coordinate.
        switch (data.type) {
            case 'mousedown':
                IS_DRAWING = true; // Start drawing.
                paths.push({
                    points: [{ x, y }],
                    alpha: 1,
                    IS_DRAWING: true
                });
                break;
            case 'mousemove':
                if (IS_DRAWING && paths.length > 0 && paths[paths.length - 1].IS_DRAWING) {
                    paths[paths.length - 1].points.push({ x, y }); // Add points to path.
                }
                break;
            case 'mouseup':
                if (paths.length > 0) {
                    paths[paths.length - 1].IS_DRAWING = false; // Stop drawing.
                }
                IS_DRAWING = false;
                this.startFading(); // Start fading drawing.
                break;
        }
        this.drawPaths(); // Redraw paths.
    }
}

module.exports = CanvasManager;
