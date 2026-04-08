# Google Stitch Prototype File URL Fix

## Summary
- `docs/design/prototype/auth-login.html` を `file://` で直接開いたとき、`Google でログイン` を押しても遷移しない問題を修正した。
- 原因は `docs/design/prototype/assets/mock-state.js` が `window.location.pathname` を文字列連結しており、`file:///...` のスキームを落としていたこと。
- `new URL(...)` ベースで wrapper route を解決する実装に変更し、overlay reset link も同じ方式に統一した。

## Changed Files
- `docs/design/prototype/assets/mock-state.js`
- `docs/design/prototype/assets/prototype.js`
- `docs/design/prototype/*.html`（asset hash 更新のため再生成）

## Verification
- `node --check docs/design/prototype/assets/mock-state.js`
- `node --check docs/design/prototype/assets/prototype.js`
- `python docs/design/prototype/tools/build_stitch_prototype.py`
- `@' ... '@ | node -`
  - `buildHref('workspace.resolution', ...)` => `file:///C:/Users/ryu-yoshikawa/Documents/qna-knowledge-formalization/docs/design/prototype/workspace-resolution.html?fixture=unaffiliated-user`
  - `indexHref()` => `file:///C:/Users/ryu-yoshikawa/Documents/qna-knowledge-formalization/docs/design/prototype/index.html`
- Playwright-CLI (`flowcheck` セッション再利用)
  - `open http://127.0.0.1:8765/prototype/auth-login.html --headed`
  - `snapshot`
  - `click f1e12`
  - 結果: `http://127.0.0.1:8765/prototype/workspace-resolution.html?fixture=unaffiliated-user` へ遷移

## Notes
- `http://` 配下の回帰確認も併せて実施し、`Google でログイン` の遷移が維持されていることを確認した。
- `file://` 実機確認の代わりに、runtime の URL 生成結果を Node 上で評価して根本原因の解消を確認した。
