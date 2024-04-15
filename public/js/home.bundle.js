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

/***/ "./src/renderer/pages/home.js":
/*!************************************!*\
  !*** ./src/renderer/pages/home.js ***!
  \************************************/
/***/ (() => {

eval("document.addEventListener('DOMContentLoaded', function () {\n  // These use the `api` object from the preload script\n  window.api.send('close-overlay-window');\n  window.api.send('open-view-page-default');\n  document.getElementById('viewScreenButton').addEventListener('click', function () {\n    console.log('view button clicked');\n    window.api.send('load-view-page');\n  });\n  document.getElementById('shareScreenButton').addEventListener('click', function () {\n    console.log('share button clicked');\n    window.api.send('load-share-page');\n  });\n  window.api.receive('navigate-to', function (url) {\n    window.location.href = url; // or dynamically load content\n  });\n});\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/pages/home.js?");

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
/******/ 	__webpack_modules__["./src/renderer/pages/home.js"](0, {}, __webpack_require__);
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./styles/pages/home.scss"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;