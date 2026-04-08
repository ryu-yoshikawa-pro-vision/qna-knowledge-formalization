# GitHub Pages Setup

## Summary
- `docs/` をそのまま GitHub Pages artifact として公開する workflow を追加した。
- Pages root 用に `docs/index.html` を追加し、公開時は `design/prototype/index.html` へ自動で遷移するようにした。
- `.nojekyll` も追加し、Pages の Jekyll 介入を避けた。

## Changed Files
- `.github/workflows/deploy-pages.yml`
- `docs/index.html`
- `docs/.nojekyll`
- `docs/design/prototype/README.md`

## Verification
- `git branch --show-current` => `main`
- `curl.exe -I http://127.0.0.1:8765/index.html`
- Playwright-CLI
  - `open http://127.0.0.1:8765/index.html --headed`
  - 結果: `http://127.0.0.1:8765/design/prototype/index.html` へ遷移
  - `console error` => `Errors: 0`

## Notes
- repository settings の `Pages` source は `GitHub Actions` に切り替える必要がある。
- 想定公開 URL:
  - `https://ryu-yoshikawa-pro-vision.github.io/qna-knowledge-formalization/`
  - `https://ryu-yoshikawa-pro-vision.github.io/qna-knowledge-formalization/design/prototype/index.html`
