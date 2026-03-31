# spec consistency handoff hardening

## Summary

* `inputs/2026-03-30/spec` 全体を再レビューし、screen ID / route / endpoint / 権限 / 技術前提の不整合を解消した。
* 参加前 actor と workspace role を分離し、招待 preview、member remove、owner transfer の挙動を full-stack 実装向けに固定した。
* `確認事項.md` の未決を仕様へ吸収し、現時点では open item 0 件にした。

## Main fixes

### Canonical naming / route / endpoint

* `workspace.resolution`, `workspace.invitation_accept`, `workspace.join_request`, `knowledge.create`, `knowledge.revisions`, `question.create`, `notification.list`, `bookmark.list` を canonical 名として全仕様へ統一した。
* route は `/workspace/resolve`, `/workspace/join`, `/invitations/[token]`, `/review-queue`, `/knowledges/[knowledgeId]/revisions` に統一した。
* 旧 endpoint / 旧表記を除去し、以下を canonical path とした。
  * `GET /api/workspace-invitations/{token}`
  * `POST /api/questions/{questionId}/answers`
  * `POST /api/questions/{questionId}/knowledges`
  * `POST /api/notifications/{notificationId}/read`
  * `GET/POST /api/workspaces/current/tags`

### Permission / state / business rule realism

* workspace role は active member にのみ適用し、参加前は `unaffiliated authenticated user`, `invitation target user`, `join request applicant` を actor として別管理にした。
* member remove / owner transfer を具体化した。
  * owner は admin / reviewer / member を remove 可
  * admin は reviewer / member のみ remove 可
  * owner の self remove 不可
  * owner 変更は `POST /api/workspaces/current/owner-transfer` のみ
* `review_requested` / `changes_requested` 中の save は `shared` に戻す仕様で統一した。
* `questions.archived -> open` は MVP 非対応に統一し、復帰遷移を除去した。

### Technical defaults fixed into spec

* auth session は `Web=session cookie + DB managed session`, `Mobile=access token + rotating refresh token` に固定した。
* rich text は `Web=Tiptap`, `Mobile=markdown-first editor` に固定した。
* search ranking は `title > summary > body > tag`, tie-break は `updated_at DESC` に固定した。
* product notification は in-app only、招待 / 再送は transactional email に固定した。

### Wording hardening

* UI ガイドや nullable 入力は、実装判断が残らない文面へ修正した。
  * `source_answer_id` は未指定時 `null`
  * draft 保存では `summary / result_type / context_text` に `null` を許容
  * タグ数は UI 上 `1〜5個` ガイド表示、0個でも保存可
  * 却下理由は未入力可、その場合 `reason_text = null`

## Verification

* `画面仕様書.md` と `画面APIデータ対応表.md` に出現する endpoint が `API概要設計書.md` に全件定義されていることを差分スクリプトで確認した。
* `rg` により、旧 screen ID / route / endpoint の残存が 0 件であることを確認した。
* `確認事項.md` は `現時点の確認事項なし` へ更新した。
* 追加の build / lint / test は未実施。今回は仕様文書のみの更新。

## Changed files

* `inputs/2026-03-30/spec/README.md`
* `inputs/2026-03-30/spec/実装前提・技術基準.md`
* `inputs/2026-03-30/spec/実装技術一覧.md`
* `inputs/2026-03-30/spec/用語・正規一覧.md`
* `inputs/2026-03-30/spec/API概要設計書.md`
* `inputs/2026-03-30/spec/テーブル定義.md`
* `inputs/2026-03-30/spec/画面仕様書.md`
* `inputs/2026-03-30/spec/画面APIデータ対応表.md`
* `inputs/2026-03-30/spec/権限マトリクス.md`
* `inputs/2026-03-30/spec/業務仕様書.md`
* `inputs/2026-03-30/spec/状態遷移仕様.md`
* `inputs/2026-03-30/spec/バリデーション・業務ルール一覧.md`
* `inputs/2026-03-30/spec/実装スコープ分解書.md`
* `inputs/2026-03-30/spec/受け入れ基準.md`
* `inputs/2026-03-30/spec/確認事項.md`
