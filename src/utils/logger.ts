import { createLogger, format, transports } from 'winston';
import path from 'path';

// ログファイルのパスを設定
const logDir = path.join(__dirname, '../logs');

// ログ設定の定義
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    // infoレベルのログを standard.log ファイルに出力
    new transports.File({ filename: path.join(logDir, 'standard.log'), level: 'info' }),
    // errorレベルのログを error.log ファイルに出力
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' })
  ],
});

class Logger {
  static info(message: string): void {
    logger.info(message);
  }

  static error(message: string): void {
    logger.error(message);
  }
}

export default Logger;