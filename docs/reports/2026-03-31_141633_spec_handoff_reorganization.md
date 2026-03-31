# spec handoff reorganization report

## Summary

* `inputs/2026-03-30/spec` を full-stack 実装 handoff 用に再編した
* `README.md` 起点で読める入口文書、技術前提、用語正規化、traceability、受け入れ基準を追加した
* 既存仕様書へ責務定義と不足仕様を補強し、実装判断が必要な論点だけを `確認事項.md` に隔離した

## Main Changes

* 新規追加
  * `README.md`
  * `実装前提・技術基準.md`
  * `用語・正規一覧.md`
  * `画面APIデータ対応表.md`
  * `実装スコープ分解書.md`
  * `受け入れ基準.md`
  * `確認事項.md`
* 既存補強
  * `API概要設計書.md`
  * `テーブル定義.md`
  * `画面仕様書.md`
  * `バリデーション・業務ルール一覧.md`
  * `業務仕様書.md`
  * `状態遷移仕様.md`
  * `権限マトリクス.md`

## Fixed Decisions

* `questions.archived -> open` は MVP 非対応
* 招待再送は「旧 `pending` を `revoked`、新 token / new expiry で新 `pending` 作成」
* `review_requested` と `changes_requested` の保存後は `shared` へ戻す
* `knowledge_edit_draft` の review は通常 knowledge と対称に扱う
* `join_request_submitted` の受信者は owner / admin

## Evidence

* `rg -n "archived -> open|knowledge_edit_draft_reviews|workspace-invitations/\{invitationId\}/resend|draft-visibility|join_request_submitted|knowledge_edit_draft_changes_requested|knowledge_edit_draft_applied|client_platform" inputs/2026-03-30/spec`
* `Get-ChildItem "inputs/2026-03-30/spec" | Select-Object Name,Length`
* `Get-Content -Encoding utf8 docs/PROJECT_CONTEXT.md | Select-Object -First 200`

## Progress

Progress: 100% (8/8)
