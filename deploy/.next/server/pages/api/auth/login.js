"use strict";
(() => {
var exports = {};
exports.id = 908;
exports.ids = [908];
exports.modules = {

/***/ 8432:
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ 9344:
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ 1185:
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ 3784:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _server_config_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1005);
/* harmony import */ var _server_config_db__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_server_config_db__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _server_controllers_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7446);
/* harmony import */ var _server_controllers_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_server_controllers_auth__WEBPACK_IMPORTED_MODULE_1__);


// Обработчик для маршрута входа
async function handler(req, res) {
    // Подключаемся к базе данных
    await _server_config_db__WEBPACK_IMPORTED_MODULE_0___default()();
    // Разрешаем только POST-запросы
    if (req.method === "POST") {
        return (0,_server_controllers_auth__WEBPACK_IMPORTED_MODULE_1__.login)(req, res);
    }
    // Если метод не POST, возвращаем ошибку
    res.setHeader("Allow", [
        "POST"
    ]);
    res.status(405).json({
        success: false,
        message: `Метод ${req.method} не разрешен`
    });
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [974,446], () => (__webpack_exec__(3784)));
module.exports = __webpack_exports__;

})();