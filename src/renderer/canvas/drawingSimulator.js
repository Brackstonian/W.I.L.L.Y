export default class DrawingSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.paths = [];
        this.isDrawing = false;
        this.isDrawingActive = false;  // Flag to track if drawing is active
        this.currentName = null;  // Keep track of the current drawing name
        this.nameTimeout = null;  // Timeout for name fading
        this.fadeTimeout = null;  // Timeout for line fading
        this.inactivityTimeout = null;  // Timeout for inactivity
        this.activePathIndex = null;  // Index of the active drawing path
        this.lastActivityTime = Date.now();  // Track the last activity time
        this.inactivityDuration = 6000;  // Inactivity duration in milliseconds

        this.resizeCanvas();  // Ensure the canvas is correctly sized
        this.startInactivityCheck();  // Start checking for inactivity

        window.addEventListener('resize', () => this.resizeCanvas());  // Ensure canvas resizes properly on window resize
        window.addEventListener('DOMContentLoaded', () => this.resizeCanvas());  // Ensure canvas is correctly sized when the document is loaded
    }

    simulate(data) {
        const x = data.x * this.canvas.width;
        const y = (data.y * this.canvas.height) - 25;

        this.lastActivityTime = Date.now();  // Update the last activity time

        switch (data.type) {
            case 'mousedown':
                clearTimeout(this.nameTimeout);  // Clear any existing name timeout
                this.isDrawing = true;
                this.isDrawingActive = true;  // Set drawing active flag
                this.currentName = data.name;  // Set the current drawing name
                this.paths.push({
                    points: [{ x, y }],
                    isDrawing: true,
                    color: data.color || '#ff0000',  // Default to red if color is not provided
                    width: data.width || 2,  // Default to 2 if width is not provided
                    name: data.name || '',  // Default to empty string if name is not provided
                    lastUpdated: Date.now(),  // Track the last update time
                    alpha: 1  // Initial alpha value for fade-out effect
                });
                this.activePathIndex = this.paths.length - 1;  // Set the current path as active
                break;
            case 'mousemove':
                if (this.isDrawing && this.activePathIndex !== null) {
                    this.paths[this.activePathIndex].points.push({ x, y });
                    this.paths[this.activePathIndex].lastUpdated = Date.now();  // Update the last update time
                }
                break;
            case 'mouseup':
                this.isDrawing = false;
                this.isDrawingActive = false;  // Reset drawing active flag
                if (this.activePathIndex !== null) {
                    this.paths[this.activePathIndex].isDrawing = false;
                }
                this.nameTimeout = setTimeout(() => {
                    this.currentName = null;  // Clear the current drawing name after 3 seconds
                    this.drawPaths();
                }, 3000);
                this.startFadeTimeout();  // Start the fade timeout after the mouse is released
                break;
        }
        this.drawPaths();
    }

    startFadeTimeout() {
        clearTimeout(this.fadeTimeout);  // Clear any existing fade timeout
        this.fadeTimeout = setTimeout(() => {
            if (!this.isDrawingActive) {  // Only proceed if drawing is not active
                const now = Date.now();
                this.paths.forEach(path => {
                    if (!path.isDrawing && now - path.lastUpdated >= 3000) {
                        path.alpha -= 0.01;  // Decrease the alpha value for smooth fade-out
                    }
                });
                this.paths = this.paths.filter(path => path.alpha > 0);  // Remove paths that are fully faded out
                this.drawPaths();
                if (this.paths.length > 0) {
                    this.startFadeTimeout();  // Restart the fade timeout if there are still paths
                }
            } else {
                this.startFadeTimeout();  // Restart the fade timeout if drawing is active
            }
        }, 50);  // Check every 50ms for smooth fade-out effect
    }

    startInactivityCheck() {
        clearTimeout(this.inactivityTimeout);  // Clear any existing inactivity timeout
        this.inactivityTimeout = setTimeout(() => {
            const now = Date.now();
            if (now - this.lastActivityTime >= this.inactivityDuration) {
                this.clearScreen();  // Clear the screen if inactivity duration has passed
            } else {
                this.startInactivityCheck();  // Restart inactivity check
            }
        }, 1000);  // Check every second
    }

    clearScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paths = [];  // Clear all paths
    }

    drawPaths() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paths.forEach((path, index) => {
            this.ctx.globalAlpha = path.alpha;  // Set the global alpha for fade-out effect
            this.ctx.beginPath();
            this.ctx.moveTo(path.points[0].x, path.points[0].y);
            path.points.forEach(point => {
                this.ctx.lineTo(point.x, point.y);
            });
            this.ctx.strokeStyle = path.color;
            this.ctx.lineWidth = path.width;
            this.ctx.lineJoin = 'round';
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            // Draw the user's name near the last point if currently drawing or within 3 seconds of release
            if (this.currentName && index === this.activePathIndex) {
                const lastPoint = path.points[path.points.length - 1];
                const name = this.currentName;

                this.ctx.save();  // Save the current context state

                // Draw the white background
                this.ctx.font = '12px Arial';
                const textWidth = this.ctx.measureText(name).width;
                const textHeight = 12;  // Approximate text height
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(lastPoint.x + 5, lastPoint.y - textHeight + 2, textWidth + 4, textHeight + 4);

                // Draw the text border (stroke)
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = 'black';
                this.ctx.strokeText(name, lastPoint.x + 7, lastPoint.y + 2);

                // Draw the text
                this.ctx.fillStyle = 'black';
                this.ctx.fillText(name, lastPoint.x + 7, lastPoint.y + 2);

                this.ctx.restore();  // Restore the previous context state
            }
        });
        this.ctx.globalAlpha = 1;  // Reset the global alpha to default
    }

    hexToRgb(hex) {
        const bigint = parseInt(hex.replace('#', ''), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r},${g},${b}`;
    }

    resizeCanvas() {
        // Set the desired aspect ratio
        const aspectRatio = 16 / 9;

        // Get the window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Calculate the width and height keeping the aspect ratio
        let canvasWidth = windowWidth;
        let canvasHeight = canvasWidth / aspectRatio;

        // Adjust height if it's too high to fit into the window
        if (canvasHeight > windowHeight) {
            canvasHeight = windowHeight;
            canvasWidth = canvasHeight * aspectRatio;
        }

        // Apply the calculated dimensions to the canvas
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
    }
}
