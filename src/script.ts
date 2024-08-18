import fs from 'fs';
import path from 'path';
import Logger from './utils/logger';
import { directory } from './config/directory';

const ssRelocation = () => {
  const tmpDir = directory.tmpDir;
  const baseDir = directory.baseDir;

  /** TODO: Dateや周辺のメソッドを外部に持っていきたい */
  const now = new Date();

  Logger.info(`Script started`);

  const lastMonth = now.getFullYear() + '-' + ('0' + now.getMonth()).slice(-2);
  const lastMonthDir = path.join(baseDir, lastMonth);

  /** すでに当月分のシステムが稼働しており、ディレクトリが存在していれば処理終了 */
  if (fs.existsSync(lastMonthDir)) {
    Logger.info(`Directory ${lastMonthDir} already exists. Script terminated.`);
    return;
  }

  fs.mkdirSync(lastMonthDir, { recursive: true });
  Logger.info(`Created directory: ${lastMonthDir}`);

  /** tmpディレクトリ内のファイルを取得 */
  fs.readdir(tmpDir, (err, tmpFiles) => {
    if (err) {
      Logger.error(`Error reading directory ${tmpDir}: ${err.message}`);
      return;
    }

    /** tmpディレクトリ内にファイルが存在しない場合、処理終了 */
    if (tmpFiles.length === 0) {
      Logger.info(`No files found in ${tmpDir}. Script terminated.`);
      return;
    }

    Logger.info(`Found ${tmpFiles.length} files in ${tmpDir}`);

    tmpFiles.forEach((file) => {
      const tmpFilePath = path.join(tmpDir, file);

      fs.stat(tmpFilePath, (err, stats) => {
        if (err) {
          console.log(err);
          Logger.error(`Error getting stats for file ${file}: ${err.message}`);
          return;
        }

        const lastModifiedTime = new Date(stats.mtime);
        /** ex. lastModifiedMonth = 2021-08 */
        const lastModifiedMonth =
          lastModifiedTime.getFullYear() +
          '-' +
          ('0' + (lastModifiedTime.getMonth() + 1)).slice(-2);

        if (lastModifiedMonth !== lastMonth) {
          Logger.error(
            `File ${file}'s last modified month is not ${lastMonth}. skip.`
          );
          return;
        }

        const newFilePath = path.join(lastMonthDir, file);
        fs.rename(tmpFilePath, newFilePath, (err) => {
          if (err) {
            console.log(err);
            Logger.error(
              `Error moving file ${file} to ${newFilePath}: ${err.message}`
            );
            return;
          }

          Logger.info(`Moved file ${file} to ${newFilePath} successfully`);
        });
      });
    });

    // TODO: errorが発生した場合、↓の処理が実行されない
    Logger.info(`script done!`);
  });
};

ssRelocation();
