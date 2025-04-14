/**
 * Этот файл содержит временные патчи для модулей Clerk в мок-режиме
 * Используется только при сборке Docker-образа в мок-режиме
 */

module.exports = {
  // Заглушка для функции редиректа, которая вызывает ошибки в Edge Runtime
  redirect: () => null,
  
  // Заглушки для других проблемных функций
  parsePublishableKey: () => ({
    clerkJSUrl: 'https://clerk.browser.accounts.dev',
    clerkJSVariant: 'clerk-js',
    clerkJSVersion: '0.0.0-mock',
    frontendApi: 'clerk.mock.accounts.dev',
    proxyUrl: '',
    domain: 'clerk.accounts.dev',
    isSatellite: false,
    instanceType: 'production'
  }),
  
  // Простая проверка ключа - всегда возвращает true для мок-режима
  isPublishableKey: () => true,
  
  // Заглушка для функции atob, которая вызывает ошибки
  isomorphicAtob: (str) => 'mock'
}; 