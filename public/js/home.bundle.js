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

/***/ "./src/main/ipcEventHandlers.js":
/*!**************************************!*\
  !*** ./src/main/ipcEventHandlers.js ***!
  \**************************************/
/***/ ((module) => {

eval("// Centralized navigation and other IPC handlers\nfunction setupGlobalIpcListeners() {\n  window.api.receive('navigate-to', function (url) {\n    console.log('Global navigation to:', url);\n    window.location.href = url;\n  });\n\n  // Add other global IPC event handlers here\n}\nmodule.exports = {\n  setupGlobalIpcListeners: setupGlobalIpcListeners\n};\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/main/ipcEventHandlers.js?");

/***/ }),

/***/ "./src/renderer/pages/home.js":
/*!************************************!*\
  !*** ./src/renderer/pages/home.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("var _require = __webpack_require__(/*! ../../main/ipcEventHandlers */ \"./src/main/ipcEventHandlers.js\"),\n  setupGlobalIpcListeners = _require.setupGlobalIpcListeners;\ndocument.addEventListener('DOMContentLoaded', function () {\n  var viewScreenButton = document.getElementById('viewScreenButton');\n  var shareScreenButton = document.getElementById('shareScreenButton');\n  window.api.send('close-overlay-window');\n  window.api.send('open-view-page-default');\n  viewScreenButton.addEventListener('click', function () {\n    console.log('view button clicked');\n    window.api.send('load-view-page');\n  });\n  shareScreenButton.addEventListener('click', function () {\n    console.log('share button clicked');\n    window.api.send('load-share-page');\n  });\n  setupGlobalIpcListeners();\n});\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/pages/home.js?");

/***/ }),

/***/ "./styles/pages/home.scss":
/*!********************************!*\
  !*** ./styles/pages/home.scss ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://W.I.L.L.Y/./styles/pages/home.scss?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
/******/ 	__webpack_require__("./src/renderer/pages/home.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./styles/pages/home.scss");
/******/ 	
/******/ })()
;