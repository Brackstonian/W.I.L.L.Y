/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/renderer/pages/view.js":
/*!************************************!*\
  !*** ./src/renderer/pages/view.js ***!
  \************************************/
/***/ (() => {

eval("// const { setupGlobalRenderers } = require('../../main/renderer.js');\n\n// import PeerManager from '../peerManager.js';\n// import CanvasManager from '../canvasManager.js';\n\n// document.addEventListener('DOMContentLoaded', () => {\n//     setupGlobalRenderers();\n\n//     const peerManager = new PeerManager();\n//     const canvasManager = new CanvasManager(sendData);\n\n//     const viewButton = document.getElementById('viewButton');\n\n//     window.api.send('open-view-page-maximized');\n\n//     viewButton.addEventListener('click', () => {\n//         window.api.send('request-player');\n\n//         const peerId = document.getElementById('inputField').value;\n//         if (!peerId) {\n//             alert('Please enter a Peer ID.');\n//             return;\n//         }\n\n//         initializeViewing(peerId);\n//     });\n\n//     function initializeViewing(peerId) {\n//         peerManager.initializePeer('view');\n//         navigator.mediaDevices.getUserMedia({ video: true })\n//             .then(stream => {\n//                 const call = peerManager.peer.call(peerId, stream);\n//                 setupCallHandlers(call);\n//                 peerManager.setupDataConnection(peerId);\n//             }).catch(err => {\n//                 console.error('Failed to get local stream', err);\n//                 alert('Could not access your camera. Please check device permissions.');\n//             });\n//     }\n\n//     function setupCallHandlers(call) {\n//         call.on('stream', remoteStream => {\n//             const videoContainer = document.getElementById('videoContainer');\n//             const videoElement = document.getElementById('localVideo');\n//             videoContainer.style.display = \"block\";\n//             canvasManager.init();\n//             videoElement.srcObject = remoteStream;\n//         });\n//         call.on('error', err => {\n//             console.error('Call error:', err);\n//             alert('An error occurred during the call.');\n//         });\n//     }\n\n//     function sendData(data) {\n//         console.log('Sending data:', data);\n//         if (peerManager.dataConnection && peerManager.dataConnection.open) {\n//             peerManager.dataConnection.send(data);\n//         } else {\n//             console.log('Data connection not ready or open.');\n//         }\n//     }\n// });\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/pages/view.js?");

/***/ }),

/***/ "./styles/pages/view.scss":
/*!********************************!*\
  !*** ./styles/pages/view.scss ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://W.I.L.L.Y/./styles/pages/view.scss?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	__webpack_modules__["./src/renderer/pages/view.js"](0, {}, __webpack_require__);
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./styles/pages/view.scss"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;