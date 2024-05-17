import { getDomElements } from './domElements.js';
import { setupEventHandlers } from './eventHandlers.js';
import { addLog } from '../../components/log.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { viewButton, penColorInput, penWidthInput, penContainer, penBody, sliderContainer } = getDomElements();

    await addLog('Ready! Add your Name and ID!');

    setupEventHandlers(viewButton, penColorInput, penWidthInput, penContainer, penBody, sliderContainer);
});
