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

/***/ "./src/renderer/components/globals/externalLinks.js":
/*!**********************************************************!*\
  !*** ./src/renderer/components/globals/externalLinks.js ***!
  \**********************************************************/
/***/ (() => {

eval("document.addEventListener('DOMContentLoaded', function () {\n  document.querySelectorAll('a[href]').forEach(function (link) {\n    link.addEventListener('click', function (event) {\n      event.preventDefault();\n      window.api.send('open-external-link', link.href);\n    });\n  });\n});\n\n//# sourceURL=webpack://W.I.L.L.Y/./src/renderer/components/globals/externalLinks.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/renderer/components/globals/externalLinks.js"]();
/******/ 	
/******/ })()
;