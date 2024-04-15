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

/***/ "./src/renderer/pages/overlay.js":
/*!***************************************!*\
  !*** ./src/renderer/pages/overlay.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("var _require = __webpack_require__(/*! electron */ \"electron\"),\n  ipcRenderer = _require.ipcRenderer;\ndocument.addEventListener('DOMContentLoaded', function () {\n  var canvas = document.getElementById('overlayCanvas');\n  var ctx = canvas.getContext('2d');\n  var paths = [];\n  var fadeTimeout = null;\n  var IS_DRAWING = false;\n  ipcRenderer.on('draw-data', function (event, data) {\n    var x = data.x * canvas.width;\n    var y = data.y * canvas.height;\n    switch (data.type) {\n      case 'mousedown':\n        clearTimeout(fadeTimeout); // Stop the fading process when drawing starts\n        IS_DRAWING = true;\n        paths.push({\n          points: [{\n            x: x,\n            y: y\n          }],\n          alpha: 1,\n          IS_DRAWING: true\n        });\n        break;\n      case 'mousemove':\n        if (IS_DRAWING && paths.length > 0 && paths[paths.length - 1].IS_DRAWING) {\n          paths[paths.length - 1].points.push({\n            x: x,\n            y: y\n          });\n        }\n        break;\n      case 'mouseup':\n        IS_DRAWING = false;\n        if (paths.length > 0) {\n          paths[paths.length - 1].IS_DRAWING = false;\n        }\n        startFading();\n        break;\n    }\n    drawPaths();\n  });\n  function startFading() {\n    fadeTimeout = setTimeout(function () {\n      var fadeInterval = setInterval(function () {\n        var allFaded = true;\n        paths.forEach(function (path) {\n          if (!path.IS_DRAWING && path.alpha > 0) {\n            path.alpha -= 0.01;\n            allFaded = false;\n          }\n        });\n        drawPaths(); // Redraw paths with updated alpha\n        if (allFaded) clearInterval(fadeInterval);\n      }, 50);\n    }, 1000);\n  }\n  ;\n  function drawPaths() {\n    ctx.clearRect(0, 0, canvas.width, canvas.height);\n    paths.forEach(function (path) {\n      ctx.beginPath();\n      ctx.moveTo(path.points[0].x, path.points[0].y);\n      path.points.forEach(function (point) {\n        ctx.lineTo(point.x, point.y);\n      });\n      ctx.strokeStyle = \"rgba(255, 0, 0, \".concat(path.alpha, \")\"); // Use dynamic alpha for visibility\n      ctx.lineWidth = 2;\n      ctx.stroke();\n    });\n  }\n  function resizeCanvas() {\n    canvas.width = window.innerWidth;\n    canvas.height = window.innerHeight;\n  }\n  window.addEventListener('resize', resizeCanvas);\n  resizeCanvas();\n});\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/pages/overlay.js?");

/***/ }),

/***/ "./styles/pages/overlay.scss":
/*!***********************************!*\
  !*** ./styles/pages/overlay.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://W.I.L.L.Y/./styles/pages/overlay.scss?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

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
/******/ 	__webpack_require__("./src/renderer/pages/overlay.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./styles/pages/overlay.scss");
/******/ 	
/******/ })()
;