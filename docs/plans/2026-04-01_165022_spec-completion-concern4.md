# `懸念点4.md` 精査反映計画

## Goal

- permissions contract の不足を、実際に UI 制御で足りていない範囲だけ補完する。
- `docs/spec` 全体で、permissions DTO・権限マトリクス・endpoint auth/rules の整合を取る。
- review 提案のうち不採用項目は、理由付きで記録して再議論なしで handoff できる状態にする。

## Current understanding

- `knowledge permissions DTO` と `knowledge edit draft permissions DTO` には `can_change_draft_visibility` が未定義。
- `knowledge detail`、`knowledge list item`、`question detail`、`question list item` には `viewer.is_bookmarked` が既にある。
- `権限マトリクス.md` には edit draft の `draft_visibility` 切替はあるが、通常 knowledge の `draft_visibility` 切替が明文化されていない。
- bookmark 権限は role 共通権限として既に定義されている。
- `README.md` と `確認事項.md` は、source から決められる事項を `確認事項.md` に残さない運用。

## Assumptions

- bookmark 可否は `viewer.is_bookmarked` と bookmark API で handoff 上十分に閉じている。
- `can_change_draft_visibility` は、その時点で `draft-visibility` endpoint を呼べるかを表す field として扱う。
- `can_bookmark` を list item まで広げる bookmark 契約の全面見直しは今回のスコープ外。

## Non-goals

- `can_bookmark` の新設
- `question permissions DTO` の拡張
- `確認事項.md` の reopen / close 運用
- bookmark 契約の全面再設計

## Impacted areas

- `docs/spec/API概要設計書.md`
- `docs/spec/権限マトリクス.md`
- `docs/spec/用語・正規一覧.md`
- `inputs/2026-04-01/懸念点4_対応記録.md`

## Files to inspect

- `inputs/2026-04-01/懸念点4.md`
- `docs/spec/API概要設計書.md`
- `docs/spec/権限マトリクス.md`
- `docs/spec/用語・正規一覧.md`
- `docs/spec/README.md`
- `docs/spec/確認事項.md`

## Change strategy

1. `knowledge permissions DTO` に `can_change_draft_visibility` を追加する。位置は `can_create_edit_draft` の直後。
2. `knowledge edit draft permissions DTO` に `can_change_draft_visibility` を追加する。位置は末尾。
3. `question permissions DTO` は変更しない。`can_bookmark` は追加しない。
4. `権限マトリクス.md` に通常 knowledge の `draft_visibility` 切替ルールを追加し、`自分の draft knowledge のみ可`、`他人の knowledge は不可`、`draft 以外は不可` を明示する。
5. `用語・正規一覧.md` の permissions field 正規名に `can_change_draft_visibility` を追加する。`can_bookmark` は追加しない。
6. `確認事項.md` は変更しない。
7. `懸念点4_対応記録.md` に各 review 論点の `判定`、`理由`、`反映先`、`採用しなかった提案` を記録する。

## Validation plan

- `rg -n "### \`knowledge permissions DTO\`|### \`knowledge edit draft permissions DTO\`|can_change_draft_visibility" docs/spec/API概要設計書.md` で 2 DTO にだけ追加されていることを確認する。
- `rg -n "can_bookmark" docs/spec/API概要設計書.md docs/spec/用語・正規一覧.md docs/spec/権限マトリクス.md` で spec 本体に `can_bookmark` が無いことを確認する。
- `rg -n "viewer\\.is_bookmarked" docs/spec/API概要設計書.md docs/spec/画面APIデータ対応表.md` で bookmark current-state 契約が維持されていることを確認する。
- `rg -n "draft_visibility 切替|draft knowledge" docs/spec/権限マトリクス.md` で通常 knowledge のルールが追加されたことを確認する。
- `Get-Content -Encoding utf8 docs/spec/確認事項.md` で `現時点の確認事項なし。` を維持していることを確認する。
- `Get-Content -Encoding utf8 inputs/2026-04-01/懸念点4_対応記録.md` で採否と不採用理由を確認する。

## Risks

- `権限マトリクス.md` を更新しないと permissions DTO だけが先行して source of truth が分裂する。
- `can_bookmark` を部分採用すると list/detail の契約が二重化する。
- `確認事項.md` を reopen すると repo の運用ルールと今回の判断理由が衝突する。

## Open questions

- なし
