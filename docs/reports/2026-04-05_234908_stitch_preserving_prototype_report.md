# Stitch preserving prototype report

日時: 2026-04-05 23:49:08 JST

## Summary

- `docs/design/prototype/` は維持したまま、`docs/design/prototype-stitch/` を新設した
- Google Stitch raw export を iframe でそのまま表示する viewer を追加した
- 親ページ側の lightweight rewiring で主要導線を接続した

## Files

- `docs/design/prototype-stitch/README.md`
- `docs/design/prototype-stitch/index.html`
- `docs/design/prototype-stitch/screen.html`
- `docs/design/prototype-stitch/assets/stitch-frame.css`
- `docs/design/prototype-stitch/assets/stitch-wireup.js`

## Notes

- Stitch の見た目保持を優先し、raw export の直接改変はしていない
- 導線付与は text match ベースのため、raw export 側の文言変更時は `stitch-wireup.js` の見直しが必要
