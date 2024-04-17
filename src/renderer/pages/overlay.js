const { ipcRenderer } = require('electron');
import DrawingSimulator from '../canvas/drawingSimulator.js';

document.addEventListener('DOMContentLoaded', () => {
    const drawingSimulator = new DrawingSimulator('overlayCanvas');
    ipcRenderer.on('draw-data', (event, data) => {
        drawingSimulator.simulate(data);
    });

});