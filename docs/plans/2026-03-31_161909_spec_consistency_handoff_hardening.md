# 仕様書群の不整合解消と実装 handoff 完成化

## 0. 依頼概要
- 依頼内容: `inputs/2026-03-30/spec` を徹底レビューし、不整合や非現実的な点を修正して、迷いなく実装できるレベルまで完成化する。
- 背景: handoff 用に再編した仕様書群に、screen ID、route、API、権限、未決技術事項の揺れが残っている。
- 期待成果: `README.md` 起点で、任意の画面について route、API、table、権限、状態、副作用を一意に説明できる仕様群。

## 1. ゴール / 完了条件
- ゴール: 仕様書群の canonical 定義を一本化し、実装者の追加判断が不要な状態にする。
- 完了条件（DoD）:
  - screen ID、route、endpoint、status、role 名の不一致がなくなる
  - pre-membership actor と workspace role の混同が解消される
  - `確認事項.md` の open item が 0 件になる
  - `README.md` から読み始めた実装者が blind handoff review を通せる

## 2. 現状理解と前提
- Current understanding:
  - `用語・正規一覧.md` と `画面仕様書.md` appendix で screen ID が衝突している
  - `実装前提・技術基準.md` と `画面仕様書.md` appendix で route が衝突している
  - `API概要設計書.md`、`画面仕様書.md`、`画面APIデータ対応表.md` で tag/auth/question/notification API が衝突している
  - `権限マトリクス.md` で未所属ユーザー操作を workspace role で表現している
  - `確認事項.md` に auth session、editor、search ranking の技術未決が残っている
- Assumptions:
  - 今回は仕様書修正のみを行い、実装やコード生成は行わない
  - backend topology は `apps/web` の Route Handlers 前提を維持する
- Non-goals:
  - アプリコード実装
  - repo 構造や package の新規追加
  - 外部サービス vendor の最終契約判断

## 3. 影響範囲
- Impacted areas:
  - `spec` の canonical docs、traceability docs、validation docs、tech docs
  - run artifact と report
- Files to inspect:
  - `inputs/2026-03-30/spec/README.md`
  - `inputs/2026-03-30/spec/用語・正規一覧.md`
  - `inputs/2026-03-30/spec/実装前提・技術基準.md`
  - `inputs/2026-03-30/spec/実装技術一覧.md`
  - `inputs/2026-03-30/spec/API概要設計書.md`
  - `inputs/2026-03-30/spec/画面仕様書.md`
  - `inputs/2026-03-30/spec/画面APIデータ対応表.md`
  - `inputs/2026-03-30/spec/権限マトリクス.md`
  - `inputs/2026-03-30/spec/バリデーション・業務ルール一覧.md`
  - `inputs/2026-03-30/spec/状態遷移仕様.md`
  - `inputs/2026-03-30/spec/テーブル定義.md`
  - `inputs/2026-03-30/spec/業務仕様書.md`
  - `inputs/2026-03-30/spec/確認事項.md`

## 4. 変更方針
- Change strategy:
  - `用語・正規一覧.md`、`実装前提・技術基準.md`、`API概要設計書.md` を canonical source として一本化する
  - screen ID、route、endpoint の衝突は appendix/traceability 側を canonical source に合わせる
  - pre-membership actor を別節で明文化し、workspace role は membership 成立後だけに適用する
  - 技術未決は `実装前提・技術基準.md` と `実装技術一覧.md` に吸収し、`確認事項.md` を空にする
  - normative section の曖昧語を除去し、固定値へ落とす
- 実行タスク:
  - [ ] 1. plan を保存し、run artifact を今回の作業内容に追記する
  - [ ] 2. canonical docs を更新する
  - [ ] 3. screen / traceability docs を canonical に合わせる
  - [ ] 4. permission / validation / state / table docs を canonical に合わせる
  - [ ] 5. blind handoff 向けの grep review と report を更新する

## 5. 検証方法
- Validation plan:
  - `rg` で screen ID、route、endpoint path の旧表記が残っていないか確認する
  - 7 シナリオで画面→API→table→権限→状態→通知が一意に辿れるか確認する
  - `確認事項.md` が open item 0 件になっていることを確認する
- 成功判定:
  - 新しい実装者が `README.md` から任意の画面を辿って追加判断なしで実装開始できる

## 6. リスクと未解決論点
- Risks:
  - 複数文書で同じ概念を持っているため、部分修正だと新たな食い違いを生みやすい
  - 技術文書の推奨語を残すと実装判断が再発する
- Open questions:
  - なし。既存 source と user 指示から今回の修正方針は確定できる

## 7. 成果物
- 変更ファイル:
  - `inputs/2026-03-30/spec/*.md` のうち canonical と traceability に関わる主要文書
- 付随ドキュメント:
  - `docs/reports/` の作業レポート

## 8. 備考
- `確認事項.md` は削除せず、open item 管理用の空箱として残す
