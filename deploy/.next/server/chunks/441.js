"use strict";
exports.id = 441;
exports.ids = [441];
exports.modules = {

/***/ 5441:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const crypto = __webpack_require__(6113);
const User = __webpack_require__(5705);
// @desc    Обработка запроса на восстановление пароля
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res)=>{
    try {
        const { email  } = req.body;
        // Поиск пользователя по email
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Пользователь с таким email не найден"
            });
        }
        // Генерация токена для сброса пароля
        const resetToken = crypto.randomBytes(20).toString("hex");
        // Хешируем токен для хранения в базе данных
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        // Устанавливаем токен для сброса пароля и срок его действия (1 час)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 час
        await user.save();
        // Создаем ссылку для сброса пароля
        const resetUrl = `${"http://localhost:3000"}/auth/forgot-password/reset?token=${resetToken}`;
        // В реальном приложении здесь отправляется email
        // Для демонстрации, мы просто возвращаем ссылку и сообщение об успехе
        console.log(`Reset URL: ${resetUrl}`);
        res.status(200).json({
            success: true,
            message: "Инструкции для восстановления пароля отправлены на ваш email",
            data: {
                resetUrl
            }
        });
    } catch (error) {
        console.error("Ошибка восстановления пароля:", error);
        res.status(500).json({
            success: false,
            message: "Не удалось отправить email для восстановления пароля"
        });
    }
};
// @desc    Проверка токена восстановления пароля
// @route   GET /api/auth/forgot-password/verify
// @access  Public
const verifyResetToken = async (req, res)=>{
    try {
        // Получаем токен из запроса
        const { token  } = req.query;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Отсутствует токен сброса пароля"
            });
        }
        // Хешируем токен для сравнения с сохраненным в базе
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        // Ищем пользователя с действующим токеном
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {
                $gt: Date.now()
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Недействительный или истекший токен для сброса пароля"
            });
        }
        // Токен действителен
        res.status(200).json({
            success: true,
            message: "Токен действителен"
        });
    } catch (error) {
        console.error("Ошибка проверки токена:", error);
        res.status(500).json({
            success: false,
            message: "Внутренняя ошибка сервера"
        });
    }
};
// @desc    Сброс пароля с использованием токена
// @route   POST /api/auth/forgot-password/reset
// @access  Public
const resetPassword = async (req, res)=>{
    try {
        const { token , password  } = req.body;
        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Необходимо указать токен и новый пароль"
            });
        }
        // Хешируем токен для сравнения с сохраненным в базе
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        // Ищем пользователя с действующим токеном
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {
                $gt: Date.now()
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Недействительный или истекший токен для сброса пароля"
            });
        }
        // Устанавливаем новый пароль и очищаем поля токена
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Пароль успешно изменен"
        });
    } catch (error) {
        console.error("Ошибка сброса пароля:", error);
        res.status(500).json({
            success: false,
            message: "Не удалось сбросить пароль"
        });
    }
};
module.exports = {
    forgotPassword,
    verifyResetToken,
    resetPassword
};


/***/ })

};
;