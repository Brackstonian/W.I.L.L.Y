export default class CanvasManager {
    constructor() {
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fadeTimeout = null;
        this.paths = [];
        this.IS_DRAWING = false;
    }

    init() {
        console.log('this triggered');
        this.resizeCanvas(); // Adjust canvas size.
        this.drawPaths(); // Start the drawing process.
        window.onresize = this.resizeCanvas.bind(this); // Ensure canvas resizes properly on window resize.

        this.canvas.onmousedown = (e) => {
            console.log('one mouse own');
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
                this.paths[this.paths.length - 1].IS_DRAWING = false;
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
}