# Google Stitch Prototype File Direct Open Fix

## Summary
- `docs/design/prototype/auth-login.html` を `file://` で直接開いたときに `Cannot read properties of null (reading 'getElementById')` が出る原因を修正した。
- 原因は wrapper が `iframe.src = ../Google Stitch/.../code.html` を使い、runtime が `iframe.contentDocument` に直接触っていたこと。`file://` 直開きではこの前提が壊れる。
- 各 wrapper に Stitch の raw HTML を base64 で埋め込み、`iframe.srcdoc` で描画する方式へ変更した。

## Changed Files
- `docs/design/prototype/tools/build_stitch_prototype.py`
- `docs/design/prototype/assets/prototype.js`
- `docs/design/prototype/*.html`

## Verification
- `node --check docs/design/prototype/assets/prototype.js`
- `python docs/design/prototype/tools/build_stitch_prototype.py`
- `curl.exe -I http://127.0.0.1:8765/prototype/auth-login.html`
- Playwright-CLI
  - `open http://127.0.0.1:8765/prototype/auth-login.html --headed`
  - `snapshot`
  - `click f1e12`
  - 結果: `http://127.0.0.1:8765/prototype/workspace-resolution.html?fixture=unaffiliated-user`
  - `console error` => `Errors: 0`

## Notes
- Playwright-CLI 自体は `file://` への `goto` をブロックするため、ブラウザ自動確認は `http://127.0.0.1:8765` 経由で実施した。
- ただし今回の修正で wrapper は `file://` 時にも外部ファイルの iframe DOM へ触れなくなったため、ユーザーが直接 HTML を開いたケースでも同じ null 参照は起きない設計になった。
