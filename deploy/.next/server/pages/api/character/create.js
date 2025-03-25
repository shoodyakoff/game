"use strict";
(() => {
var exports = {};
exports.id = 513;
exports.ids = [513];
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

/***/ 4603:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _server_config_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1005);
/* harmony import */ var _server_config_db__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_server_config_db__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _server_middleware_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2991);
/* harmony import */ var _server_middleware_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_server_middleware_auth__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _server_models_User__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5705);
/* harmony import */ var _server_models_User__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_server_models_User__WEBPACK_IMPORTED_MODULE_2__);



// Обработчик запроса на создание персонажа
async function handler(req, res) {
    // Подключаемся к базе данных
    await _server_config_db__WEBPACK_IMPORTED_MODULE_0___default()();
    // Разрешаем только POST-запросы
    if (req.method === "POST") {
        try {
            // Применяем middleware для проверки аутентификации
            await new Promise((resolve, reject)=>{
                (0,_server_middleware_auth__WEBPACK_IMPORTED_MODULE_1__.protect)(req, res, (err)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            // В будущем здесь будет создание персонажа 
            // Сейчас просто обновляем флаг hasCharacter у пользователя
            // Получаем пользователя
            const user = await _server_models_User__WEBPACK_IMPORTED_MODULE_2___default().findById(req.user._id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Пользователь не найден"
                });
            }
            // Обновляем флаг наличия персонажа
            user.hasCharacter = true;
            await user.save();
            // Возвращаем успешный ответ
            return res.status(200).json({
                success: true,
                message: "Персонаж успешно создан",
                data: {
                    hasCharacter: true
                }
            });
        } catch (error) {
            console.error("Ошибка создания персонажа:", error);
            return res.status(401).json({
                success: false,
                message: "Ошибка аутентификации или создания персонажа"
            });
        }
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


/***/ }),

/***/ 5642:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const jwt = __webpack_require__(9344);
// Генерация JWT токена
const generateToken = (id)=>{
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
// Верификация JWT токена
const verifyToken = (token)=>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            valid: true,
            expired: false,
            decoded
        };
    } catch (error) {
        return {
            valid: false,
            expired: error.name === "TokenExpiredError",
            decoded: null
        };
    }
};
module.exports = {
    generateToken,
    verifyToken
};


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [974,991], () => (__webpack_exec__(4603)));
module.exports = __webpack_exports__;

})();