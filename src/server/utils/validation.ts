/**
 * Утилиты валидации для защиты API-запросов
 */

// Ограничение длины
const MAX_STRING_LENGTH = 1000;
const MAX_EMAIL_LENGTH = 255;
const MAX_NAME_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 72; // bcrypt ограничение
const MIN_PASSWORD_LENGTH = 8;

// Регулярные выражения для валидации
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
const NAME_REGEX = /^[a-zA-Z0-9\s_-]{2,}$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

// Типы ошибок
type ValidationError = {
  field: string;
  message: string;
};

// Базовая функция валидации текста
export function validateString(
  value: unknown, 
  minLength: number = 1, 
  maxLength: number = MAX_STRING_LENGTH, 
  fieldName: string = 'value'
): ValidationError | null {
  if (typeof value !== 'string') {
    return { 
      field: fieldName, 
      message: `${fieldName} должно быть строкой` 
    };
  }

  const trimmed = value.trim();
  
  if (trimmed.length < minLength) {
    return { 
      field: fieldName, 
      message: `${fieldName} должно содержать не менее ${minLength} символов` 
    };
  }
  
  if (trimmed.length > maxLength) {
    return { 
      field: fieldName, 
      message: `${fieldName} должно содержать не более ${maxLength} символов` 
    };
  }
  
  return null;
}

// Валидация email
export function validateEmail(email: unknown): ValidationError | null {
  const baseError = validateString(email, 5, MAX_EMAIL_LENGTH, 'email');
  if (baseError) return baseError;
  
  const emailStr = (email as string).toLowerCase().trim();
  
  if (!EMAIL_REGEX.test(emailStr)) {
    return {
      field: 'email',
      message: 'Пожалуйста, введите корректный email'
    };
  }
  
  return null;
}

// Валидация пароля
export function validatePassword(password: unknown): ValidationError | null {
  const baseError = validateString(password, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, 'password');
  if (baseError) return baseError;
  
  const passwordStr = password as string;
  
  if (!PASSWORD_REGEX.test(passwordStr)) {
    return {
      field: 'password',
      message: 'Пароль должен содержать минимум 8 символов, включая буквы верхнего и нижнего регистра, цифры и специальные символы'
    };
  }
  
  return null;
}

// Валидация имени
export function validateName(name: unknown): ValidationError | null {
  const baseError = validateString(name, 2, MAX_NAME_LENGTH, 'name');
  if (baseError) return baseError;
  
  const nameStr = name as string;
  
  if (!NAME_REGEX.test(nameStr)) {
    return {
      field: 'name',
      message: 'Имя может содержать только буквы, цифры, пробелы, дефисы и подчеркивания'
    };
  }
  
  return null;
}

// Валидация URL
export function validateUrl(url: unknown): ValidationError | null {
  const baseError = validateString(url, 5, MAX_STRING_LENGTH, 'url');
  if (baseError) return baseError;
  
  const urlStr = url as string;
  
  if (!URL_REGEX.test(urlStr)) {
    return {
      field: 'url',
      message: 'Пожалуйста, введите корректный URL'
    };
  }
  
  return null;
}

// Проверка объекта на наличие только разрешенных полей
export function validateAllowedFields(
  obj: Record<string, unknown>,
  allowedFields: string[]
): ValidationError | null {
  const extraFields = Object.keys(obj).filter(key => !allowedFields.includes(key));
  
  if (extraFields.length > 0) {
    return {
      field: extraFields[0],
      message: `Недопустимое поле: ${extraFields[0]}`
    };
  }
  
  return null;
}

// Основная функция валидации формы
export function validateForm(
  data: Record<string, unknown>,
  validators: Record<string, (value: unknown) => ValidationError | null>,
  requiredFields: string[] = []
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Проверка обязательных полей
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || 
        (typeof data[field] === 'string' && (data[field] as string).trim() === '')) {
      errors.push({
        field,
        message: `Поле ${field} обязательно для заполнения`
      });
    }
  }
  
  // Применение валидаторов
  for (const [field, validator] of Object.entries(validators)) {
    if (data[field] !== undefined && data[field] !== null) {
      const error = validator(data[field]);
      if (error) {
        errors.push(error);
      }
    }
  }
  
  return errors;
}

// Сканирование объекта на наличие кода или потенциально вредоносного содержимого
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  const sanitized = { ...obj } as any;
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      // Удаление потенциально опасных конструкций (скрипты, HTML, SQL-инъекции)
      sanitized[key] = (sanitized[key] as string)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/('|")\s*;\s*DROP\s+TABLE/gi, '')
        .replace(/('|")\s*;\s*DELETE\s+FROM/gi, '')
        .replace(/('|")\s*;\s*INSERT\s+INTO/gi, '')
        .replace(/('|")\s*;\s*UPDATE\s+/gi, '');
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  
  return sanitized as T;
}

export default {
  validateString,
  validateEmail,
  validatePassword,
  validateName,
  validateUrl,
  validateAllowedFields,
  validateForm,
  sanitizeObject,
};