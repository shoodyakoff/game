/**
 * Скрипт для подготовки сборки в мок-режиме
 * Заменяет проблемные модули Clerk на заглушки
 */

const fs = require('fs');
const path = require('path');
const patches = require('../src/components/auth/patches');

// Пути к файлам, которые нужно пропатчить
const files = [
  // CJS модули
  {
    path: 'node_modules/@clerk/nextjs/dist/cjs/server/redirect.js',
    content: 'module.exports = { redirect: ' + patches.redirect.toString() + ' };'
  },
  // ESM модули
  {
    path: 'node_modules/@clerk/nextjs/dist/esm/server/redirect.js',
    content: 'export function redirect() { return null; }'
  },
  // Shared модули CJS
  {
    path: 'node_modules/@clerk/shared/dist/keys.js',
    patches: [
      {
        search: /function isomorphicAtob\(str\)[^}]+}/gs,
        replace: `function isomorphicAtob(str) { return 'mock'; }`
      },
      {
        search: /function isPublishableKey\([^}]+}/gs,
        replace: `function isPublishableKey(key) { return true; }`
      },
      {
        search: /function parsePublishableKey\([^}]+}/gs,
        replace: `function parsePublishableKey(key) { 
          return {
            clerkJSUrl: 'https://clerk.browser.accounts.dev',
            clerkJSVariant: 'clerk-js',
            clerkJSVersion: '0.0.0-mock',
            frontendApi: 'clerk.mock.accounts.dev',
            proxyUrl: '',
            domain: 'clerk.accounts.dev',
            isSatellite: false,
            instanceType: 'production'
          };
        }`
      }
    ]
  },
  // Модули с проблемными Node.js API в Edge Runtime
  {
    path: 'node_modules/@clerk/shared/dist/chunk-RSOCGYTF.mjs',
    content: `export default {}; 
export const MessageEvent = { prototype: {} };`
  },
  // Основной ESM модуль ClerkProvider
  {
    path: 'node_modules/@clerk/nextjs/dist/esm/index.js',
    content: `
// Мок-версия Clerk для избежания ошибок при сборке
export const ClerkProvider = ({children}) => children;
export const useUser = () => ({ isLoaded: true, isSignedIn: false, user: null });
export const useClerk = () => ({ signOut: () => {} });
export const SignIn = () => null;
export const SignUp = () => null;
export const UserButton = () => null;
`
  }
];

// Создаем директории, если они не существуют
function ensureDirExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
    console.log(`Создана директория: ${dirname}`);
  }
}

// Процесс патчинга
console.log('Начинаем патчинг модулей Clerk для мок-режима...');

files.forEach(file => {
  const filePath = path.resolve(process.cwd(), file.path);
  
  try {
    ensureDirExists(filePath);
    
    if (file.content) {
      // Полная замена файла
      fs.writeFileSync(filePath, file.content, 'utf-8');
      console.log(`Файл ${file.path} успешно заменен.`);
    } else if (file.patches) {
      // Частичная замена с использованием регулярных выражений
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = false;
        
        file.patches.forEach(patch => {
          if (patch.search.test(content)) {
            content = content.replace(patch.search, patch.replace);
            modified = true;
          }
        });
        
        if (modified) {
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`Файл ${file.path} успешно пропатчен.`);
        } else {
          console.log(`Файл ${file.path} не требует патчинга.`);
        }
      } else {
        console.log(`Файл ${file.path} не найден, создаем пустышку.`);
        fs.writeFileSync(filePath, '// Mock file for Clerk in mock mode', 'utf-8');
      }
    }
  } catch (error) {
    console.error(`Ошибка при патчинге файла ${file.path}:`, error);
  }
});

// Также создаем файл .env.local с настройками мок-режима
const envContent = `
# Настройки Clerk для мок-режима
NEXT_PUBLIC_CLERK_MOCK_MODE=true
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=mock_key_not_for_validation
CLERK_SECRET_KEY=mock_secret_key_not_used

# Настройки URL
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select

# Отключение проверки
NEXT_PUBLIC_CLERK_NO_VERIFICATION=true
`;

try {
  fs.writeFileSync('.env.local', envContent, 'utf-8');
  console.log('Файл .env.local успешно создан с настройками мок-режима.');
} catch (error) {
  console.error('Ошибка при создании файла .env.local:', error);
}

console.log('Патчинг модулей Clerk для мок-режима завершен.'); 