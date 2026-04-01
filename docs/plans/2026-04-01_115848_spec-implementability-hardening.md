# 仕様書整合化と事業向け提案書作成計画

## 0. 依頼概要
- 依頼内容: `inputs/2026-03-30/spec` のすべての仕様書を実装可能性の観点で再評価し、未解消の不整合や不足定義を修正したうえで、事業責任者向け提案書を作成する。
- 背景: 前回 handoff 強化後も、契約、DB、共通 API、横断ルールに実装不能点が残っている。
- 期待成果: 実装者が追加判断なしで着手できる仕様群と、修正の目的・効果・優先度を説明できる提案資料。

## 1. ゴール / 完了条件
- ゴール: `spec/` を実装判断不要な精度へ引き上げ、事業責任者向けに修正の価値を説明できる資料を整える。
- 完了条件（DoD）:
  - `UNAUTHORIZED`, `user_profiles`, `invitation_received`, revoke の `formal -> archived`, comment hide の本人許可記述が消えている
  - `user_sessions`, `request_comment`, `is_edited`, `edited_at`, `join_cancelled`, `search_vector`, `dedupe_key`, `submit_action`, `relationship_status` が仕様群で追える
  - 共通ヘッダー依存 API と Q&A 履歴導線が画面仕様・対応表・受け入れ基準に反映されている
  - 事業責任者向け提案書が `docs/reports/` に作成されている

## 2. 現状理解と前提
- Current understanding:
  - `API概要設計書.md` に `UNAUTHORIZED`, `membership_status`, revoke / comment hide の旧定義が残っている
  - `テーブル定義.md` に `user_sessions`, `request_comment`, `is_edited`, `search_vector`, `dedupe_key` が存在しない
  - notification enum に `invitation_received` と `workspace_invitation` が残っており、現行業務方針とずれている
  - 共通ヘッダー依存 API と Q&A 履歴 API が画面仕様・対応表・受け入れ基準で十分に追えていない
- Assumptions:
  - 今回は仕様書と提案書だけを更新し、アプリ実装は行わない
  - MVP 機能自体は削らない
  - Q&A 履歴は既存の `question.detail` に内包する
- Non-goals:
  - アプリコード実装
  - migration や codegen の実行
  - 外部連携の新規追加

## 3. 影響範囲
- Impacted areas:
  - `inputs/2026-03-30/spec` 一式
  - `docs/plans/`
  - `docs/reports/`
  - `.codex/runs/20260401-115848-JST/`
- Files to inspect:
  - `inputs/2026-03-30/spec/API概要設計書.md`
  - `inputs/2026-03-30/spec/テーブル定義.md`
  - `inputs/2026-03-30/spec/用語・正規一覧.md`
  - `inputs/2026-03-30/spec/画面仕様書.md`
  - `inputs/2026-03-30/spec/画面APIデータ対応表.md`
  - `inputs/2026-03-30/spec/バリデーション・業務ルール一覧.md`
  - `inputs/2026-03-30/spec/受け入れ基準.md`

## 4. 変更方針
- Change strategy:
  - `API概要設計書.md` と `テーブル定義.md` を先に修正し、契約と DB を閉じる
  - 次に `用語・正規一覧.md`、`画面仕様書.md`、`画面APIデータ対応表.md` へ反映する
  - 最後に `受け入れ基準.md` と提案書を作成し、grep で残存矛盾を検証する
- 実行タスク:
  - [x] 1. run を初期化し、計画保存先を決める
  - [ ] 2. `docs/plans` に今回の計画を保存する
  - [ ] 3. API 契約と横断ルールの不整合を修正する
  - [ ] 4. DB / enum / traceability / acceptance を整合させる
  - [ ] 5. 事業責任者向け提案書を `docs/reports` に作成する
  - [ ] 6. grep 検証と REPORT 更新で完了判定する

## 5. 検証方法
- Validation plan:
  - `rg` で `UNAUTHORIZED`, `user_profiles`, revoke の `formal -> archived`, comment hide の本人許可, `/api/knowledges/{id}`, `invitation_received` の残存が 0 件であることを確認する
  - API 文書、テーブル定義、画面仕様、対応表で `user_sessions`, `request_comment`, `is_edited`, `join_cancelled`, `search_vector`, `dedupe_key`, `submit_action`, `relationship_status` が追えることを確認する
  - 受け入れ基準に login / refresh / logout、knowledge 作成 action、正式取り下げ、join request コメント、comment edit / hide、Q&A 履歴、共通ヘッダー API、二重実行耐性が追加されていることを確認する
- 成功判定:
  - 実装者が `README.md` 起点で API / table / screen / acceptance を追加判断なしで辿れる

## 6. リスクと未解決論点
- Risks:
  - 多文書同時更新なので、修正順を誤ると新たな食い違いが入る
  - notification enum と業務仕様の対応が崩れると traceability が再度壊れる
- Open questions:
  - なし

## 7. 成果物
- 変更ファイル:
  - `inputs/2026-03-30/spec/*.md` のうち今回の不整合に関わる文書
- 付随ドキュメント:
  - `docs/reports/{yyyy-mm-dd}_{HHMMSS}_spec-implementation-proposal.md`
  - `.codex/runs/20260401-115848-JST/*`

## 8. 備考
- `確認事項.md` は未決が残らなければ `現時点の確認事項なし` のまま維持する
