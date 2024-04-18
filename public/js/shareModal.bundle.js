/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/renderer/components/globals/cursor.js":
/*!***************************************************!*\
  !*** ./src/renderer/components/globals/cursor.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   cursorSetup: () => (/* binding */ cursorSetup)\n/* harmony export */ });\nfunction cursorSetup() {\n  var cursorSmall = document.querySelector('.cursor');\n  // const cursorBig = document.querySelector('.big');\n\n  var positionElement = function positionElement(e) {\n    var mouseY = e.clientY;\n    var mouseX = e.clientX;\n    cursorSmall.style.transform = \"translate3d(\".concat(mouseX, \"px, \").concat(mouseY, \"px, 0)\");\n\n    // cursorBig.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;\n  };\n  window.addEventListener('mousemove', positionElement);\n}\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/components/globals/cursor.js?");

/***/ }),

/***/ "./src/renderer/components/share-modal.js":
/*!************************************************!*\
  !*** ./src/renderer/components/share-modal.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _globals_cursor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globals/cursor */ \"./src/renderer/components/globals/cursor.js\");\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  (0,_globals_cursor__WEBPACK_IMPORTED_MODULE_0__.cursorSetup)();\n  var copyToClipboard = document.getElementById('copyToClipboard');\n  copyToClipboard.addEventListener('click', function () {\n    navigator.clipboard.writeText(copyToClipboard.dataset.shareid);\n  });\n});\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/components/share-modal.js?");

/***/ }),

/***/ "./styles/components/share-modal.scss":
/*!********************************************!*\
  !*** ./styles/components/share-modal.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://W.I.L.L.Y/./styles/components/share-modal.scss?");

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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
/******/ 	__webpack_require__("./src/renderer/components/share-modal.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./styles/components/share-modal.scss");
/******/ 	
/******/ })()
;