"use strict";
(() => {
var exports = {};
exports.id = 700;
exports.ids = [700,748];
exports.modules = {

/***/ 3227:
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ 7449:
/***/ ((module) => {

module.exports = require("next-auth/providers/credentials");

/***/ }),

/***/ 6260:
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
        const { finalDecision , timeSpent  } = req.body;
        // Проверяем обязательные поля
        if (!finalDecision) {
            return res.status(400).json({
                error: "Не указаны обязательные поля: finalDecision"
            });
        }
        // В реальной реализации здесь мы бы обновляли статус уровня и выдавали награды в базе данных
        // Сейчас просто имитируем успешное завершение
        console.log(`Завершение уровня 1 для пользователя ${session.user.email}. Решение: ${finalDecision}, время: ${timeSpent || "не указано"}`);
        // Определяем награды на основе принятого решения и типа персонажа
        // В реальной реализации это была бы более сложная логика
        let experience = 100; // базовый опыт
        const achievement = "Первый рабочий день";
        let itemReward = "Базовая заметка";
        let nextLevelUnlocked = true;
        // В реальной реализации здесь мы бы проверяли соответствие выбранного решения типу персонажа
        if (req.body.characterType === "ux-visionary" && finalDecision === "ux_focused" || req.body.characterType === "growth-hacker" && finalDecision === "data_driven" || req.body.characterType === "product-lead" && finalDecision === "balanced") {
            // Бонус за выбор подходящего для персонажа решения
            experience += 50;
            itemReward = "Улучшенная заметка";
        }
        // Возвращаем результаты и награды
        return res.status(200).json({
            success: true,
            levelCompleted: true,
            rewards: {
                experience,
                achievement,
                item: itemReward
            },
            nextLevelUnlocked,
            summary: {
                decision: finalDecision,
                timeSpent: timeSpent || "не указано",
                outcome: getOutcomeForDecision(finalDecision)
            }
        });
    } catch (error) {
        console.error("Ошибка при завершении уровня:", error);
        return res.status(500).json({
            error: "Внутренняя ошибка сервера"
        });
    }
}
// Вспомогательная функция для получения описания результатов решения
function getOutcomeForDecision(decision) {
    switch(decision){
        case "ux_focused":
            return "Вы выбрали полную переработку интерфейса. Пользователи очень довольны новым интерфейсом, но реализация заняла больше времени и ресурсов.";
        case "data_driven":
            return "Вы выбрали оптимизацию на основе данных. Удалось быстро улучшить ключевые метрики конверсии, но некоторые пользователи все еще недовольны сложностью интерфейса.";
        case "balanced":
            return "Вы выбрали сбалансированный подход. Получилось хорошее соотношение между улучшением пользовательского опыта и эффективным использованием ресурсов компании.";
        default:
            return "Результаты вашего решения неоднозначны. Команда продолжает работу над улучшением продукта.";
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [355], () => (__webpack_exec__(6260)));
module.exports = __webpack_exports__;

})();