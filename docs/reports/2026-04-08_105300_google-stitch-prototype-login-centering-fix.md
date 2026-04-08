# Google Stitch Prototype Login Centering Fix

## Summary
- login 画面だけ上寄りになっていた原因は、runtime injected style が Stitch の `min-h-screen` を `min-height: 100%` で上書きしていたこと。
- `prototype.js` の injected style を修正し、`body.codex-prototype-runtime` に `100vh / 100dvh` を与える形へ変更した。
- 修正後、login 画面の `main.top` は `0` から `176.8125` に変わり、中央寄せに戻った。

## Changed Files
- `docs/design/prototype/assets/prototype.js`
- `docs/design/prototype/*.html`（asset hash 更新のため再生成）

## Verification
- `node --check docs/design/prototype/assets/prototype.js`
- `python docs/design/prototype/tools/build_stitch_prototype.py`
- Playwright-CLI
  - `open http://127.0.0.1:8765/prototype/auth-login.html --headed`
  - `eval` で iframe 内 `main.getBoundingClientRect().top` を確認
  - 修正前: `top = 0`
  - 修正後: `top = 176.8125`
  - screenshot で icon が上端に張り付かず中央配置へ戻ったことを確認

## Notes
- 問題は login だけに見えていたが、根本原因は runtime injected style の共通設定だった。
- shell 画面では実害が小さかったが、gateway の centered layout で最も目立っていた。
