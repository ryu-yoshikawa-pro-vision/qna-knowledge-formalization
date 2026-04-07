# design demo unification implementation report

## Summary

- `docs/design/README.md` を追加し、authority / taxonomy / update policy / validation checklist を固定した。
- `docs/design/screen-map.md` を追加し、20 screen ID 全件の spec / prompt / raw export / prototype 対応を整理した。
- `docs/design/prototype/` を追加し、shared assets と 20 route wrapper + `index.html` を実装した。
- `docs/design/DESIGN.md` / `DESIGN_日本語.md` に spec alignment を追記した。
- 対象 plan の実行タスクを完了済みに更新した。

## Commands

- `Get-Content -Raw docs/spec/README.md`
- `Get-Content -Raw docs/spec/用語・正規一覧.md`
- `Get-Content -Raw docs/spec/実装スコープ分解書.md`
- `Get-Content -Raw docs/spec/受け入れ基準.md`
- `Get-Content -Raw docs/design/DESIGN.md`
- `Get-Content -Raw docs/design/DESIGN_日本語.md`
- `node -e "const fs=require('fs'); ['docs/design/prototype/assets/routes.js','docs/design/prototype/assets/mock-state.js','docs/design/prototype/assets/mock-data.js','docs/design/prototype/assets/prototype.js'].forEach(p=>{new Function(fs.readFileSync(p,'utf8')); console.log('OK '+p);});"`
- `(Get-ChildItem docs/design/prototype -Filter *.html | Measure-Object).Count`
- `Get-ChildItem docs/design/prototype -Recurse -File | Select-String 'href=\"#\"'`
- `Select-String -Path docs/design/screen-map.md -Pattern '^\| \`[^`]+\` \|' | Measure-Object`

## Results

- JS syntax check: pass
- Prototype HTML count: 21 (`index.html` + 20 screen routes)
- `screen-map.md` rows: 20
- prototype 配下の `href="#"`: 実リンクとしては 0 件

## Files

- `docs/design/README.md`
- `docs/design/DESIGN.md`
- `docs/design/DESIGN_日本語.md`
- `docs/design/screen-map.md`
- `docs/design/prototype/README.md`
- `docs/design/prototype/assets/tokens.css`
- `docs/design/prototype/assets/base.css`
- `docs/design/prototype/assets/routes.js`
- `docs/design/prototype/assets/mock-state.js`
- `docs/design/prototype/assets/mock-data.js`
- `docs/design/prototype/assets/prototype.js`
- `docs/design/prototype/*.html`

## Remaining

- browser 実画面の目視確認は未実施
- raw export の `href="#"` は参照専用ディレクトリのため未変更
