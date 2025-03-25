"use strict";
exports.id = 724;
exports.ids = [724];
exports.modules = {

/***/ 8724:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6022);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _store_slices_characterSlice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3845);
/* harmony import */ var _store_slices_authSlice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8696);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_store_slices_authSlice__WEBPACK_IMPORTED_MODULE_5__]);
_store_slices_authSlice__WEBPACK_IMPORTED_MODULE_5__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];






/**
 * Компонент для защиты маршрутов, требующих авторизации
 * Перенаправляет неавторизованных пользователей на страницу входа
 * и сохраняет исходный URL для возврата после авторизации
 */ const ProtectedRoute = ({ children , characterRequired =false  })=>{
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useDispatch)();
    const { isAuthenticated , loading  } = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useSelector)((state)=>state.auth);
    const selectedCharacter = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useSelector)(_store_slices_characterSlice__WEBPACK_IMPORTED_MODULE_4__/* .selectSelectedCharacter */ .BM);
    const [isInitialized, setIsInitialized] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    // Проверяем статус аутентификации при монтировании компонента
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const checkAuth = async ()=>{
            await dispatch((0,_store_slices_authSlice__WEBPACK_IMPORTED_MODULE_5__/* .checkAuthStatus */ .t0)());
            setIsInitialized(true);
        };
        checkAuth();
    }, [
        dispatch
    ]);
    // Выполняем перенаправление только после инициализации
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (!isInitialized) return;
        // Проверяем токен локально для предотвращения мигания при обновлении страницы
        const hasLocalToken =  false && 0;
        if (!loading && !isAuthenticated && !hasLocalToken) {
            // Сохраняем текущий URL для возврата после авторизации
            const returnUrl = encodeURIComponent(router.asPath);
            router.push(`/auth/login?returnUrl=${returnUrl}`);
        } else if (!loading && isAuthenticated && characterRequired && !selectedCharacter) {
            // Если требуется персонаж, но он не выбран, перенаправляем на страницу выбора
            // с указанием, куда вернуться после выбора
            const returnUrl = encodeURIComponent(router.asPath);
            // Всегда используем корректный URL для перенаправления
            const currentPath = router.asPath;
            // Проверяем, является ли текущий путь страницей "Играть" (проверяем как /dashboard, так и /levels)
            if (currentPath.includes("/dashboard") || currentPath.includes("/levels")) {
                router.push(`/character?redirectTo=/levels`);
            } else {
                router.push(`/character?redirectTo=${returnUrl}`);
            }
        }
    }, [
        loading,
        isAuthenticated,
        router,
        characterRequired,
        selectedCharacter,
        isInitialized
    ]);
    // Показываем пустой div во время загрузки или перенаправления
    if (loading || !isInitialized || !isAuthenticated && "undefined" !== "undefined" && 0 || characterRequired && !selectedCharacter) {
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: "min-h-screen bg-slate-900"
        });
    }
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: children
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProtectedRoute);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;