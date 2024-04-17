export default class DrawingSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.paths = [];
        this.fadeTimeout = null;
        this.isDrawing = false;
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }


    simulate(data) {
        const x = data.x * this.canvas.width;
        const y = data.y * this.canvas.height;

        switch (data.type) {
            case 'mousedown':
                clearTimeout(this.fadeTimeout);
                this.isDrawing = true;
                this.paths.push({
                    points: [{ x, y }],
                    alpha: 1,
                    isDrawing: true
                });
                break;
            case 'mousemove':
                if (this.isDrawing && this.paths.length > 0 && this.paths[this.paths.length - 1].isDrawing) {
                    this.paths[this.paths.length - 1].points.push({ x, y });
                }
                break;
            case 'mouseup':
                this.isDrawing = false;
                if (this.paths.length > 0) {
                    this.paths[this.paths.length - 1].isDrawing = false;
                }
                this.startFading();
                break;
        }
        this.drawPaths();
    }

    startFading() {
        this.fadeTimeout = setTimeout(() => {
            let fadeInterval = setInterval(() => {
                let allFaded = true;
                this.paths.forEach(path => {
                    if (!path.isDrawing && path.alpha > 0) {
                        path.alpha -= 0.01;
                        allFaded = false;
                    }
                });
                this.drawPaths(); // Redraw paths with updated alpha
                if (allFaded) clearInterval(fadeInterval);
            }, 50);
        }, 1000);
    }

    drawPaths() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paths.forEach(path => {
            this.ctx.beginPath();
            this.ctx.moveTo(path.points[0].x, path.points[0].y);
            path.points.forEach(point => {
                this.ctx.lineTo(point.x, point.y);
            });
            this.ctx.strokeStyle = `rgba(255, 0, 0, ${path.alpha})`;
            this.ctx.lineWidth = 4;
            this.ctx.globalAlpha = 0.75;
            this.ctx.stroke();
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}