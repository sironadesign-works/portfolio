# portfolio
シロナデザインポートフォリオサイト

## 保守時のファイル案内

- `index.html`: 表示内容、セクション構造、作品カードと各モーダルの対応を管理します。
- `css/style.css`: 独自部品、状態クラス、アニメーション、レスポンシブ表示を管理します。
- `js/main.js`: アコーディオン、AI表示切替、作品モーダル、カルーセルなどの操作を管理します。
- `tailwind.config.js`: Tailwindの色、余白、文字、角丸と、生成対象の探索範囲を管理します。
- `src/tailwind.css`: Tailwindの生成入口です。`css/tailwind.css`は生成物なので直接編集しません。
- `privacy-policy.html` / `cookie-policy.html`: 法務ページです。共通ヘッダーやフッターを変えた時はトップページと揃えます。

`package.json`はJSON仕様上コメントを書けません。`build:css`は本番CSS生成、`watch:css`は開発中の自動再生成に使います。

## CSSの更新

Tailwind CSSは本番用CSSとして`css/tailwind.css`に生成しています。

```bash
npm install
npm run build:css
```

HTML内のTailwindクラスや`tailwind.config.js`を変更した場合は、`npm run build:css`を実行してから公開してください。
