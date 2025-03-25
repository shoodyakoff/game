"use strict";
exports.id = 446;
exports.ids = [446];
exports.modules = {

/***/ 7446:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const User = __webpack_require__(5705);
const { generateToken  } = __webpack_require__(5642);
// @desc    Регистрация пользователя
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res)=>{
    try {
        const { username , email , password  } = req.body;
        console.log("Регистрация пользователя:", {
            username,
            email
        });
        // Проверка на наличие пользователя с таким email
        const userExists = await User.findOne({
            email
        });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Пользователь с таким email уже существует"
            });
        }
        // Создание пользователя
        console.log("Создание пользователя в базе данных...");
        const user = await User.create({
            username,
            email,
            password,
            avatar: "/images/characters/icons/default.png"
        });
        console.log("Пользователь создан:", user._id);
        // Создание токена
        const token = generateToken(user._id);
        // Обновляем дату последнего входа
        user.last_login = Date.now();
        await user.save();
        // Отправляем ответ
        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                hasCharacter: user.hasCharacter || false
            },
            token
        });
    } catch (error) {
        console.error("Ошибка регистрации:", error.message);
        console.error("Полная ошибка:", error);
        res.status(500).json({
            success: false,
            message: "Ошибка сервера при регистрации: " + error.message
        });
    }
};
// @desc    Вход пользователя
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res)=>{
    try {
        const { email , password  } = req.body;
        // Проверка наличия email и пароля
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Пожалуйста, укажите email и пароль"
            });
        }
        // Найти пользователя по email
        const user = await User.findOne({
            email
        }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Неверный email или пароль"
            });
        }
        // Проверка пароля
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Неверный email или пароль"
            });
        }
        // Создание токена
        const token = generateToken(user._id);
        // Обновляем дату последнего входа
        user.last_login = Date.now();
        await user.save();
        // Отправляем ответ
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                hasCharacter: user.hasCharacter || false
            },
            token
        });
    } catch (error) {
        console.error("Ошибка входа:", error);
        res.status(500).json({
            success: false,
            message: "Ошибка сервера при входе"
        });
    }
};
// @desc    Получить текущего пользователя
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res)=>{
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                hasCharacter: user.hasCharacter || false
            }
        });
    } catch (error) {
        console.error("Ошибка получения данных пользователя:", error);
        res.status(500).json({
            success: false,
            message: "Ошибка сервера при получении данных пользователя"
        });
    }
};
module.exports = {
    register,
    login,
    getMe
};


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