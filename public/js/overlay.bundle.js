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

/***/ "./src/renderer/canvas/drawingSimulator.js":
/*!*************************************************!*\
  !*** ./src/renderer/canvas/drawingSimulator.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DrawingSimulator)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ \"./node_modules/@babel/runtime/helpers/esm/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ \"./node_modules/@babel/runtime/helpers/esm/createClass.js\");\n\n\nvar DrawingSimulator = /*#__PURE__*/function () {\n  function DrawingSimulator(canvasId) {\n    var _this = this;\n    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, DrawingSimulator);\n    this.canvas = document.getElementById(canvasId);\n    this.ctx = this.canvas.getContext('2d');\n    this.paths = [];\n    this.isDrawing = false;\n    this.isDrawingActive = false; // Flag to track if drawing is active\n    this.currentName = null; // Keep track of the current drawing name\n    this.nameTimeout = null; // Timeout for name fading\n    this.fadeTimeout = null; // Timeout for line fading\n    this.inactivityTimeout = null; // Timeout for inactivity\n    this.activePathIndex = null; // Index of the active drawing path\n    this.lastActivityTime = Date.now(); // Track the last activity time\n    this.inactivityDuration = 6000; // Inactivity duration in milliseconds\n\n    this.resizeCanvas(); // Ensure the canvas is correctly sized\n    this.startInactivityCheck(); // Start checking for inactivity\n\n    window.addEventListener('resize', function () {\n      return _this.resizeCanvas();\n    }); // Ensure canvas resizes properly on window resize\n    window.addEventListener('DOMContentLoaded', function () {\n      return _this.resizeCanvas();\n    }); // Ensure canvas is correctly sized when the document is loaded\n  }\n  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(DrawingSimulator, [{\n    key: \"simulate\",\n    value: function simulate(data) {\n      var _this2 = this;\n      var x = data.x * this.canvas.width;\n      var y = data.y * this.canvas.height - 25;\n      this.lastActivityTime = Date.now(); // Update the last activity time\n\n      switch (data.type) {\n        case 'mousedown':\n          clearTimeout(this.nameTimeout); // Clear any existing name timeout\n          this.isDrawing = true;\n          this.isDrawingActive = true; // Set drawing active flag\n          this.currentName = data.name; // Set the current drawing name\n          this.paths.push({\n            points: [{\n              x: x,\n              y: y\n            }],\n            isDrawing: true,\n            color: data.color || '#ff0000',\n            // Default to red if color is not provided\n            width: data.width || 2,\n            // Default to 2 if width is not provided\n            name: data.name || '',\n            // Default to empty string if name is not provided\n            lastUpdated: Date.now(),\n            // Track the last update time\n            alpha: 1 // Initial alpha value for fade-out effect\n          });\n          this.activePathIndex = this.paths.length - 1; // Set the current path as active\n          break;\n        case 'mousemove':\n          if (this.isDrawing && this.activePathIndex !== null) {\n            this.paths[this.activePathIndex].points.push({\n              x: x,\n              y: y\n            });\n            this.paths[this.activePathIndex].lastUpdated = Date.now(); // Update the last update time\n          }\n          break;\n        case 'mouseup':\n          this.isDrawing = false;\n          this.isDrawingActive = false; // Reset drawing active flag\n          if (this.activePathIndex !== null) {\n            this.paths[this.activePathIndex].isDrawing = false;\n          }\n          this.nameTimeout = setTimeout(function () {\n            _this2.currentName = null; // Clear the current drawing name after 3 seconds\n            _this2.drawPaths();\n          }, 3000);\n          this.startFadeTimeout(); // Start the fade timeout after the mouse is released\n          break;\n      }\n      this.drawPaths();\n    }\n  }, {\n    key: \"startFadeTimeout\",\n    value: function startFadeTimeout() {\n      var _this3 = this;\n      clearTimeout(this.fadeTimeout); // Clear any existing fade timeout\n      this.fadeTimeout = setTimeout(function () {\n        if (!_this3.isDrawingActive) {\n          // Only proceed if drawing is not active\n          var now = Date.now();\n          _this3.paths.forEach(function (path) {\n            if (!path.isDrawing && now - path.lastUpdated >= 3000) {\n              path.alpha -= 0.01; // Decrease the alpha value for smooth fade-out\n            }\n          });\n          _this3.paths = _this3.paths.filter(function (path) {\n            return path.alpha > 0;\n          }); // Remove paths that are fully faded out\n          _this3.drawPaths();\n          if (_this3.paths.length > 0) {\n            _this3.startFadeTimeout(); // Restart the fade timeout if there are still paths\n          }\n        } else {\n          _this3.startFadeTimeout(); // Restart the fade timeout if drawing is active\n        }\n      }, 50); // Check every 50ms for smooth fade-out effect\n    }\n  }, {\n    key: \"startInactivityCheck\",\n    value: function startInactivityCheck() {\n      var _this4 = this;\n      clearTimeout(this.inactivityTimeout); // Clear any existing inactivity timeout\n      this.inactivityTimeout = setTimeout(function () {\n        var now = Date.now();\n        if (now - _this4.lastActivityTime >= _this4.inactivityDuration) {\n          _this4.clearScreen(); // Clear the screen if inactivity duration has passed\n        } else {\n          _this4.startInactivityCheck(); // Restart inactivity check\n        }\n      }, 1000); // Check every second\n    }\n  }, {\n    key: \"clearScreen\",\n    value: function clearScreen() {\n      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\n      this.paths = []; // Clear all paths\n    }\n  }, {\n    key: \"drawPaths\",\n    value: function drawPaths() {\n      var _this5 = this;\n      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\n      this.paths.forEach(function (path, index) {\n        _this5.ctx.globalAlpha = path.alpha; // Set the global alpha for fade-out effect\n        _this5.ctx.beginPath();\n        _this5.ctx.moveTo(path.points[0].x, path.points[0].y);\n        path.points.forEach(function (point) {\n          _this5.ctx.lineTo(point.x, point.y);\n        });\n        _this5.ctx.strokeStyle = path.color;\n        _this5.ctx.lineWidth = path.width;\n        _this5.ctx.lineJoin = 'round';\n        _this5.ctx.lineCap = 'round';\n        _this5.ctx.stroke();\n\n        // Draw the user's name near the last point if currently drawing or within 3 seconds of release\n        if (_this5.currentName && index === _this5.activePathIndex) {\n          var lastPoint = path.points[path.points.length - 1];\n          var name = _this5.currentName;\n          _this5.ctx.save(); // Save the current context state\n\n          // Draw the white background\n          _this5.ctx.font = '12px Arial';\n          var textWidth = _this5.ctx.measureText(name).width;\n          var textHeight = 12; // Approximate text height\n          _this5.ctx.fillStyle = 'white';\n          _this5.ctx.fillRect(lastPoint.x + 5, lastPoint.y - textHeight + 2, textWidth + 4, textHeight + 4);\n\n          // Draw the text border (stroke)\n          _this5.ctx.lineWidth = 1;\n          _this5.ctx.strokeStyle = 'black';\n          _this5.ctx.strokeText(name, lastPoint.x + 7, lastPoint.y + 2);\n\n          // Draw the text\n          _this5.ctx.fillStyle = 'black';\n          _this5.ctx.fillText(name, lastPoint.x + 7, lastPoint.y + 2);\n          _this5.ctx.restore(); // Restore the previous context state\n        }\n      });\n      this.ctx.globalAlpha = 1; // Reset the global alpha to default\n    }\n  }, {\n    key: \"hexToRgb\",\n    value: function hexToRgb(hex) {\n      var bigint = parseInt(hex.replace('#', ''), 16);\n      var r = bigint >> 16 & 255;\n      var g = bigint >> 8 & 255;\n      var b = bigint & 255;\n      return \"\".concat(r, \",\").concat(g, \",\").concat(b);\n    }\n  }, {\n    key: \"resizeCanvas\",\n    value: function resizeCanvas() {\n      // Set the desired aspect ratio\n      var aspectRatio = 16 / 9;\n\n      // Get the window dimensions\n      var windowWidth = window.innerWidth;\n      var windowHeight = window.innerHeight;\n\n      // Calculate the width and height keeping the aspect ratio\n      var canvasWidth = windowWidth;\n      var canvasHeight = canvasWidth / aspectRatio;\n\n      // Adjust height if it's too high to fit into the window\n      if (canvasHeight > windowHeight) {\n        canvasHeight = windowHeight;\n        canvasWidth = canvasHeight * aspectRatio;\n      }\n\n      // Apply the calculated dimensions to the canvas\n      this.canvas.width = canvasWidth;\n      this.canvas.height = canvasHeight;\n    }\n  }]);\n}();\n\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/canvas/drawingSimulator.js?");

/***/ }),

/***/ "./src/renderer/pages/overlay.js":
/*!***************************************!*\
  !*** ./src/renderer/pages/overlay.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _canvas_drawingSimulator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../canvas/drawingSimulator.js */ \"./src/renderer/canvas/drawingSimulator.js\");\nvar _require = __webpack_require__(/*! electron */ \"electron\"),\n  ipcRenderer = _require.ipcRenderer;\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  var drawingSimulator = new _canvas_drawingSimulator_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]('overlayCanvas');\n  ipcRenderer.on('draw-data', function (event, data) {\n    drawingSimulator.simulate(data);\n  });\n});\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/pages/overlay.js?");

/***/ }),

/***/ "./styles/pages/overlay.scss":
/*!***********************************!*\
  !*** ./styles/pages/overlay.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://W.I.L.L.Y/./styles/pages/overlay.scss?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _classCallCheck)\n/* harmony export */ });\nfunction _classCallCheck(instance, Constructor) {\n  if (!(instance instanceof Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n}\n\n//# sourceURL=webpack://W.I.L.L.Y/./node_modules/@babel/runtime/helpers/esm/classCallCheck.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _createClass)\n/* harmony export */ });\n/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ \"./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js\");\n\nfunction _defineProperties(target, props) {\n  for (var i = 0; i < props.length; i++) {\n    var descriptor = props[i];\n    descriptor.enumerable = descriptor.enumerable || false;\n    descriptor.configurable = true;\n    if (\"value\" in descriptor) descriptor.writable = true;\n    Object.defineProperty(target, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(descriptor.key), descriptor);\n  }\n}\nfunction _createClass(Constructor, protoProps, staticProps) {\n  if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n  if (staticProps) _defineProperties(Constructor, staticProps);\n  Object.defineProperty(Constructor, \"prototype\", {\n    writable: false\n  });\n  return Constructor;\n}\n\n//# sourceURL=webpack://W.I.L.L.Y/./node_modules/@babel/runtime/helpers/esm/createClass.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ toPrimitive)\n/* harmony export */ });\n/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ \"./node_modules/@babel/runtime/helpers/esm/typeof.js\");\n\nfunction toPrimitive(t, r) {\n  if (\"object\" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(t) || !t) return t;\n  var e = t[Symbol.toPrimitive];\n  if (void 0 !== e) {\n    var i = e.call(t, r || \"default\");\n    if (\"object\" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(i)) return i;\n    throw new TypeError(\"@@toPrimitive must return a primitive value.\");\n  }\n  return (\"string\" === r ? String : Number)(t);\n}\n\n//# sourceURL=webpack://W.I.L.L.Y/./node_modules/@babel/runtime/helpers/esm/toPrimitive.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ toPropertyKey)\n/* harmony export */ });\n/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ \"./node_modules/@babel/runtime/helpers/esm/typeof.js\");\n/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ \"./node_modules/@babel/runtime/helpers/esm/toPrimitive.js\");\n\n\nfunction toPropertyKey(t) {\n  var i = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(t, \"string\");\n  return \"symbol\" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(i) ? i : i + \"\";\n}\n\n//# sourceURL=webpack://W.I.L.L.Y/./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _typeof)\n/* harmony export */ });\nfunction _typeof(o) {\n  \"@babel/helpers - typeof\";\n\n  return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (o) {\n    return typeof o;\n  } : function (o) {\n    return o && \"function\" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? \"symbol\" : typeof o;\n  }, _typeof(o);\n}\n\n//# sourceURL=webpack://W.I.L.L.Y/./node_modules/@babel/runtime/helpers/esm/typeof.js?");

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
/******/ 	__webpack_require__("./src/renderer/pages/overlay.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./styles/pages/overlay.scss");
/******/ 	
/******/ })()
;