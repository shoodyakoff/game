/**
 * Скрипт для подготовки сборки в мок-режиме
 * Заменяет проблемные модули Clerk на заглушки
 */

const fs = require('fs');
const path = require('path');
const patches = require('../src/components/auth/patches');

// Пути к файлам, которые нужно пропатчить
const files = [
  {
    path: 'node_modules/@clerk/nextjs/dist/cjs/server/redirect.js',
    content: 'module.exports = { redirect: ' + patches.redirect.toString() + ' };'
  },
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

console.log('Патчинг модулей Clerk для мок-режима завершен.'); 