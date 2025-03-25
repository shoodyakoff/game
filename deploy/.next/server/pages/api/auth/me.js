"use strict";
(() => {
var exports = {};
exports.id = 661;
exports.ids = [661];
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

/***/ 7260:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _server_config_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1005);
/* harmony import */ var _server_config_db__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_server_config_db__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _server_controllers_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7446);
/* harmony import */ var _server_controllers_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_server_controllers_auth__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _server_middleware_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2991);
/* harmony import */ var _server_middleware_auth__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_server_middleware_auth__WEBPACK_IMPORTED_MODULE_2__);



// Обработчик для маршрута получения данных пользователя
async function handler(req, res) {
    // Подключаемся к базе данных
    await _server_config_db__WEBPACK_IMPORTED_MODULE_0___default()();
    // Разрешаем только GET-запросы
    if (req.method === "GET") {
        // Применяем middleware для проверки аутентификации
        try {
            await new Promise((resolve, reject)=>{
                (0,_server_middleware_auth__WEBPACK_IMPORTED_MODULE_2__.protect)(req, res, (err)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            // Если middleware пройден успешно, вызываем контроллер
            return (0,_server_controllers_auth__WEBPACK_IMPORTED_MODULE_1__.getMe)(req, res);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Ошибка аутентификации"
            });
        }
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
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [974,446,991], () => (__webpack_exec__(7260)));
module.exports = __webpack_exports__;

})();