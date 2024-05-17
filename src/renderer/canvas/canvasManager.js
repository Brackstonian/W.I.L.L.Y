export default class CanvasManager {
    constructor(sendDataCallback) {
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.paths = [];
        this.IS_DRAWING = false;
        this.sendData = sendDataCallback;
        this.penColor = '#ff0000';  // Default pen color
        this.penWidth = 2;  // Default pen width
        this.userName = '';  // Default user name
    }

    init() {
        console.log('CanvasManager initialized');
        this.resizeCanvas(); // Adjust canvas size.
        window.onresize = this.resizeCanvas.bind(this); // Ensure canvas resizes properly on window resize.

        this.canvas.onmousedown = (e) => {
            this.IS_DRAWING = true;
            const normalizedX = e.offsetX / this.canvas.width;
            const normalizedY = e.offsetY / this.canvas.height;
            const newPath = {
                points: [{ x: e.offsetX, y: e.offsetY + 10 }],
                alpha: 1,
                IS_DRAWING: true,
                color: this.penColor,
                width: this.penWidth,
                name: this.userName,
                lastUpdated: Date.now()
            };
            this.paths.push(newPath);
            this.sendData({ type: 'mousedown', x: normalizedX, y: normalizedY, color: this.penColor, width: this.penWidth, name: this.userName });
        };

        this.canvas.onmousemove = (e) => {
            if (this.IS_DRAWING) {
                const normalizedX = e.offsetX / this.canvas.width;
                const normalizedY = e.offsetY / this.canvas.height;
                let currentPath = this.paths[this.paths.length - 1];
                currentPath.points.push({ x: e.offsetX, y: e.offsetY + 10 });
                currentPath.lastUpdated = Date.now();
                this.sendData({ type: 'mousemove', x: normalizedX, y: normalizedY, color: this.penColor, width: this.penWidth, name: this.userName });
            }
        };

        this.canvas.onmouseup = this.canvas.onmouseout = () => {
            if (this.IS_DRAWING) {
                this.IS_DRAWING = false;
                this.paths[this.paths.length - 1].IS_DRAWING = false;
                this.sendData({ type: 'mouseup', name: this.userName });
            }
        };
    }

    setPenColor(color) {
        this.penColor = color;
    }

    setPenWidth(width) {
        this.penWidth = width;
    }

    setUserName(name) {
        this.userName = name;
    }

    drawPaths() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paths.forEach(path => {
            this.ctx.beginPath();
            this.ctx.moveTo(path.points[0].x, path.points[0].y);
            path.points.forEach(point => this.ctx.lineTo(point.x, point.y));
            this.ctx.strokeStyle = path.color;
            this.ctx.lineWidth = path.width;
            this.ctx.stroke();

            // Draw the user's name near the last point if the current name is provided
            if (path.IS_DRAWING) {
                const lastPoint = path.points[path.points.length - 1];
                this.ctx.font = '12px Arial';
                this.ctx.fillStyle = path.color;
                this.ctx.fillText(path.name, lastPoint.x + 5, lastPoint.y);
            }
        });
        requestAnimationFrame(this.drawPaths.bind(this));
    }

    resizeCanvas() {
        var videoContainer = document.getElementById('localVideo');

        function gcd(a, b) {
            return b ? gcd(b, a % b) : a;
        }

        let divisor = gcd(videoContainer.offsetWidth, videoContainer.offsetHeight);
        let simplifiedWidth = videoContainer.offsetWidth / divisor;
        let simplifiedHeight = videoContainer.offsetHeight / divisor;
        let aspectRatio = simplifiedWidth / simplifiedHeight;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        let canvasWidth = windowWidth;
        let canvasHeight = canvasWidth / aspectRatio;

        if (canvasHeight > windowHeight) {
            canvasHeight = windowHeight;
            canvasWidth = canvasHeight * aspectRatio;
        }

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
    }
}
