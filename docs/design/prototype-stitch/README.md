# Prototype Stitch

`docs/design/prototype-stitch/` は Google Stitch の raw export を見た目そのままで確認するための別系統 prototype です。

- raw screen source: `docs/design/Google Stitch/*/code.html`
- entrypoint: `docs/design/prototype-stitch/index.html`
- viewer: `docs/design/prototype-stitch/screen.html?route=<screen-id>`

方針:

- 既存の `docs/design/prototype/` は変更しない
- Stitch の HTML/CSS は複製せず、iframe で raw export をそのまま表示する
- 画面間の導線だけを親側の `assets/stitch-wireup.js` で付与する

制約:

- 遷移付与は visible text を基準にした lightweight wiring
- raw export 自体の DOM が大きく変わると、対応する rewiring の更新が必要
- この viewer は静的サーバー経由で開く前提
