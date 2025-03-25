"use strict";
(() => {
var exports = {};
exports.id = 19;
exports.ids = [19,748];
exports.modules = {

/***/ 3227:
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ 7449:
/***/ ((module) => {

module.exports = require("next-auth/providers/credentials");

/***/ }),

/***/ 7005:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3227);
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _auth_nextauth___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8355);


async function handler(req, res) {
    // Проверка авторизации
    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_0__.getServerSession)(req, res, _auth_nextauth___WEBPACK_IMPORTED_MODULE_1__.authOptions);
    if (!session) {
        return res.status(401).json({
            error: "Необходима авторизация"
        });
    }
    // Только метод POST
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Метод не разрешен"
        });
    }
    try {
        const { stage , progress , decisions =[]  } = req.body;
        // Проверяем обязательные поля
        if (stage === undefined || progress === undefined) {
            return res.status(400).json({
                error: "Не указаны обязательные поля: stage, progress"
            });
        }
        // В реальной реализации здесь мы бы сохраняли прогресс в базе данных
        // Сейчас просто имитируем успешное сохранение
        console.log(`Сохранение прогресса для пользователя ${session.user.email}: уровень 1, этап ${stage}, прогресс ${progress}%, решения:`, decisions);
        // Возвращаем обновленный статус прогресса
        return res.status(200).json({
            success: true,
            stage,
            progress,
            decisions,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Ошибка при сохранении прогресса:", error);
        return res.status(500).json({
            error: "Внутренняя ошибка сервера"
        });
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [355], () => (__webpack_exec__(7005)));
module.exports = __webpack_exports__;

})();