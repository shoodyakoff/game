"use strict";
exports.id = 845;
exports.ids = [845];
exports.modules = {

/***/ 3845:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BM": () => (/* binding */ selectSelectedCharacter),
/* harmony export */   "L3": () => (/* binding */ selectCharacter),
/* harmony export */   "SD": () => (/* binding */ initializeCharacter),
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports characterSlice, resetCharacter */
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5184);
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);

const initialState = {
    selectedCharacter: null
};
const characterSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({
    name: "character",
    initialState,
    reducers: {
        selectCharacter: (state, action)=>{
            state.selectedCharacter = action.payload;
            // Сохраняем выбор персонажа в localStorage для сохранения между сессиями
            if (false) {}
        },
        resetCharacter: (state)=>{
            state.selectedCharacter = null;
            if (false) {}
        }
    }
});
const { selectCharacter , resetCharacter  } = characterSlice.actions;
// Селекторы
const selectSelectedCharacter = (state)=>state.character.selectedCharacter;
// Создаем асинхронный thunk для инициализации персонажа из localStorage
const initializeCharacter = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)("character/initializeCharacter", async (_, { dispatch  })=>{
    if (false) {}
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (characterSlice.reducer);


/***/ })

};
;