# Google Stitch 忠実再現プロトタイプ計画

## Goal
- `docs/design/Google Stitch` の 20 画面を視覚的にほぼそのまま引き継ぎ、`docs/design/prototype/` 配下に相互リンク可能な static multi-page prototype を作る。
- デザイン判断は Codex 独自で足さず、raw export の見た目を優先しつつ、遷移・状態・権限は spec と screen-map に合わせて接続する。

## Current understanding
- raw export は `tailwindcss CDN + Google Fonts + Material Symbols + 外部画像 URL` を各画面が個別保持している。
- 画面群は `gateway` 4 画面と、共通 sidebar/header を持つ signed-in 画面に整理できる。
- canonical な route slug、主要 flow、状態、actor は `docs/design/screen-map.md` と `docs/spec/画面仕様書.md` で既に固定されている。
- `docs/design/prototype/` は未作成で、今回の成果物はここを新設する形になる。

## Assumptions
- 外部 CDN / Google Fonts / Stitch の画像 URL は維持し、見た目の忠実度を優先する。
- prototype は静的 HTML/CSS/JS とし、Next.js 化や backend 接続は行わない。
- 状態切替は常設の debug UI ではなく、`index.html` / README から辿る query param ベースで表現し、画面の見た目自体は Stitch に寄せる。

## Non-goals
- Google Stitch デザインの再解釈やリデザイン
- spec / API / schema / ADR の振る舞い変更
- backend を伴う本当の mutation 実装
- remote asset のローカル化

## Impacted areas
- `docs/design/prototype/`: 20 route、`index.html`、shared assets、`README.md`
- `docs/design/screen-map.md`: 必要なら prototype 実体 path や state traceability の補足だけ更新
- public interface:
  - shared query params `fixture`, `state`, `tab`, `modal`

## Change strategy
- 各 `code.html` を画面ごとの visual source として使い、class 名・DOM 構造・配色・余白は可能な限りそのまま保持する。
- 重複している Tailwind config、font/icon import、fixture/state 判定、route 解決だけを shared asset に切り出し、見た目ではなく配線だけを共通化する。
- `href="#"` と未接続 CTA をすべて `screen-map` の `route_slug` に沿った相対リンクへ置換する。
- 最低限次の flow を相互リンクで通す:
  - `auth.login` → `workspace.resolution` → `knowledge.list`
  - `admin.members` → `workspace.invitation_accept` → `knowledge.list`
  - `knowledge.create` → `knowledge.detail` → `review.queue` → `knowledge.detail`
  - `knowledge.detail` → `knowledge.edit_draft_create` → `knowledge.edit_draft_detail` → `review.queue` → `knowledge.detail`
  - `question.create` → `question.detail` → `knowledge.create`
- `question.detail` の履歴は別 route を作らず、同一ページ内の modal / side panel で表現する。
- `admin.members` は `Members / Invitations / Join Requests` の 3 subsection を持たせる。
- role-aware 表示は fixture で制御し、review queue badge は `reviewer / admin / owner` のみ、admin nav は権限者のみ表示する。

## Validation plan
- 各 route を対応する `screen.png` と比較し、レイアウト、余白、色、タイポ、主要コンポーネントが一致していることを確認する。
- `href="#"`、未接続 anchor、死んだ primary action が残っていないことを確認する。
- `index.html` から 20 画面すべてへ移動でき、`screen-map.md` の Flow Coverage を一通り辿れることを確認する。
- list 画面で `loading / empty / error`、detail/admin 画面で `loading / error / permission_denied` を確認する。
- `review queue` badge の表示条件、`question.detail` 履歴 panel、`admin.members` 3 subsection を確認する。

## Risks
- 外部参照維持のため、ネットワーク断や画像 URL 失効時は見た目の再現性が落ちる。
- raw export ごとに微妙な shell 差分があるため、共通化しすぎると忠実度が下がる。
- static prototype なので、一部の state change は擬似遷移と注記で表現する必要がある。

## Open questions
- なし
