# 丸尾けいすけ公式サイト

丸尾けいすけさんのプロフィール、社会像、政策、応援方法を伝えるReact/Vite製のLPです。

## AI・制作者向け資料

- [AI_START_HERE.md](AI_START_HERE.md) — AIが最初に読む案内
- [docs/DESIGN_PHILOSOPHY.md](docs/DESIGN_PHILOSOPHY.md) — 設計思想、画面構成、モーション、レスポンシブの理由

## ローカル表示

```sh
npm install
npm run dev
```

ブラウザで `http://127.0.0.1:8765/` を開きます。

## 確認用ビルド

```sh
npm run build
```

生成物は `dist/` に出力されます。GitHub Pagesも同じビルド結果を公開します。

## 主なファイル

| ファイル | 内容 |
|---|---|
| `src/main.jsx` | ページ全体の構成 |
| `src/SiteSections.jsx` | 各セクションの表示部品 |
| `src/siteContent.js` | 本文・政策・リンク |
| `src/siteConfig.js` | 場面番号・色・ブレークポイント |
| `src/useSiteMotion.js` | PCとモバイルの動き |
| `site-refactored.css` | 見た目とレスポンシブ |
| `privacy.html` | プライバシーポリシー |
