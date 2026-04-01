# 計画書

## 0. 依頼概要
- 依頼内容: `inputs/2026-03-31/懸念点3.md` を確認し、必要なものだけ `docs/spec` に反映する
- 背景: create 系 auth、permissions DTO の中央定義、画面表示に必要な payload に抜けがある
- 期待成果: `docs/spec` の contract 補完、`懸念点3_対応記録.md` の追加、不要提案の理由明記

## 1. ゴール / 完了条件
- ゴール: `docs/spec` を実装者が追加判断なしで扱えるよう、`懸念点3.md` の残件を最小差分で解消する
- 完了条件（DoD）:
  - 4 create endpoint に local `### auth` が入る
  - permissions DTO が `23-2. 共通 payload` に集約される
  - `tag item`, `knowledge detail`, `question detail`, `bookmark item.preview` の不足 payload が補われる
  - `懸念点3_対応記録.md` に対応 / 対応不要が記録される

## 2. 現状理解と前提
- Current understanding:
  - `POST /api/workspaces/current/join-requests`, `POST /api/knowledges`, `POST /api/questions`, `POST /api/comments` に local `### auth` がない
  - `GET /api/knowledges/{knowledgeId}` と `GET /api/questions/{questionId}` に inline permissions DTO が残っている
  - `tag item` と `bookmark item.preview` は画面仕様に必要な項目をまだ満たしていない
  - `確認事項.md` は現状 `現時点の確認事項なし` で、README も reopen を前提にしていない
- Assumptions:
  - `can_bookmark` は追加しない
  - `can_change_draft_visibility` も追加しない
  - `viewer.is_bookmarked` を detail DTO に追加する
- Non-goals:
  - `確認事項.md` reopen
  - table 列の大幅見直し

## 3. 影響範囲
- Impacted areas:
  - `docs/spec/API概要設計書.md`
  - `docs/spec/用語・正規一覧.md`
  - `docs/spec/画面APIデータ対応表.md`
  - `inputs/2026-03-31/懸念点3_対応記録.md`
- Files to inspect:
  - `inputs/2026-03-31/懸念点3.md`
  - `docs/spec/画面仕様書.md`
  - `docs/spec/権限マトリクス.md`

## 4. 変更方針
- Change strategy:
  - `API概要設計書.md` を先に更新し、DTO と auth を正本として固定する
  - glossary と traceability はその差分だけ追随させる
  - 不採用提案は `懸念点3_対応記録.md` に理由を残す
- 実行タスク:
  - [ ] 1. `API概要設計書.md` を補完する
  - [ ] 2. `用語・正規一覧.md` と `画面APIデータ対応表.md` を更新する
  - [ ] 3. 記録ファイルを作成し、grep 検証する

## 5. 検証方法
- Validation plan:
  - `rg -n '## 6-6\\.|## 8-2\\.|## 11-2\\.|## 13-1\\.' docs/spec/API概要設計書.md`
  - `rg -n '### permissions DTO' docs/spec/API概要設計書.md`
  - `rg -n 'last_content_author|viewer\\.is_bookmarked|normalized_name|usage_count|merged_into_tag_name|sample_contents|preview.*created_by' docs/spec`
  - `Get-Content docs/spec/確認事項.md`
- 成功判定:
  - 懸念点3の必須論点と、関連する detail payload が spec に存在する

## 6. リスクと未解決論点
- Risks:
  - permissions field を増やしすぎると drift を広げる
  - `sample_contents` の形を曖昧にすると handoff 品質が下がる
- Open questions:
  - なし

## 7. 成果物
- 変更ファイル:
  - `docs/spec/API概要設計書.md`
  - `docs/spec/用語・正規一覧.md`
  - `docs/spec/画面APIデータ対応表.md`
  - `inputs/2026-03-31/懸念点3_対応記録.md`
- 付随ドキュメント:
  - `.codex/runs/20260401-145524-JST/*`

## 8. 備考
- `確認事項.md` は `現時点の確認事項なし` を維持する
