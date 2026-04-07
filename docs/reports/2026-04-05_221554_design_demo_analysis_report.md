# docs/design 調査レポート

## 概要
- 目的: `docs/design` の現状を把握し、デザイン統一と linked demo 化の進め方を決める。
- 結論: 設計原則は既に十分あるため、次に必要なのは design system の再発明ではなく、source-of-truth と prototype 保守単位の再編である。

## 確認した事実
- repo は handoff / 仕様リポジトリであり、実装用の build config は存在しない。
- `docs/design` には以下がある。
  - `DESIGN.md` / `DESIGN_日本語.md`
  - foundation prompt 2 件
  - screen prompt 20 件
  - Google Stitch `code.html` 20 件と `screen.png` 20 件
  - `blueprint_enterprise/DESIGN.md`
- `DESIGN.md` には以下が明示されている。
  - knowledge-first
  - state-driven UI
  - shared app shell
  - 画面テンプレート単位での統一
  - 優先 prototype flow
- Google Stitch HTML は各画面が独立しており、`href="#"` が 108 件ある。
- Login / Knowledge List の HTML では Tailwind config、フォント読込、app shell が各ファイルに埋め込まれている。

## 主要な観察
- 問題の中心は「デザイン方針が足りない」ことではなく、「再利用可能な screen map / route map / shared asset がない」こと。
- 現状の `Google Stitch` フォルダは raw export としては有用だが、保守対象としては重複が多く、今後の修正コストが高い。
- `blueprint_enterprise/DESIGN.md` は表現がやや exploratory で、現在の `DESIGN.md` と同格に扱うと判断軸が増えすぎる。

## 推奨方針
1. `DESIGN.md` を canonical、`DESIGN_日本語.md` を companion として整理する。
2. `Google Stitch` は raw export として固定し、linked demo は `docs/design/prototype/` に再配置する。
3. 20 画面を一気に触らず、まずは `screen-map.md` で slug と flow を固定する。
4. 共有 token / app shell / route manifest を先に整備し、その後に個別画面を移行する。
5. 連携は `DESIGN.md` にある優先フローから始める。

## 優先フロー案
- 初回参加: Login -> Workspace Join Gateway -> Invitation Acceptance / Join Request -> Knowledge List
- ナレッジ閲覧・編集: Knowledge List -> Knowledge Detail -> Knowledge Create/Edit -> Knowledge History
- 正式ナレッジ改訂: Knowledge Detail -> Draft Creation -> Draft Detail/Edit -> Review Queue -> Knowledge Detail
- Q&A ナレッジ化: Question List -> Question Detail -> Knowledge Create or Draft 系

## 実行コマンド
- `Get-Content docs/PROJECT_CONTEXT.md`
- `Get-Content PLANS.md`
- `Get-Content .agents/skills/feature-plan/SKILL.md`
- `Get-Content .agents/skills/feature-plan/references/planning-workflow.md`
- `rg --files docs/design`
- `rg --files -g '*.html'`
- `Get-Content docs/design/DESIGN.md`
- `Get-Content docs/design/DESIGN_日本語.md`
- `Get-Content 'docs/design/0-1. Foundation _ App Shell.md'`
- `Get-Content 'docs/design/0-2. Admin Table Foundation.md'`
- `Get-Content 'docs/design/Google Stitch/1. Login Screen/code.html' -TotalCount 220`
- `Get-Content 'docs/design/Google Stitch/3. Knowledge List Screen/code.html' -TotalCount 260`

## 次アクション
- 計画書の順に、まず `docs/design/README.md` と `screen-map.md` を整備する。
- 次に `prototype/` を作り、shared asset と entry page を作成する。
- その後に priority flow から HTML を接続する。
