// log.js
export function addLog(message, elmID = 'log-zone', isHtml = false) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const logZone = document.getElementById(elmID);
            const logEntry = document.createElement('p');
            logEntry.classList.add('app_log-zone-log');
            if (isHtml) {
                logEntry.innerHTML = message;
            } else {
                logEntry.textContent = message;
            }
            logZone.appendChild(logEntry);
            logZone.scrollTop = logZone.scrollHeight; // Scroll to the bottom

            if (elmID === 'log-zone-ps') {
                logZone.style.display = 'block';
            }

            resolve();
        }, 500);
    });
}
