/**
 * Скрипт для автоматического резервного копирования базы данных
 * Запуск: node scripts/backup.js
 * Рекомендуется настроить регулярный запуск через cron
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
require('dotenv').config();

// Загружаем переменные окружения
const envPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../.env.production')
  : path.join(__dirname, '../.env.local');

// Пробуем загрузить .env файл
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// Настройки резервного копирования
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const BACKUP_DIR = path.join(__dirname, '../backup');
const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'db_backup.log');
const MAX_BACKUPS = parseInt(process.env.MAX_BACKUPS || '7', 10); // хранить не более 7 последних бэкапов
const ENCRYPT_BACKUP = process.env.ENCRYPT_BACKUP === 'true';
const ENCRYPTION_KEY = process.env.BACKUP_ENCRYPTION_KEY;
const COMPRESS_ONLY = process.env.COMPRESS_ONLY === 'true'; // Если true, не шифруем, а только сжимаем

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

// Создаем директорию для логов
createLogDir();

// Проверяем наличие строки подключения
if (!MONGO_URI) {
  logMessage('❌ Ошибка: Строка подключения MongoDB не найдена в переменных окружения', true);
  logMessage('Пожалуйста, укажите MONGODB_URI или MONGO_URI', true);
  process.exit(1);
}

// Создаем директорию для бэкапов, если ее нет
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  logMessage(`📁 Создана директория для бэкапов: ${BACKUP_DIR}`);
}

// Генерируем имя файла с датой
const date = new Date();
const timestamp = date.toISOString().replace(/:/g, '-').replace(/\..+/, '');
const backupName = `backup-${timestamp}`;
const backupPath = path.join(BACKUP_DIR, backupName);

// Функция для получения размера директории
function getDirSize(directory) {
  let size = 0;
  
  try {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        size += stats.size;
      } else if (stats.isDirectory()) {
        size += getDirSize(filePath);
      }
    }
  } catch (error) {
    logMessage(`⚠️ Ошибка при подсчете размера директории ${directory}: ${error.message}`, true);
  }
  
  return size;
}

// Функция для форматирования размера
function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Функция для ротации резервных копий (удаление старых)
function rotateBackups() {
  try {
    // Получаем список всех директорий с бэкапами
    const backupDirs = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('backup-') && 
        fs.statSync(path.join(BACKUP_DIR, file)).isDirectory());
    
    // Сортируем по дате создания (от самых старых к новым)
    backupDirs.sort((a, b) => {
      return fs.statSync(path.join(BACKUP_DIR, a)).mtime.getTime() - 
             fs.statSync(path.join(BACKUP_DIR, b)).mtime.getTime();
    });
    
    // Если количество бэкапов превышает MAX_BACKUPS, удаляем самые старые
    if (backupDirs.length > MAX_BACKUPS) {
      const dirsToDelete = backupDirs.slice(0, backupDirs.length - MAX_BACKUPS);
      
      dirsToDelete.forEach(dir => {
        const dirPath = path.join(BACKUP_DIR, dir);
        const size = getDirSize(dirPath);
        
        fs.rmSync(dirPath, { recursive: true, force: true });
        logMessage(`🗑️ Удален старый бэкап: ${dir} (${formatSize(size)})`);
      });
      
      // Выводим информацию об оставшихся бэкапах
      logMessage(`📊 Осталось бэкапов: ${backupDirs.length - dirsToDelete.length} из ${MAX_BACKUPS} максимальных`);
    }
  } catch (error) {
    logMessage(`❌ Ошибка при ротации бэкапов: ${error.message}`, true);
  }
}

// Функция для архивирования бэкапа
function compressBackup(backupPath) {
  return new Promise((resolve, reject) => {
    const archivePath = `${backupPath}.tar.gz`;
    logMessage(`🔄 Сжатие резервной копии...`);
    
    // Архивируем директорию
    exec(`tar -czf ${archivePath} -C ${BACKUP_DIR} ${backupName}`, (error) => {
      if (error) {
        logMessage(`❌ Ошибка при сжатии бэкапа: ${error.message}`, true);
        reject(error);
        return;
      }
      
      // Получаем размер архива
      const stats = fs.statSync(archivePath);
      
      // Удаляем исходную директорию
      fs.rmSync(backupPath, { recursive: true, force: true });
      
      logMessage(`✅ Бэкап сжат: ${archivePath} (${formatSize(stats.size)})`);
      resolve(archivePath);
    });
  });
}

// Функция для шифрования бэкапа
function encryptBackup(backupPath) {
  if (COMPRESS_ONLY) {
    return compressBackup(backupPath);
  }
  
  if (!ENCRYPT_BACKUP || !ENCRYPTION_KEY) {
    return Promise.resolve(backupPath);
  }
  
  return new Promise((resolve, reject) => {
    const archivePath = `${backupPath}.tar.gz`;
    logMessage(`🔄 Подготовка к шифрованию бэкапа...`);
    
    // Сначала архивируем директорию
    exec(`tar -czf ${archivePath} -C ${BACKUP_DIR} ${backupName}`, (error) => {
      if (error) {
        logMessage(`❌ Ошибка при архивации бэкапа: ${error.message}`, true);
        reject(error);
        return;
      }
      
      logMessage(`🔐 Шифрование бэкапа...`);
      
      // Затем шифруем архив
      exec(`openssl enc -aes-256-cbc -salt -in ${archivePath} -out ${archivePath}.enc -k "${ENCRYPTION_KEY}"`, (error) => {
        if (error) {
          logMessage(`❌ Ошибка при шифровании бэкапа: ${error.message}`, true);
          reject(error);
          return;
        }
        
        // Получаем размер зашифрованного архива
        const stats = fs.statSync(`${archivePath}.enc`);
        
        // Удаляем нешифрованный архив
        fs.unlinkSync(archivePath);
        
        // Удаляем исходную директорию
        fs.rmSync(backupPath, { recursive: true, force: true });
        
        logMessage(`🔒 Бэкап зашифрован: ${archivePath}.enc (${formatSize(stats.size)})`);
        resolve(`${archivePath}.enc`);
      });
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

// Запись информации о бэкапе
function writeReport(backupPath, startTime, finalPath) {
  const endTime = new Date();
  const duration = (endTime - startTime) / 1000; // в секундах
  
  const report = {
    backup_date: endTime.toISOString(),
    duration_seconds: duration,
    source: MONGO_URI.replace(/\/\/(.+?):.+?@/, '//***:***@'), // Маскируем учетные данные
    backup_path: finalPath,
    encrypted: ENCRYPT_BACKUP && !COMPRESS_ONLY,
    compressed: true,
    retention_policy: {
      max_backups: MAX_BACKUPS
    },
    system: getSystemInfo()
  };
  
  // Если финальный путь - это файл, то создаем директорию для отчета
  let reportDir = path.dirname(finalPath);
  let reportPath = path.join(reportDir, 'backup_report.json');
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  logMessage(`📋 Отчет о бэкапе записан в ${reportPath}`);
}

// Запуск процесса резервного копирования
const startTime = new Date();
logMessage(`🚀 Запуск резервного копирования в ${backupPath}...`);
logMessage(`📌 Время запуска: ${startTime.toISOString()}`);
logMessage(`📌 Система: ${os.platform()} ${os.release()}`);
logMessage(`📌 Настройки: MAX_BACKUPS=${MAX_BACKUPS}, ENCRYPT=${ENCRYPT_BACKUP}, COMPRESS_ONLY=${COMPRESS_ONLY}`);

// Выполняем mongodump
exec(`mongodump --uri="${MONGO_URI}" --out=${backupPath}`, async (error, stdout, stderr) => {
  if (error) {
    logMessage(`❌ Ошибка при создании резервной копии: ${error.message}`, true);
    if (stderr) logMessage(`Детали ошибки: ${stderr}`, true);
    process.exit(1);
  }
  
  // Получаем размер бэкапа
  const backupSize = getDirSize(backupPath);
  
  logMessage(`✅ Резервная копия успешно создана в: ${backupPath} (${formatSize(backupSize)})`);
  
  try {
    // Обрабатываем бэкап (шифрование или сжатие)
    let finalPath = backupPath;
    
    if (ENCRYPT_BACKUP && ENCRYPTION_KEY) {
      finalPath = await encryptBackup(backupPath);
    } else if (COMPRESS_ONLY) {
      finalPath = await compressBackup(backupPath);
    }
    
    // Запись отчета
    writeReport(backupPath, startTime, finalPath);
    
    // Ротация старых бэкапов
    rotateBackups();
    
    const endTime = new Date();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    logMessage(`✅ Процесс резервного копирования завершен успешно за ${duration} сек.`);
  } catch (error) {
    logMessage(`❌ Ошибка при обработке резервной копии: ${error.message}`, true);
  }
}); 