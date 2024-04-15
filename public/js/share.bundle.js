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

/***/ "./src/renderer/canvasManager.js":
/*!***************************************!*\
  !*** ./src/renderer/canvasManager.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ CanvasManager)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ \"./node_modules/@babel/runtime/helpers/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ \"./node_modules/@babel/runtime/helpers/createClass.js\");\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);\n\n\nvar CanvasManager = /*#__PURE__*/function () {\n  function CanvasManager(sendDataCallback) {\n    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, CanvasManager);\n    this.canvas = document.getElementById('drawingCanvas');\n    this.ctx = this.canvas.getContext('2d');\n    this.fadeTimeout = null;\n    this.paths = [];\n    this.IS_DRAWING = false;\n    this.sendData = sendDataCallback; // Store the callback for later use\n  }\n  return _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(CanvasManager, [{\n    key: \"init\",\n    value: function init() {\n      this.resizeCanvas(); // Adjust canvas size.\n      this.drawPaths(); // Start the drawing process.\n      window.onresize = this.resizeCanvas.bind(this); // Ensure canvas resizes properly on window resize.\n\n      // Set up mouse event handlers for drawing on the canvas.\n      this.setupEventHandlers();\n    }\n  }, {\n    key: \"setupEventHandlers\",\n    value: function setupEventHandlers() {\n      var _this = this;\n      this.canvas.onmousedown = function (e) {\n        clearTimeout(_this.fadeTimeout);\n        _this.IS_DRAWING = true;\n        var normalizedX = e.offsetX / _this.canvas.width;\n        var normalizedY = e.offsetY / _this.canvas.height;\n        var newPath = {\n          points: [{\n            x: e.offsetX,\n            y: e.offsetY\n          }],\n          alpha: 1,\n          IS_DRAWING: true\n        };\n        _this.paths.push(newPath);\n        _this.sendData({\n          type: 'mousedown',\n          x: normalizedX,\n          y: normalizedY\n        });\n      };\n      this.canvas.onmousemove = function (e) {\n        if (_this.IS_DRAWING) {\n          var normalizedX = e.offsetX / _this.canvas.width;\n          var normalizedY = e.offsetY / _this.canvas.height;\n          var currentPath = _this.paths[_this.paths.length - 1];\n          currentPath.points.push({\n            x: e.offsetX,\n            y: e.offsetY\n          });\n          _this.sendData({\n            type: 'mousemove',\n            x: normalizedX,\n            y: normalizedY\n          });\n        }\n      };\n      this.canvas.onmouseup = this.canvas.onmouseout = function () {\n        if (_this.IS_DRAWING) {\n          _this.IS_DRAWING = false;\n          _this.paths[_this.paths.length - 1];\n          _this.IS_DRAWING = false;\n          _this.sendData({\n            type: 'mouseup'\n          });\n          _this.startFading();\n        }\n      };\n    }\n  }, {\n    key: \"drawPaths\",\n    value: function drawPaths() {\n      var _this2 = this;\n      if (!this.ctx) return;\n      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\n      this.paths.forEach(function (path) {\n        _this2.ctx.beginPath();\n        _this2.ctx.moveTo(path.points[0].x, path.points[0].y);\n        path.points.forEach(function (point) {\n          return _this2.ctx.lineTo(point.x, point.y);\n        });\n        _this2.ctx.strokeStyle = \"rgba(255, 0, 0, \".concat(path.alpha, \")\");\n        _this2.ctx.lineWidth = 2;\n        _this2.ctx.stroke();\n      });\n      requestAnimationFrame(this.drawPaths.bind(this));\n    }\n  }, {\n    key: \"resizeCanvas\",\n    value: function resizeCanvas() {\n      if (!this.canvas) return;\n      this.canvas.width = this.canvas.offsetWidth;\n      this.canvas.height = this.canvas.offsetHeight;\n    }\n  }, {\n    key: \"startFading\",\n    value: function startFading() {\n      var _this3 = this;\n      this.fadeTimeout = setTimeout(function () {\n        var fadeInterval = setInterval(function () {\n          var allFaded = true;\n          _this3.paths.forEach(function (path) {\n            if (path.alpha > 0) {\n              path.alpha -= 0.01;\n              allFaded = false;\n            }\n          });\n          _this3.drawPaths();\n          if (allFaded) clearInterval(fadeInterval);\n        }, 50);\n      }, 1000);\n    }\n  }, {\n    key: \"sendData\",\n    value: function sendData(data) {\n      console.log('sending data');\n      if (peerManager.dataConnection && peerManager.dataConnection.open) {\n        console.log('Sending data:', data);\n        peerManager.dataConnection.send(data);\n      } else {\n        console.log('Data connection not ready or open.');\n      }\n    }\n  }, {\n    key: \"simulateDrawing\",\n    value: function simulateDrawing(data) {\n      // Function to simulate drawing on the canvas based on received data.\n      var x = data.x * canvas.width; // Calculate x coordinate.\n      var y = data.y * canvas.height; // Calculate y coordinate.\n      switch (data.type) {\n        case 'mousedown':\n          IS_DRAWING = true; // Start drawing.\n          paths.push({\n            points: [{\n              x: x,\n              y: y\n            }],\n            alpha: 1,\n            IS_DRAWING: true\n          });\n          break;\n        case 'mousemove':\n          if (IS_DRAWING && paths.length > 0 && paths[paths.length - 1].IS_DRAWING) {\n            paths[paths.length - 1].points.push({\n              x: x,\n              y: y\n            }); // Add points to path.\n          }\n          break;\n        case 'mouseup':\n          if (paths.length > 0) {\n            paths[paths.length - 1].IS_DRAWING = false; // Stop drawing.\n          }\n          IS_DRAWING = false;\n          this.startFading(); // Start fading drawing.\n          break;\n      }\n      this.drawPaths(); // Redraw paths.\n    }\n  }]);\n}();\n\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/canvasManager.js?");

/***/ }),

/***/ "./src/renderer/pages/sharePage.js":
/*!*****************************************!*\
  !*** ./src/renderer/pages/sharePage.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _peerManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../peerManager.js */ \"./src/renderer/peerManager.js\");\n/* harmony import */ var _canvasManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../canvasManager.js */ \"./src/renderer/canvasManager.js\");\n\n\n\nvar peerManager = new _peerManager_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nvar canvasManager = new _canvasManager_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\ndocument.addEventListener('DOMContentLoaded', function () {\n  window.api.send('open-view-page-maximized');\n  window.api.send('request-player');\n  window.api.send('request-screens');\n  window.api.on('load-player', function (event) {\n    var containerDiv = document.getElementById(\"videoContainer\");\n    containerDiv.style.display = \"block\";\n  });\n  window.api.on('show-picker', function (sources) {\n    var screenList = document.getElementById('screen-list');\n    screenList.innerHTML = '';\n    sources.forEach(function (source, index) {\n      var li = document.createElement('li');\n      li.textContent = \"Screen \".concat(index + 1, \": \").concat(source.name);\n      li.addEventListener('click', function () {\n        window.api.send('select-screen', index);\n      });\n      screenList.appendChild(li);\n    });\n  });\n  window.api.on('screen-selected', function (sourceId) {\n    // Attempt to get media stream with the selected screen source ID\n\n    navigator.mediaDevices.getUserMedia({\n      video: {\n        mandatory: {\n          chromeMediaSource: 'desktop',\n          chromeMediaSourceId: sourceId\n        }\n      }\n    }).then(function (stream) {\n      localStream = stream;\n      localVideo.srcObject = stream;\n      // Update the stream in any existing calls\n      if (peerManager.currentCall) {\n        peerManager.updateStreamInCall(stream);\n      }\n      var type = 'stream';\n      peerManager.initializePeer(type);\n      console.log('Screen stream has been initialized and peer connection set up.');\n    })[\"catch\"](function (err) {\n      console.error('Failed to get screen stream', err);\n      // Optionally, inform the user that the stream could not be obtained\n      alert('Unable to capture the screen. Please check console for more details.');\n    });\n  });\n  window.api.on('display-unique-id', function (event, sourceId) {\n    var uniqueIdDisplay = document.getElementById('uniqueId');\n    uniqueIdDisplay.innerText = \"Share this ID  : \".concat(sourceId); // Display peer ID\n  });\n  window.api.on('init-canvas', function (event, sourceId) {\n    _canvasManager_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].init(canvas, ctx);\n  });\n});\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/pages/sharePage.js?");

/***/ }),

/***/ "./src/renderer/peerManager.js":
/*!*************************************!*\
  !*** ./src/renderer/peerManager.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ PeerManager)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ \"./node_modules/@babel/runtime/helpers/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ \"./node_modules/@babel/runtime/helpers/createClass.js\");\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _canvasManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./canvasManager.js */ \"./src/renderer/canvasManager.js\");\n\n\n\nvar canvasManager = new _canvasManager_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]();\nvar PeerManager = /*#__PURE__*/function () {\n  function PeerManager() {\n    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, PeerManager);\n    this.peer = null;\n    this.dataConnection = null;\n  }\n  return _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(PeerManager, [{\n    key: \"initializePeer\",\n    value: function initializePeer(type) {\n      this.closeExistingConnections();\n      if (this.peer && !this.peer.destroyed) {\n        console.log('Using existing this.peer instance.');\n        return; // Use existing this.peer if it's still active\n      }\n      this.peer = new Peer(null, {\n        host: 'w-i-l-l-y-server.onrender.com',\n        port: 443,\n        path: '/peerjs',\n        secure: true,\n        config: {\n          'iceServers': [{\n            urls: 'stun:stun1.l.google.com:19302'\n          }, {\n            urls: 'turn:numb.viagenie.ca',\n            credential: 'muazkh',\n            username: 'webrtc@live.com'\n          }]\n        }\n      });\n      if (type === 'stream') {\n        this.setupStreamPeerEventHandlers();\n      } else if (type === 'view') {\n        this.setupViewPeerEventHandlers();\n      }\n    }\n  }, {\n    key: \"setupStreamPeerEventHandlers\",\n    value: function setupStreamPeerEventHandlers() {\n      var _this = this;\n      this.peer.on('open', function (id) {\n        console.log('Peer ID:', id);\n        window.api.send('create-share-id', id); // Send drawing data.\n      });\n      this.peer.on('error', function (err) {\n        console.error('Peer error:', err);\n        peer.destroy(); // Destroy peer on error\n      });\n      this.peer.on('connection', function (conn) {\n        if (_this.dataConnection) {\n          _this.dataConnection.close(); // Close existing connection if open\n        }\n        _this.dataConnection = conn;\n        _this.dataConnection.on('data', function (data) {\n          console.log('Received data:', data);\n          window.api.send('send-draw-data', data); // Send drawing data.\n        });\n        _this.dataConnection.on('open', function () {\n          console.log('Data connection established with:', conn.peer);\n        });\n      });\n      this.peer.on('call', function (call) {\n        _this.handleCall(call);\n      });\n    }\n  }, {\n    key: \"setupViewPeerEventHandlers\",\n    value: function setupViewPeerEventHandlers() {\n      var _this2 = this;\n      this.peer.on('open', function (id) {\n        console.log('Peer connection established with ID:', id);\n      });\n      this.peer.on('error', function (err) {\n        closeExistingConnections();\n        console.error('Peer error:', err);\n      });\n      this.peer.on('connection', function (conn) {\n        _this2.handleDataConnection(conn);\n      });\n    }\n  }, {\n    key: \"handleCall\",\n    value: function handleCall(call) {\n      call.answer(localStream);\n      call.on('error', function (err) {\n        console.error('Call error:', err);\n      });\n    }\n  }, {\n    key: \"handleDataConnection\",\n    value: function handleDataConnection(conn) {\n      var _this3 = this;\n      conn.on('open', function () {\n        console.log('Data connection established with:', conn.peer);\n      });\n      conn.on('data', function (data) {\n        console.log('Received data:', data);\n        _this3.handleReceivedData(data);\n      });\n      conn.on('error', function (err) {\n        console.error('Data connection error:', err);\n      });\n    }\n  }, {\n    key: \"closeExistingConnections\",\n    value: function closeExistingConnections() {\n      if (this.peer && !this.peer.destroyed) {\n        this.peer.destroy();\n        console.log('Existing peer connection destroyed.');\n      }\n    }\n  }, {\n    key: \"setupDataConnection\",\n    value: function setupDataConnection(otherPeerId) {\n      if (!this.dataConnection || this.dataConnection.peer !== otherPeerId) {\n        if (this.dataConnection) {\n          this.dataConnection.close(); // Close existing connection if different peerId\n        }\n        this.dataConnection = this.peer.connect(otherPeerId);\n        this.handleDataConnection(this.dataConnection);\n      }\n    }\n  }, {\n    key: \"handleReceivedData\",\n    value: function handleReceivedData(data) {\n      console.log('Data received:', data); // Log received data.\n      canvasManager.simulateDrawing(data); // Simulate drawing based on received data.\n    }\n  }]);\n}();\n\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/peerManager.js?");

/***/ }),

/***/ "./styles/pages/sharePage.scss":
/*!*************************************!*\
  !*** ./styles/pages/sharePage.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://W.I.L.L.Y/./styles/pages/sharePage.scss?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/***/ ((module) => {

eval("function _classCallCheck(instance, Constructor) {\n  if (!(instance instanceof Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n}\nmodule.exports = _classCallCheck, module.exports.__esModule = true, module.exports[\"default\"] = module.exports;\n\n//# sourceURL=webpack://W.I.L.L.Y/./node_modules/@babel/runtime/helpers/classCallCheck.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ \"./node_modules/@babel/runtime/helpers/toPropertyKey.js\");\nfunction _defineProperties(target, props) {\n  for (var i = 0; i < props.length; i++) {\n    var descriptor = props[i];\n    descriptor.enumerable = descriptor.enumerable || false;\n    descriptor.configurable = true;\n    if (\"value\" in descriptor) descriptor.writable = true;\n    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);\n  }\n}\nfunction _createClass(Constructor, protoProps, staticProps) {\n  if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n  if (staticProps) _defineProperties(Constructor, staticProps);\n  Object.defineProperty(Constructor, \"prototype\", {\n    writable: false\n  });\n  return Constructor;\n}\nmodule.exports = _createClass, module.exports.__esModule = true, module.exports[\"default\"] = module.exports;\n\n//# sourceURL=webpack://W.I.L.L.Y/./node_modules/@babel/runtime/helpers/createClass.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/toPrimitive.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPrimitive.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var _typeof = (__webpack_require__(/*! ./typeof.js */ \"./node_modules/@babel/runtime/helpers/typeof.js\")[\"default\"]);\nfunction toPrimitive(t, r) {\n  if (\"object\" != _typeof(t) || !t) return t;\n  var e = t[Symbol.toPrimitive];\n  if (void 0 !== e) {\n    var i = e.call(t, r || \"default\");\n    if (\"object\" != _typeof(i)) return i;\n    throw new TypeError(\"@@toPrimitive must return a primitive value.\");\n  }\n  return (\"string\" === r ? String : Number)(t);\n}\nmodule.exports = toPrimitive, module.exports.__esModule = true, module.exports[\"default\"] = module.exports;\n\n//# sourceURL=webpack://W.I.L.L.Y/./node_modules/@babel/runtime/helpers/toPrimitive.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/toPropertyKey.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPropertyKey.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var _typeof = (__webpack_require__(/*! ./typeof.js */ \"./node_modules/@babel/runtime/helpers/typeof.js\")[\"default\"]);\nvar toPrimitive = __webpack_require__(/*! ./toPrimitive.js */ \"./node_modules/@babel/runtime/helpers/toPrimitive.js\");\nfunction toPropertyKey(t) {\n  var i = toPrimitive(t, \"string\");\n  return \"symbol\" == _typeof(i) ? i : i + \"\";\n}\nmodule.exports = toPropertyKey, module.exports.__esModule = true, module.exports[\"default\"] = module.exports;\n\n//# sourceURL=webpack://W.I.L.L.Y/./node_modules/@babel/runtime/helpers/toPropertyKey.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/***/ ((module) => {

eval("function _typeof(o) {\n  \"@babel/helpers - typeof\";\n\n  return (module.exports = _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (o) {\n    return typeof o;\n  } : function (o) {\n    return o && \"function\" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? \"symbol\" : typeof o;\n  }, module.exports.__esModule = true, module.exports[\"default\"] = module.exports), _typeof(o);\n}\nmodule.exports = _typeof, module.exports.__esModule = true, module.exports[\"default\"] = module.exports;\n\n//# sourceURL=webpack://W.I.L.L.Y/./node_modules/@babel/runtime/helpers/typeof.js?");

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	__webpack_require__("./src/renderer/pages/sharePage.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./styles/pages/sharePage.scss");
/******/ 	
/******/ })()
;