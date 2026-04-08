# Google Stitch 忠実再現プロトタイプ 実装レポート

## Summary

- `docs/design/Google Stitch/` の raw export を visual source とし、`docs/design/prototype/` を same-origin iframe ベースの static multi-page prototype として再構築した
- `screen-map.md` と `画面仕様書.md` に沿って 20 route、Scenario 1〜10、`fixture / state / tab / modal` 制御を整備した
- `question.detail` の履歴は side panel、`admin.members` は `Members / Invitations / Join Requests` tab、review queue badge は privileged fixture のみ表示にした
- wrapper asset に content hash query を付け、ローカル検証時の stale cache を回避した
- Playwright-CLI で主要フローと state overlay を確認し、console error は favicon 404 を除去して 0 件にした

## Scope

- 実装対象:
  - `docs/design/prototype/`
  - `docs/design/prototype/assets/`
  - `docs/design/prototype/tools/build_stitch_prototype.py`
  - `docs/plans/2026-04-07_235510_google-stitch-prototype.md`
- 非対象:
  - backend mutation
  - Google Stitch raw export 自体の編集
  - `docs/design/prototype-stitch/` deleted worktree の復元

## Main Changes

### 1. Route manifest / wrapper generation

- `build_stitch_prototype.py` を source of truth として整備した
- 20 wrapper page、`index.html`、`assets/routes.js` を再生成できるようにした
- wrapper に content hash query を付け、`routes.js` / runtime JS の stale cache を防いだ
- wrapper に空 favicon を追加し、`favicon.ico` 404 を回避した

### 2. Runtime wiring

- `assets/mock-state.js`
  - route 解決、query param 解決、fixture 権限判定、href 生成を実装
- `assets/mock-data.js`
  - overlay panel 文言、`question.detail` history panel 文言を実装
- `assets/prototype.js`
  - iframe load 後の runtime patch
  - global nav rewiring
  - route-specific CTA rewiring
  - review badge / admin nav の role-aware 制御
  - `admin.members` tab filter
  - `question.detail` history side panel
  - `loading / empty / error / permission-denied` overlay

### 3. Documentation

- `docs/design/prototype/README.md` を構成、query param、再生成手順、cache-busting に合わせて更新した

## Validation

### Static checks

- `python docs/design/prototype/tools/build_stitch_prototype.py`
- `node --check docs/design/prototype/assets/prototype.js`
- `node --check docs/design/prototype/assets/mock-state.js`
- `node --check docs/design/prototype/assets/mock-data.js`
- `rg -n 'href=\"#\"|href=''#''' docs/design/prototype`
  - no match

### Playwright-CLI checks

- `auth.login`
  - snapshot で `Google でログイン` CTA を確認
- `auth.login` → `workspace.resolution?state=create-path`
  - click 後に遷移を確認
  - `workspace 作成導線` floating overlay を確認
- `workspace.resolution?state=create-path` → `knowledge.list`
  - `新規作成` click 後に遷移を確認
- `knowledge.list` → `knowledge.detail` → `knowledge.revisions`
  - card click と `更新履歴へ` click を確認
- `question.detail?modal=history`
  - `質問と回答の履歴` side panel を確認
- `admin.members?fixture=owner&tab=invitations`
  - 招待 row のみ表示を確認
  - review badge `3` を確認
- `admin.members?fixture=member`
  - permission denied overlay を確認
- `knowledge.list?state=empty`
  - empty overlay を確認
- `knowledge.detail?state=error`
  - error overlay を確認
- `playwright-cli console error`
  - `Errors: 0`

## Notes

- `workspace.resolution` の raw Stitch 画面は既存 workspace 参加導線なので、prototype の既定 state は `pending-join` とした
- `create-path` は raw layout を壊さないよう floating overlay で表現した
- `admin.members?fixture=member` の underlying iframe は valid fixture fallback の owner layout を使い、その上に permission denied overlay を重ねる実装である

## Progress

Progress: 100% (5/5)
