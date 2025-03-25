"use strict";
exports.id = 402;
exports.ids = [402];
exports.modules = {

/***/ 5402:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ CharacterSelect)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6022);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _store_slices_characterSlice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3845);






// Создаём собственную кнопку, так как компонент Button не найден
const Button = ({ onClick , disabled , className , children  })=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
        onClick: onClick,
        disabled: disabled,
        className: `${className} ${disabled ? "bg-slate-600 text-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"} rounded-lg font-medium transition-colors`,
        children: children
    });
};
const characters = [
    {
        id: "product-lead",
        name: "Product Lead",
        image: "/characters/product-lead-full.png",
        icon: "/characters/product-lead-icon.png",
        description: "Фокусируется на стратегическом планировании и балансировании потребностей.",
        role: "Стратег",
        difficulty: "Нормальная",
        type: "product-lead",
        stats: {
            analytics: 7,
            communication: 7,
            strategy: 8,
            technical: 5,
            creativity: 5
        }
    },
    {
        id: "agile-coach",
        name: "Agile Coach",
        image: "/characters/agile-coach-full.png",
        icon: "/characters/agile-coach-icon.png",
        description: "Фокусируется на процессах и командной работе.",
        role: "Поддержка",
        difficulty: "Сложная",
        type: "agile-coach",
        stats: {
            analytics: 5,
            communication: 9,
            strategy: 6,
            technical: 4,
            creativity: 4,
            leadership: 8
        }
    },
    {
        id: "growth-hacker",
        name: "Growth Hacker",
        image: "/characters/growth-hacker-full.png",
        icon: "/characters/growth-hacker-icon.png",
        description: "Фокусируется на метриках и максимизации пользовательской базы.",
        role: "DPS",
        difficulty: "Экстрим",
        type: "growth-hacker",
        stats: {
            analytics: 9,
            communication: 4,
            strategy: 6,
            technical: 7,
            creativity: 7
        }
    },
    {
        id: "ux-visionary",
        name: "UX Visionary",
        image: "/characters/ux-visionary-full.png",
        icon: "/characters/ux-visionary-icon.png",
        description: "Фокусируется на пользовательском опыте и креативных решениях.",
        role: "Дизайнер",
        difficulty: "Легкая",
        type: "ux-visionary",
        stats: {
            analytics: 6,
            communication: 7,
            strategy: 5,
            technical: 4,
            creativity: 9
        }
    },
    {
        id: "tech-pm",
        name: "Tech PM",
        image: "/characters/tech-pm-full.png",
        icon: "/characters/tech-pm-icon.png",
        description: "Технически ориентированный PM с глубоким пониманием разработки.",
        role: "Гибрид",
        difficulty: "Сложная",
        type: "tech-pm",
        stats: {
            analytics: 6,
            communication: 5,
            strategy: 5,
            technical: 9,
            creativity: 5
        }
    }
];
const CharacterSelect = ()=>{
    const [selectedChar, setSelectedChar] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useDispatch)();
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();
    const { redirectTo  } = router.query;
    const currentCharacter = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useSelector)((state)=>state.character.selectedCharacter);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (currentCharacter) {
            setSelectedChar(currentCharacter.id);
        }
    }, [
        currentCharacter
    ]);
    const handleSelectCharacter = (character)=>{
        setSelectedChar(character.id);
    };
    const handleConfirm = ()=>{
        if (selectedChar) {
            const character = characters.find((c)=>c.id === selectedChar);
            if (character) {
                dispatch((0,_store_slices_characterSlice__WEBPACK_IMPORTED_MODULE_5__/* .selectCharacter */ .L3)(character));
                // Если есть redirectTo, перенаправляем на эту страницу
                if (redirectTo && typeof redirectTo === "string") {
                    router.push(decodeURIComponent(redirectTo));
                } else {
                    // Всегда перенаправляем на /levels (страница "Играть")
                    router.push("/levels");
                }
            }
        }
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "py-6",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "grid grid-cols-1 md:grid-cols-5 gap-4 mb-8",
                children: characters.map((character)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: `bg-slate-800 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-700 ${selectedChar === character.id ? "ring-2 ring-blue-500 transform scale-105" : ""}`,
                        style: {
                            width: "calc(100% + 50px)",
                            marginLeft: "-25px",
                            paddingTop: "30px",
                            paddingBottom: "30px"
                        },
                        onClick: ()=>handleSelectCharacter(character),
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "w-24 h-24 flex items-center justify-center mb-4",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_2___default()), {
                                        src: character.image,
                                        alt: character.name,
                                        width: 96,
                                        height: 96,
                                        className: "object-contain",
                                        style: {
                                            display: "block",
                                            margin: "0 auto",
                                            height: "120px",
                                            objectFit: "contain",
                                            objectPosition: "center"
                                        }
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                    className: "text-lg font-bold text-white mb-1",
                                    children: character.name
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                    className: "text-xs text-gray-300 mb-2",
                                    children: [
                                        character.role,
                                        " • ",
                                        character.difficulty
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: "text-gray-300 text-center text-xs mb-3",
                                    children: character.description
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "w-full",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "grid grid-cols-1 gap-1 text-xs",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                        className: "text-gray-400",
                                                        children: "Аналитика:"
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                        className: "text-indigo-300 ml-1",
                                                        children: [
                                                            character.stats.analytics,
                                                            "/10"
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                        className: "text-gray-400",
                                                        children: "Коммуникация:"
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                        className: "text-indigo-300 ml-1",
                                                        children: [
                                                            character.stats.communication,
                                                            "/10"
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                        className: "text-gray-400",
                                                        children: "Стратегия:"
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                        className: "text-indigo-300 ml-1",
                                                        children: [
                                                            character.stats.strategy,
                                                            "/10"
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                        className: "text-gray-400",
                                                        children: "Технические:"
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                        className: "text-indigo-300 ml-1",
                                                        children: [
                                                            character.stats.technical,
                                                            "/10"
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                        className: "text-gray-400",
                                                        children: "Креативность:"
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                        className: "text-indigo-300 ml-1",
                                                        children: [
                                                            character.stats.creativity,
                                                            "/10"
                                                        ]
                                                    })
                                                ]
                                            }),
                                            character.stats.leadership && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                        className: "text-gray-400",
                                                        children: "Лидерство:"
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                        className: "text-indigo-300 ml-1",
                                                        children: [
                                                            character.stats.leadership,
                                                            "/10"
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    }, character.id))
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "flex justify-center",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Button, {
                    onClick: handleConfirm,
                    disabled: !selectedChar,
                    className: "px-8 py-3",
                    children: "Подтвердить выбор"
                })
            })
        ]
    });
};


/***/ })

};
;