"use strict";
(() => {
var exports = {};
exports.id = 465;
exports.ids = [465];
exports.modules = {

/***/ 8432:
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ 1185:
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 8298:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _server_config_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1005);
/* harmony import */ var _server_config_db__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_server_config_db__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _server_controllers_password__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5441);
/* harmony import */ var _server_controllers_password__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_server_controllers_password__WEBPACK_IMPORTED_MODULE_1__);


// Обработчик запроса на проверку токена восстановления пароля
async function handler(req, res) {
    // Подключаемся к базе данных
    await _server_config_db__WEBPACK_IMPORTED_MODULE_0___default()();
    // Разрешаем только GET-запросы
    if (req.method === "GET") {
        return (0,_server_controllers_password__WEBPACK_IMPORTED_MODULE_1__.verifyResetToken)(req, res);
    }
    // Если метод не GET, возвращаем ошибку
    res.setHeader("Allow", [
        "GET"
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
var __webpack_require__ = require("../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [974,441], () => (__webpack_exec__(8298)));
module.exports = __webpack_exports__;

})();