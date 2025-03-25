"use strict";
(() => {
var exports = {};
exports.id = 985;
exports.ids = [985,748];
exports.modules = {

/***/ 3227:
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ 7449:
/***/ ((module) => {

module.exports = require("next-auth/providers/credentials");

/***/ }),

/***/ 945:
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
    // Только метод GET
    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Метод не разрешен"
        });
    }
    try {
        // Здесь будет получение данных из базы данных
        // Пока используем моковые данные
        const analysisData = {
            user_feedback: [
                {
                    id: 1,
                    user: "Александр П.",
                    rating: 3,
                    text: "Приложение в целом хорошее, но создание новых задач занимает слишком много времени. Нужно заполнить много обязательных полей, даже для простых задач.",
                    date: "2023-02-15"
                },
                {
                    id: 2,
                    user: "Ирина К.",
                    rating: 2,
                    text: "Процесс создания задачи очень запутанный. Почему я должна указывать все эти параметры для простой задачи? Перешла на другое приложение.",
                    date: "2023-02-10"
                },
                {
                    id: 3,
                    user: "Николай С.",
                    rating: 4,
                    text: "TaskMaster - отличное приложение для сложных проектов, но для простых задач процесс слишком громоздкий. Нужна возможность быстрого создания простых задач.",
                    date: "2023-02-08"
                },
                {
                    id: 4,
                    user: "Анастасия М.",
                    rating: 3,
                    text: "Я постоянно забываю, как создавать задачи в этом приложении. Интерфейс не интуитивный и требует слишком много кликов.",
                    date: "2023-02-01"
                },
                {
                    id: 5,
                    user: "Дмитрий Л.",
                    rating: 2,
                    text: "Я не могу быстро добавить задачу на ходу. Слишком много полей, слишком много экранов. Нужно упростить процесс.",
                    date: "2023-01-25"
                }
            ],
            analytics: {
                task_creation: {
                    total_attempts: 1250,
                    completed: 870,
                    abandoned: 380,
                    completion_rate: 69.6,
                    avg_time_seconds: 124,
                    by_device: {
                        desktop: {
                            attempts: 750,
                            completed: 578,
                            rate: 77.1
                        },
                        mobile: {
                            attempts: 500,
                            completed: 292,
                            rate: 58.4
                        }
                    },
                    drop_off_points: [
                        {
                            step: "Начальный экран",
                            drop_rate: 5
                        },
                        {
                            step: "Заполнение основной информации",
                            drop_rate: 12
                        },
                        {
                            step: "Выбор категории",
                            drop_rate: 25
                        },
                        {
                            step: "Настройка приоритета",
                            drop_rate: 18
                        },
                        {
                            step: "Добавление дополнительных параметров",
                            drop_rate: 35
                        },
                        {
                            step: "Подтверждение создания",
                            drop_rate: 5
                        }
                    ]
                },
                user_retention: {
                    overall: 65,
                    users_with_task_creation_issues: 42
                }
            },
            interface: {
                current_flow: [
                    {
                        step: 1,
                        name: "Главный экран",
                        description: 'Пользователь должен нажать на кнопку "+" в нижнем правом углу экрана.'
                    },
                    {
                        step: 2,
                        name: "Выбор типа задачи",
                        description: "Пользователь должен выбрать тип задачи: обычная, проект, напоминание или событие."
                    },
                    {
                        step: 3,
                        name: "Основная информация",
                        description: "Заполнение названия, описания и срока выполнения задачи."
                    },
                    {
                        step: 4,
                        name: "Выбор категории",
                        description: "Пользователь должен выбрать категорию из списка или создать новую."
                    },
                    {
                        step: 5,
                        name: "Настройка приоритета",
                        description: "Выбор приоритета задачи с помощью ползунка или выпадающего списка."
                    },
                    {
                        step: 6,
                        name: "Дополнительные параметры",
                        description: "Настройка повторения, напоминаний, вложений и других параметров."
                    },
                    {
                        step: 7,
                        name: "Подтверждение",
                        description: "Проверка информации и подтверждение создания задачи."
                    }
                ],
                screenshots: [
                    "/images/levels/1/interface_step1.png",
                    "/images/levels/1/interface_step2.png",
                    "/images/levels/1/interface_step3.png",
                    "/images/levels/1/interface_step4.png",
                    "/images/levels/1/interface_step5.png",
                    "/images/levels/1/interface_step6.png",
                    "/images/levels/1/interface_step7.png"
                ]
            },
            interviews: [
                {
                    person: "Евгений, 32 года, менеджер",
                    feedback: [
                        "Я использую приложение для отслеживания рабочих задач",
                        "Процесс создания задачи слишком сложный для моих потребностей",
                        "Часто создаю простые задачи, которые не требуют всех этих параметров",
                        "Хотел бы иметь возможность быстрого создания задач с минимальной информацией",
                        "Мне нравится функционал, но из-за сложности создания задач часто пользуюсь блокнотом для быстрых заметок"
                    ]
                },
                {
                    person: "Анна, 28 лет, дизайнер",
                    feedback: [
                        "Я очень визуальный человек, и мне не нравится текущий интерфейс",
                        "Слишком много текстовых полей и мало визуальных подсказок",
                        "Не понимаю, почему нельзя сделать процесс более интерактивным",
                        "Для создания простой задачи нужно пройти слишком много шагов",
                        'Хотела бы видеть подход "drag-and-drop" для организации задач'
                    ]
                },
                {
                    person: "Сергей, 45 лет, руководитель проектов",
                    feedback: [
                        "Мне нужно создавать и назначать много задач своей команде",
                        "Текущий процесс занимает слишком много времени",
                        "Хотел бы иметь возможность создания шаблонов для повторяющихся типов задач",
                        "Интерфейс не подходит для быстрого создания нескольких задач подряд",
                        "В мобильной версии приложения создавать задачи особенно сложно"
                    ]
                }
            ]
        };
        return res.status(200).json(analysisData);
    } catch (error) {
        console.error("Ошибка при получении данных для анализа:", error);
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
var __webpack_exports__ = __webpack_require__.X(0, [355], () => (__webpack_exec__(945)));
module.exports = __webpack_exports__;

})();