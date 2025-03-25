"use strict";
exports.id = 696;
exports.ids = [696];
exports.modules = {

/***/ 8696:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "fw": () => (/* binding */ clearError),
/* harmony export */   "jo": () => (/* binding */ getMe),
/* harmony export */   "kS": () => (/* binding */ logout),
/* harmony export */   "t0": () => (/* binding */ checkAuthStatus),
/* harmony export */   "x4": () => (/* binding */ login),
/* harmony export */   "z2": () => (/* binding */ register)
/* harmony export */ });
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5184);
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9648);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_1__]);
axios__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


// API URL
const API_URL = "http://localhost:3000/api" || 0;
// Асинхронные действия
const login = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)("auth/login", async ({ email , password , remember =false  }, { rejectWithValue  })=>{
    try {
        const response = await axios__WEBPACK_IMPORTED_MODULE_1__["default"].post(`${API_URL}/auth/login`, {
            email,
            password
        });
        // Сохраняем в localStorage всегда, чтобы сессия сохранялась между обновлениями страницы
        if (false) {}
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Ошибка входа. Пожалуйста, проверьте введенные данные.");
    }
});
const register = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)("auth/register", async ({ username , email , password  }, { rejectWithValue  })=>{
    try {
        const response = await axios__WEBPACK_IMPORTED_MODULE_1__["default"].post(`${API_URL}/auth/register`, {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка регистрации:", error);
        // Детальное логирование ошибки
        if (error.response) {
            // Сервер вернул ответ с кодом ошибки
            console.error("Ответ сервера:", error.response.data);
            console.error("Статус ответа:", error.response.status);
            console.error("Заголовки ответа:", error.response.headers);
        } else if (error.request) {
            // Запрос был сделан, но нет ответа
            console.error("Запрос без ответа:", error.request);
        } else {
            // Что-то другое вызвало ошибку
            console.error("Сообщение об ошибке:", error.message);
        }
        return rejectWithValue(error.response?.data?.message || "Ошибка при регистрации");
    }
});
const getMe = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)("auth/getMe", async (_, { rejectWithValue , getState  })=>{
    try {
        // Получаем токен из state
        const state = getState();
        const token = state.auth.token;
        if (!token) {
            throw new Error("Токен не найден");
        }
        // Отправляем запрос с токеном
        const response = await axios__WEBPACK_IMPORTED_MODULE_1__["default"].get(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Не удалось получить данные пользователя");
    }
});
const checkAuthStatus = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)("auth/checkAuthStatus", async (_, { dispatch , getState  })=>{
    if (false) {}
});
// Получение пользователя из localStorage, если он есть
// Безопасно получаем данные из localStorage только на клиенте
const getAuthStateFromStorage = ()=>{
    if (true) {
        // На сервере возвращаем пустые значения
        return {
            user: null,
            token: null,
            isAuthenticated: false,
            hasCharacter: false
        };
    }
    // На клиенте пытаемся получить данные из localStorage
    try {
        const token = localStorage.getItem("token");
        const userJson = localStorage.getItem("user");
        let user = null;
        if (userJson) {
            user = JSON.parse(userJson);
        }
        return {
            user,
            token,
            isAuthenticated: !!token,
            hasCharacter: user?.hasCharacter || false
        };
    } catch (error) {
        console.error("Ошибка при получении данных из localStorage", error);
        return {
            user: null,
            token: null,
            isAuthenticated: false,
            hasCharacter: false
        };
    }
};
// Начальное состояние
const initialState = {
    ...getAuthStateFromStorage(),
    loading: false,
    error: null
};
// Slice
const authSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({
    name: "auth",
    initialState,
    reducers: {
        logout: (state)=>{
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            state.hasCharacter = false;
            // Очищаем localStorage при выходе
            if (false) {}
        },
        clearError: (state)=>{
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        // Обработка login
        builder.addCase(login.pending, (state)=>{
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.hasCharacter = action.payload.hasCharacter || false;
        });
        builder.addCase(login.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload || "Ошибка входа";
        });
        // Обработка register
        builder.addCase(register.pending, (state)=>{
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.hasCharacter = action.payload.hasCharacter || false;
            // Сохраняем в localStorage
            if (false) {}
        });
        builder.addCase(register.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload || "Ошибка регистрации";
        });
        // Обработка getMe
        builder.addCase(getMe.pending, (state)=>{
            state.loading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        });
        builder.addCase(getMe.rejected, (state, action)=>{
            state.loading = false;
            // Если ошибка аутентификации, выходим из системы
            if (action.payload === "Токен не найден" || action.payload === "Недействительный токен" || action.payload === "Токен истек") {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.hasCharacter = false;
                if (false) {}
            }
        });
    }
});
const { logout , clearError  } = authSlice.actions;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (authSlice.reducer);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;