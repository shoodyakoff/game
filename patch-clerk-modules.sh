#!/bin/bash
# Скрипт для патчинга модулей Clerk для избежания ошибок в мок-режиме

set -e  # Останавливаем скрипт при ошибках

echo "🔧 Патчинг модулей Clerk..."

# Создаем директории для патча, если они не существуют
mkdir -p ./node_modules/@clerk/shared/dist
mkdir -p ./node_modules/@clerk/nextjs/dist/cjs/server
mkdir -p ./node_modules/@clerk/nextjs/dist/esm

# Патчим keys.js для обхода ошибки atob
echo "Патчинг keys.js..."
cat > ./node_modules/@clerk/shared/dist/keys.js << 'EOL'
// Пропатченный модуль keys.js
// Избегаем ошибки с atob в мок-режиме

export function isomorphicAtob(str) { 
  return "mock-atob-result"; 
}

export function isPublishableKey() { 
  return true; 
}

export function parsePublishableKey() { 
  return { 
    frontendApi: "clerk.example.com", 
    instanceType: "test" 
  }; 
}
EOL

# Патчим redirect.js для избежания проблем с валидацией ключа
echo "Патчинг redirect.js (CJS версия)..."
cat > ./node_modules/@clerk/nextjs/dist/cjs/server/redirect.js << 'EOL'
// Пропатченный модуль redirect.js
"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redirect = void 0;

const redirect = (to) => {
  console.log("Mock redirect to:", to);
  // Просто заглушка, которая не будет пытаться валидировать ключи
  return {};
};

exports.redirect = redirect;
EOL

# Патчим chunk-RSOCGYTF.mjs
echo "Патчинг chunk-RSOCGYTF.mjs..."
mkdir -p ./node_modules/@clerk/shared/dist
cat > ./node_modules/@clerk/shared/dist/chunk-RSOCGYTF.mjs << 'EOL'
// Пропатченный модуль chunk-RSOCGYTF.mjs
// Избегаем ошибки с MessageEvent в Edge Runtime

// Это заглушка для проблемных модулей
export const createClerkClientObject = () => ({
  mockKey: true,
  version: 'mocked'
});

export const getClerkApiUrl = () => 'https://api.clerk.dev';

export const isHttpOrHttps = (url) => true;
EOL

# Создаем минимальную версию Clerk NextJS для мок-режима
echo "Создание минимальной версии индексного файла Clerk..."
cat > ./node_modules/@clerk/nextjs/dist/esm/index.js << 'EOL'
// Минимальная мок-версия @clerk/nextjs
// Предоставляет только необходимые компоненты и функции

import React from 'react';

// Мок компонентов
export const ClerkProvider = ({children}) => React.createElement(React.Fragment, null, children);
export const SignIn = () => React.createElement('div', null, 'Mock SignIn Component');
export const SignUp = () => React.createElement('div', null, 'Mock SignUp Component');
export const SignedIn = ({children}) => React.createElement(React.Fragment, null, children);
export const SignedOut = () => React.createElement(React.Fragment, null, null);
export const UserButton = () => React.createElement('button', null, 'User');

// Мок хуков
export const useUser = () => ({ 
  isLoaded: true, 
  isSignedIn: true, 
  user: {
    id: 'mock-user-id',
    firstName: 'Mock',
    lastName: 'User',
    username: 'mockuser',
    imageUrl: 'https://via.placeholder.com/150',
    fullName: 'Mock User',
  }
});

export const useAuth = () => ({
  isLoaded: true,
  isSignedIn: true,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve()
});

// Мок серверных функций
export const getAuth = () => ({
  userId: 'mock-user-id',
  sessionId: 'mock-session-id',
  getToken: () => Promise.resolve('mock-token'),
});

export const auth = () => ({
  userId: 'mock-user-id',
  sessionId: 'mock-session-id',
  getToken: () => Promise.resolve('mock-token'),
  protect: () => ({})
});

export const clerkClient = {
  users: {
    getUser: () => Promise.resolve({
      id: 'mock-user-id',
      firstName: 'Mock',
      lastName: 'User',
      username: 'mockuser',
      imageUrl: 'https://via.placeholder.com/150',
    }),
    getUserList: () => Promise.resolve([{
      id: 'mock-user-id',
      firstName: 'Mock',
      lastName: 'User',
      username: 'mockuser', 
      imageUrl: 'https://via.placeholder.com/150',
    }])
  }
};

// Также экспортируем для ESM версии
export const redirectToSignIn = () => {};
export const withClerkMiddleware = (middleware) => middleware;
export const authMiddleware = (options) => (req) => req;
EOL

echo "Создание ESM версии индексного файла..."
cp ./node_modules/@clerk/nextjs/dist/esm/index.js ./node_modules/@clerk/nextjs/dist/esm/index.mjs

echo "✅ Патчинг модулей Clerk завершен успешно!" 