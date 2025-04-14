#!/bin/bash
# Скрипт для ручного патчинга проблемных модулей Clerk
# Запускать перед сборкой Docker на сервере

set -e  # Прерывать выполнение при первой ошибке

echo "Начинаю патчинг модулей Clerk для мок-режима..."

# Определяем базовый путь для модулей
BASE_PATH="node_modules/@clerk"

# 1. Патчим CJS/redirect.js
REDIRECT_CJS_PATH="${BASE_PATH}/nextjs/dist/cjs/server/redirect.js"
mkdir -p $(dirname "$REDIRECT_CJS_PATH")
echo 'module.exports = { redirect: () => null };' > "$REDIRECT_CJS_PATH"
echo "Пропатчен $REDIRECT_CJS_PATH"

# 2. Патчим ESM/redirect.js 
REDIRECT_ESM_PATH="${BASE_PATH}/nextjs/dist/esm/server/redirect.js"
mkdir -p $(dirname "$REDIRECT_ESM_PATH")
echo 'export function redirect() { return null; }' > "$REDIRECT_ESM_PATH"
echo "Пропатчен $REDIRECT_ESM_PATH"

# 3. Патчим keys.js
KEYS_PATH="${BASE_PATH}/shared/dist/keys.js"
mkdir -p $(dirname "$KEYS_PATH")
cat > "$KEYS_PATH" << 'EOF'
// Патч для keys.js
module.exports = { 
  isomorphicAtob: () => "mock", 
  isPublishableKey: () => true, 
  parsePublishableKey: () => ({ 
    clerkJSUrl: "https://clerk.browser.accounts.dev", 
    clerkJSVariant: "clerk-js", 
    clerkJSVersion: "0.0.0-mock", 
    frontendApi: "clerk.mock.accounts.dev", 
    proxyUrl: "", 
    domain: "clerk.accounts.dev", 
    isSatellite: false, 
    instanceType: "production" 
  })
};
EOF
echo "Пропатчен $KEYS_PATH"

# 4. Патчим chunk-RSOCGYTF.mjs
CHUNK_PATH="${BASE_PATH}/shared/dist/chunk-RSOCGYTF.mjs"
mkdir -p $(dirname "$CHUNK_PATH")
echo 'export default {}; export const MessageEvent = { prototype: {} };' > "$CHUNK_PATH" 
echo "Пропатчен $CHUNK_PATH"

# 5. Патчим основной модуль Clerk для ESM
INDEX_ESM_PATH="${BASE_PATH}/nextjs/dist/esm/index.js"
if [ -f "$INDEX_ESM_PATH" ]; then
  # Сохраняем копию
  cp "$INDEX_ESM_PATH" "${INDEX_ESM_PATH}.bak"
fi

mkdir -p $(dirname "$INDEX_ESM_PATH")
cat > "$INDEX_ESM_PATH" << 'EOF'
// Мок-версия Clerk для избежания ошибок при сборке
export const ClerkProvider = ({children}) => children;
export const useUser = () => ({ isLoaded: true, isSignedIn: false, user: null });
export const useClerk = () => ({ signOut: () => {} });
export const SignIn = () => null;
export const SignUp = () => null;
export const UserButton = () => null;
EOF
echo "Пропатчен $INDEX_ESM_PATH"

# 6. Создаем локальные .env файлы
cat > .env.local << 'EOF'
# Настройки Clerk для мок-режима
NEXT_PUBLIC_CLERK_MOCK_MODE=true
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=mock_key_not_for_validation
CLERK_SECRET_KEY=mock_secret_key_not_used
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/character/select
NEXT_PUBLIC_CLERK_NO_VERIFICATION=true
EOF
echo "Создан .env.local с настройками мок-режима"

echo "Патчинг модулей Clerk завершен!"
echo "Теперь можно запускать сборку Docker: docker-compose -f docker-compose.prod.yml up -d --build" 