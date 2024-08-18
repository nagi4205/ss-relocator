## ss-relocator

月毎にディレクトリを作り(/2021-08)、月単位でスクリーンショットを管理するプログラム

### required

- ts-node の グローバルインストール

### todo

- src/config/directory copy.ts をコピーし、directory.ts を作成
- directory.ts にて、スクリーンショットの一時保管場所（tmpDir）、移動先（baseDir）のパスをそれぞれ指定
- crontab -e でバッチ処理を登録（バッチ処理のタイミングは任意）
  ` 0 12 1 * * <グローバルにインストールされたts-nodeのフルパス> <ssr-relocator/src/script.tsのフルパス> >> <ログ出力をするファイルのフルパス　ex.)/tmp/ss-relocator.log> 2>&1`
