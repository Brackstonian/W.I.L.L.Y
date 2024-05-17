// log.js
export function addLog(message, selector = '.app-main-log--dos', isHtml = false) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const logZone = document.querySelector(selector);
            const logEntry = document.createElement('p');
            logEntry.classList.add('app-main-log__log');
            if (isHtml) {
                logEntry.innerHTML = message;
            } else {
                logEntry.textContent = message;
            }
            logZone.appendChild(logEntry);
            logZone.scrollTop = logZone.scrollHeight; // Scroll to the bottom

            if (selector === '.app-main-log--ps') {
                logZone.style.display = 'block';
            }

            resolve();
        }, 500);
    });
}
