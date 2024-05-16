const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const Twig = require('twig');

const assetPath = path.join(__dirname, '..', '..', '..', 'public');

// Render content for main window
function renderMainWindowContent(mainWindow) {
    Twig.renderFile(path.join(__dirname, '../../../views/pages/home.twig'), { assetPath: assetPath }, (err, html) => {
        if (err) {
            console.error('Error rendering Twig template:', err);
            return;
        }
        const tempHtmlPath = path.join(app.getPath('temp'), 'index.html');
        fs.writeFileSync(tempHtmlPath, html);
        mainWindow.loadFile(tempHtmlPath);
    });

    // mainWindow.webContents.openDevTools();
}

// Render content for overlay window
function renderOverlayWindowContent(overlayWindow) {
    Twig.renderFile(path.join(__dirname, '../../../views/pages/overlay.twig'), { assetPath: assetPath }, (err, html) => {
        if (err) {
            console.error('Error rendering Twig template:', err);
            return;
        }
        const tempHtmlPath = path.join(app.getPath('temp'), 'overlay.html');
        fs.writeFileSync(tempHtmlPath, html);
        overlayWindow.loadFile(tempHtmlPath);
        overlayWindow.setIgnoreMouseEvents(true);
    });
}

// Render the view page and write it to a temporary file
function renderPage(templateName) {
    return new Promise((resolve, reject) => {
        const templatePath = path.join(__dirname, '../../../views/pages', `${templateName}.twig`);
        Twig.renderFile(templatePath, { assetPath: assetPath }, (err, html) => {
            if (err) {
                reject(err);
            } else {
                const tempHtmlPath = path.join(app.getPath('temp'), `${templateName}.html`);
                fs.writeFileSync(tempHtmlPath, html);
                resolve(tempHtmlPath);
            }
        });
    });
}

module.exports = { renderMainWindowContent, renderOverlayWindowContent, renderPage };
