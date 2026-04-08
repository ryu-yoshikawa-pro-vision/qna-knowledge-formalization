# Google Stitch Prototype Layout Stabilization

## Summary
- wrapper 側の viewport sizing を `100vw / 100vh` 固定から `100% + 100dvh` 優先へ変更した。
- これにより centered gateway 画面と signed-in shell 画面での微妙な寄りや viewport 由来のズレを抑えた。
- representative check として `auth.login`、`workspace.resolution`、`knowledge.list`、`knowledge.detail`、`admin.members` を確認した。

## Changed Files
- `docs/design/prototype/assets/base.css`
- `docs/design/prototype/*.html`（asset hash 更新のため再生成）

## Verification
- `python docs/design/prototype/tools/build_stitch_prototype.py`
- `curl.exe -I http://127.0.0.1:8765/prototype/auth-login.html`
- Playwright-CLI
  - `open http://127.0.0.1:8765/prototype/auth-login.html --headed`
  - `console error` => `Errors: 0`
  - screenshot で login centered layout を確認
  - `open http://127.0.0.1:8765/prototype/workspace-resolution.html --headed`
  - screenshot で gateway layout を確認
  - `open http://127.0.0.1:8765/prototype/knowledge-list.html --headed`
  - screenshot で list layout を確認
  - `open http://127.0.0.1:8765/prototype/knowledge-detail.html --headed`
  - raw export と比較し、wrapper 起因の幅崩れがないことを確認
  - `open http://127.0.0.1:8765/prototype/admin-members.html --headed`
  - screenshot で admin shell layout を確認

## Notes
- `knowledge-detail` のテキスト折り返しや一部の密度は raw Stitch export 側でも同一であり、今回の wrapper 調整で悪化していないことを確認した。
