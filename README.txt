PRICE CHECK — 公開用ファイル

1. GitHubでPublicリポジトリを作成（例: korea-price-check）
2. このZIPを展開し、中身をリポジトリのルートにアップロード
   index.html / manifest.webmanifest / service-worker.js / icons/
3. Settings → Pages → Deploy from a branch → main → /(root) → Save
4. 公開URLをiPhoneのSafariで開く
5. 共有ボタン →「ホーム画面に追加」
6. 表示名が「PRICE CHECK」になっていることを確認して追加

アイコンは提供いただいたデザインを正方形のまま、180 / 192 / 512pxに書き出しています。
価格入力は外部送信しません。為替レート取得時はFrankfurter APIへ通信します。
Service Workerはアプリ本体とアイコン等をキャッシュし、次回以降のオフライン起動を補助します。
