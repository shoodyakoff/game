/**
 * Скрипт для синхронизации локальной базы данных с MongoDB Atlas
 * Скачивает данные из продакшена в локальную БД
 * Запуск: node scripts/sync-db.js
 * Требуется: MongoDB Tools (mongodump, mongorestore)
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
require('dotenv').config({ path: '.env.local' });

// Настройки MongoDB - загружаем из переменных окружения
// ВАЖНО: Перед использованием необходимо создать файл .env.sync с реальными данными
// и добавить его в .gitignore, чтобы случайно не закоммитить
const envPath = path.join(__dirname, '../.env.sync');
if (!fs.existsSync(envPath)) {
  console.error('❌ Файл .env.sync не найден!');
  console.error('Создайте файл .env.sync со следующим содержимым:');
  console.error('MONGO_ATLAS_URI=mongodb+srv://username:password@cluster...');
  console.error('LOCAL_MONGO_URI=mongodb://localhost:27017/game-portal');
  process.exit(1);
}

require('dotenv').config({ path: envPath });

const ATLAS_URI = process.env.MONGO_ATLAS_URI;
const LOCAL_URI = process.env.LOCAL_MONGO_URI || 'mongodb://localhost:27017/game-portal';
const BACKUP_DIR = path.join(__dirname, '../backup');
const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'db_sync.log');

if (!ATLAS_URI) {
  console.error('❌ Не указан URI для MongoDB Atlas в переменной MONGO_ATLAS_URI!');
  process.exit(1);
}

// Создание директории для логов
function createLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

// Функция для логирования
function logMessage(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  console[isError ? 'error' : 'log'](message);
  
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (err) {
    console.error(`Ошибка при записи в лог: ${err.message}`);
  }
}

// Проверка наличия необходимых инструментов
function checkPrerequisites() {
  return new Promise((resolve, reject) => {
    exec('mongodump --version', (error) => {
      if (error) {
        const errorMsg = '❌ MongoDB Tools не найдены. Установите MongoDB Tools:';
        logMessage(errorMsg, true);
        logMessage('   - macOS: brew install mongodb-database-tools', true);
        logMessage('   - Windows: https://www.mongodb.com/try/download/database-tools', true);
        logMessage('   - Linux: sudo apt install mongodb-database-tools', true);
        reject(new Error('MongoDB Tools не установлены'));
      } else {
        logMessage('✅ MongoDB Tools найдены');
        resolve();
      }
    });
  });
}

// Создание директории для бэкапа
function createBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    logMessage(`📁 Создана директория для бэкапа: ${BACKUP_DIR}`);
  }
}

// Экспорт данных из Atlas
function exportFromAtlas() {
  return new Promise((resolve, reject) => {
    logMessage('🔄 Скачивание данных из MongoDB Atlas...');
    
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const backupPath = path.join(BACKUP_DIR, `atlas_export_${timestamp}`);
    
    // Создаем отдельную директорию для этого бэкапа
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }
    
    exec(`mongodump --uri="${ATLAS_URI}" --out=${backupPath}`, (error, stdout, stderr) => {
      if (error) {
        logMessage(`❌ Ошибка при экспорте из MongoDB Atlas: ${error.message}`, true);
        if (stderr) logMessage(`Детали ошибки: ${stderr}`, true);
        reject(error);
      } else {
        logMessage('✅ Данные успешно экспортированы из Atlas');
        if (stdout) logMessage(`Вывод команды: ${stdout.trim()}`);
        resolve(backupPath);
      }
    });
  });
}

// Импорт данных в локальную БД
function importToLocal(backupPath) {
  return new Promise((resolve, reject) => {
    logMessage('🔄 Импорт данных в локальную базу...');
    
    // Получаем имя базы данных из URI Atlas
    const dbName = ATLAS_URI.split('/').pop().split('?')[0];
    const dbBackupPath = path.join(backupPath, dbName);
    
    // Проверяем существование директории с бэкапом
    if (!fs.existsSync(dbBackupPath)) {
      logMessage(`❌ Директория с бэкапом не найдена: ${dbBackupPath}`, true);
      reject(new Error(`Директория с бэкапом не найдена: ${dbBackupPath}`));
      return;
    }
    
    exec(`mongorestore --uri="${LOCAL_URI}" --drop ${dbBackupPath}`, (error, stdout, stderr) => {
      if (error) {
        logMessage(`❌ Ошибка при импорте в локальную MongoDB: ${error.message}`, true);
        if (stderr) logMessage(`Детали ошибки: ${stderr}`, true);
        reject(error);
      } else {
        logMessage('✅ Данные успешно импортированы в локальную БД');
        if (stdout) logMessage(`Вывод команды: ${stdout.trim()}`);
        resolve();
      }
    });
  });
}

// Получение информации о системе
function getSystemInfo() {
  return {
    platform: os.platform(),
    release: os.release(),
    hostname: os.hostname(),
    username: os.userInfo().username,
    date: new Date().toISOString()
  };
}

// Запись информации о синхронизации
function writeReport(backupPath, startTime) {
  const endTime = new Date();
  const duration = (endTime - startTime) / 1000; // в секундах
  
  const report = {
    sync_date: endTime.toISOString(),
    duration_seconds: duration,
    source: ATLAS_URI.replace(/\/\/(.+?):.+?@/, '//***:***@'), // Маскируем учетные данные
    destination: LOCAL_URI.replace(/\/\/(.+?):.+?@/, '//***:***@'),
    backup_path: backupPath,
    system: getSystemInfo()
  };
  
  const reportPath = path.join(backupPath, 'sync_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  logMessage(`📋 Отчет о синхронизации записан в ${reportPath}`);
}

// Запуск синхронизации
async function syncDatabases() {
  const startTime = new Date();
  let backupPath;
  
  try {
    // Создаем директории для логов и бэкапов
    createLogDir();
    createBackupDir();
    
    logMessage('🚀 Начало синхронизации баз данных');
    logMessage(`📌 Время запуска: ${startTime.toISOString()}`);
    logMessage(`📌 Система: ${os.platform()} ${os.release()}`);
    
    // Проверка наличия инструментов MongoDB
    await checkPrerequisites();
    
    // Экспорт из Atlas
    backupPath = await exportFromAtlas();
    
    // Импорт в локальную БД
    await importToLocal(backupPath);
    
    // Запись отчета
    writeReport(backupPath, startTime);
    
    logMessage('\n🎉 Синхронизация завершена успешно!');
    logMessage('🎮 Game Portal готов к локальной разработке с данными из продакшена');
    
    process.exit(0);
  } catch (error) {
    logMessage(`\n❌ Ошибка при синхронизации баз данных: ${error.message}`, true);
    
    // Запись информации об ошибке даже при неудачной синхронизации
    if (backupPath) {
      try {
        const errorReport = {
          error: error.message,
          stack: error.stack,
          date: new Date().toISOString(),
          system: getSystemInfo()
        };
        
        const errorReportPath = path.join(backupPath, 'error_report.json');
        fs.writeFileSync(errorReportPath, JSON.stringify(errorReport, null, 2));
        logMessage(`📋 Отчет об ошибке записан в ${errorReportPath}`, true);
      } catch (reportError) {
        logMessage(`Не удалось записать отчет об ошибке: ${reportError.message}`, true);
      }
    }
    
    process.exit(1);
  }
}

// Запуск синхронизации
syncDatabases();