# AI START HERE

丸尾けいすけ公式サイトの構造を短時間で理解するための入口です。

## 最初に読む

- [`docs/DESIGN_PHILOSOPHY.md`](docs/DESIGN_PHILOSOPHY.md) — 画面構成、視線設計、モーション、レスポンシブの理由
- [`README.md`](README.md) — 起動・ビルド方法とファイル構成

## 実装の所在

| 関心 | ファイル |
|---|---|
| ページ全体の組み立て | `src/main.jsx` |
| セクションの表示構造 | `src/SiteSections.jsx` |
| 本文・政策・外部リンク | `src/siteContent.js` |
| スライド番号・色・ブレークポイント | `src/siteConfig.js` |
| PCカルーセル／モバイルストーリー | `src/useSiteMotion.js` |
| 見た目とレスポンシブ | `site-refactored.css` |
| プライバシーポリシー | `privacy.html` |

## このサイトを一文で

「丸尾けいすけ」という人物を右側に常在させ、その人が語るビジョン・経歴・政策・参加方法を左側の場面転換として読むLPです。
