# `inputs/2026-03-30/spec` を Full-Stack 実装ハンドオフ資料へ再編する計画

## 0. 依頼概要
- 依頼内容:
  - `inputs/2026-03-30/spec` を、未知の Codex が読んで一から実装できる full-stack handoff 資料へ再編する
- 背景:
  - 現状の `spec` は情報量はあるが、読む順番、優先順位、traceability、技術前提、実装順が `spec` 単体では十分に閉じていない
- 期待成果:
  - `spec` だけで Backend / Web / Mobile 実装を開始できる handoff パック

## 1. ゴール / 完了条件
- ゴール:
  - `inputs/2026-03-30/spec` を self-contained な full-stack handoff 資料へ変換する
- 完了条件（DoD）:
  - `spec/README.md` から読む順番、優先順位、実装開始手順が分かる
  - 新規 handoff 文書群が追加されている
  - 既存 8 文書が責務・依存・優先定義付きで補強されている
  - 既知の欠落 API / review model / traceability 文書が補完されている
  - 不整合は解消され、未決事項は `確認事項.md` に閉じている

## 2. 現状理解と前提
- Current understanding:
  - 既存 `spec` は要件、業務、状態、権限、API、DB、画面、バリデーションを分割保持している
  - ただし unknown Codex 向けの handoff としては、実装順、文書優先順位、traceability、技術前提の固定が不足している
- Assumptions:
  - handoff 対象は full-stack
  - 技術前提は `Next.js App Router + Expo Router + monorepo + PostgreSQL`
  - `questions.archived -> open` は MVP 非対応に統一する
- Non-goals:
  - 実アプリ実装
  - `Webとモバイル同時開発.md` 自体の整理

## 3. 影響範囲
- Impacted areas:
  - `inputs/2026-03-30/spec/*.md`
  - `docs/plans/`
  - `.codex/runs/20260331-135012-JST/`
- Files to inspect:
  - `inputs/2026-03-30/spec/API概要設計書.md`
  - `inputs/2026-03-30/spec/テーブル定義.md`
  - `inputs/2026-03-30/spec/画面仕様書.md`

## 4. 変更方針
- Change strategy:
  - 新規 handoff 文書を追加し、既存 8 文書は骨格として活かしつつ handoff 情報を補う
  - `spec` 単体で完結することを最優先とし、元資料参照必須の記述を残さない
  - 既知の不足はデフォルトを固定して `spec` に反映する
- 実行タスク:
  - [ ] 1. `README.md`、技術前提、用語一覧、対応表、実装スコープ、受け入れ基準を追加する
  - [ ] 2. 既存 8 文書へ責務・依存・優先定義と handoff 補足を追加する
  - [ ] 3. 欠落 API / review model / 不整合を解消し、必要なら `確認事項.md` を作る

## 5. 検証方法
- Validation plan:
  - API / 画面 / テーブル / 状態 / 権限の traceability を対応表で確認
  - 主要 7 シナリオが `受け入れ基準.md` で通ることを確認
  - unknown Codex が `README.md` から読んで着手順を説明できる構成になっていることをセルフチェック
- 成功判定:
  - `spec` だけで実装判断が残らない

## 6. リスクと未解決論点
- Risks:
  - 文書量が増えすぎると handoff 性が逆に下がる
  - 既存 8 文書の責務が曖昧なままだと重複が残る
- Open questions:
  - source だけで確定できない技術詳細は `確認事項.md` へ隔離する

## 7. 成果物
- 変更ファイル:
  - `inputs/2026-03-30/spec/*.md`
  - `.codex/runs/20260331-135012-JST/*`
- 付随ドキュメント:
  - `docs/plans/2026-03-31_135012_spec_handoff_reorganization.md`

## 8. 備考
- 実装着手者が元の会話ログを読まなくてよい構成を目指す
