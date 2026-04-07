# デザイン整理・デモ統合計画

## 0. 依頼概要
- 依頼内容: `docs/spec` を正本として `docs/design` の設計資料と HTML デモの整理・統合方針を見直し、現行仕様に整合する完全な計画書へ修正する。
- 背景: `docs/design` には design principle、screen prompt、Google Stitch の raw export が揃っているが、現計画書は `docs/design` 内の再編には強い一方で、`docs/spec` の screen ID、画面責務、状態、権限、API/データ対応、受け入れ基準との traceability が不足している。
- 期待成果: `docs/design` の source-of-truth、screen manifest、prototype 構成、実装順、検証条件、更新ルールが `docs/spec` と一貫する planning artifact。

## 1. ゴール / 完了条件
- ゴール:
  - `docs/design` の artifact を「仕様の参照元」「visual/system 原則」「screen prompt」「raw export」「保守対象 prototype」に分け、優先順位を固定する。
  - `docs/spec/用語・正規一覧.md` の 20 screen ID 全件を、`docs/design` の prompt / Stitch export / prototype route と対応付ける。
  - prototype 整備計画を `docs/spec/実装スコープ分解書.md` の slice 順に並べ替え、role/state/acceptance まで含めて実装者が追加判断なしで着手できる粒度にする。
- 完了条件（DoD）:
  - `docs/spec` が振る舞いの正本、`docs/design/DESIGN.md` が visual/system 原則の正本であることが計画書に明記されている。
  - screen manifest に必要な項目と route 命名規則が定義されている。
  - prototype の共通 UI、画面移行順、flow 優先順位、検証観点が spec の画面仕様・権限・状態・受け入れ基準と対応付いている。
  - raw export 更新時、spec 更新時、prototype 更新時の同期ルールが定義されている。

## 2. 現状理解と前提
- Current understanding:
  - `docs/spec/README.md` は handoff パックの読む順番と文書優先順位を定義しており、画面の振る舞い、状態、権限、API、受け入れ基準は `docs/spec` を正本として扱う必要がある。
  - `docs/spec/用語・正規一覧.md` では 20 画面の screen ID が `auth.login` から `admin.tags` まで固定されているため、prototype 側の route slug は screen ID に従属する別名として管理すべきである。
  - `docs/spec/画面仕様書.md` は共通ヘッダー、共通ナビ、共通バッジ、共通画面状態に加えて、4 本の基本フローと各画面の表示責務を定義している。特に `question.detail` の履歴は別画面ではなく同画面内 modal / side panel、`resolved_locked` の回答は固定時点と再オープン後で分離表示が必須である。
  - `docs/spec/画面APIデータ対応表.md` は各 screen ID ごとの主 API、read/write table、権限分岐、通知 / 副作用を定義しており、header 依存 API も別表で固定されている。
  - `docs/spec/状態遷移仕様.md`、`docs/spec/権限マトリクス.md`、`docs/spec/バリデーション・業務ルール一覧.md` は、formal knowledge 直接編集禁止、`review_requested` 中の再保存時は `shared` に戻す、招待 / 参加申請 / 編集下書き / tag merge / 通知重複抑止などの UI 前提を定義している。
  - `docs/spec/受け入れ基準.md` は少なくとも 10 シナリオを prototype / design review の確認観点として持つべきであり、現計画書は Scenario 8〜10 と一部 cross-cutting 条件を十分に反映していない。
  - `docs/design` には `DESIGN.md`、`DESIGN_日本語.md`、Foundation 2 件、screen prompt 20 件、Google Stitch raw export 20 件、`blueprint_enterprise/DESIGN.md` がある。Google Stitch export には `href="#"` が 108 件残っており、現状は画面遷移が未接続である。
  - `docs/design/Google Stitch/blueprint_enterprise/DESIGN.md` は exploratory reference であり、`docs/design/DESIGN.md` や `docs/spec` より優先して振る舞いを決める文書ではない。
- Assumptions:
  - 保守対象の linked demo は当面 `docs/design` 配下の静的 multi-page prototype として整備し、runtime backend 連携は行わない。
  - `docs/design/Google Stitch/` は raw export 保管場所として残し、保守対象 prototype は別ディレクトリに切り出す。
  - route filename / slug は filesystem 向けの別名として使うが、manifest・README・検証では常に spec の screen ID を主キーにする。
  - form submit や state change は backend 実行ではなく、主要 CTA / nav / acceptance-critical な擬似遷移と注記で表現する。
- Non-goals:
  - `docs/spec` の業務仕様や API 仕様そのものを変更すること
  - `docs/design/DESIGN.md` のコア原則を再設計すること
  - Google Stitch raw export を保守対象として直接育て続けること
  - 完全なアプリ実装や高忠実度のデータ永続化シミュレーション

## 3. 影響範囲
- Impacted areas:
  - `docs/plans/2026-04-05_221554_design_demo_unification_plan.md`
  - `docs/design/README.md`
  - `docs/design/DESIGN.md`
  - `docs/design/DESIGN_日本語.md`
  - `docs/design/0-1. Foundation _ App Shell.md`
  - `docs/design/0-2. Admin Table Foundation.md`
  - `docs/design/*.md` の screen prompt 群
  - `docs/design/Google Stitch/` の raw export 群（参照専用）
  - 追加予定の `docs/design/screen-map.md`
  - 追加予定の `docs/design/prototype/`
- Files to inspect:
  - `docs/spec/README.md`
  - `docs/spec/用語・正規一覧.md`
  - `docs/spec/画面仕様書.md`
  - `docs/spec/画面APIデータ対応表.md`
  - `docs/spec/状態遷移仕様.md`
  - `docs/spec/権限マトリクス.md`
  - `docs/spec/バリデーション・業務ルール一覧.md`
  - `docs/spec/受け入れ基準.md`
  - `docs/spec/実装スコープ分解書.md`
  - `docs/design/DESIGN.md`
  - `docs/design/DESIGN_日本語.md`
  - `docs/design/Google Stitch/blueprint_enterprise/DESIGN.md`
  - `docs/design/Google Stitch/*/code.html`
  - `docs/design/*.md` の foundation / screen prompt

## 4. 変更方針
- Change strategy:
  - Phase 0. 正本と責務を固定する
    - `docs/design/README.md` を追加し、振る舞い・状態・権限・API・acceptance は `docs/spec`、visual/system 原則は `docs/design/DESIGN.md` / `DESIGN_日本語.md`、raw export は `docs/design/Google Stitch/`、保守対象 demo は `docs/design/prototype/` と明文化する。
    - `blueprint_enterprise/DESIGN.md` は exploratory reference と位置付け、canonical ではないことを明記する。
    - `docs/design/DESIGN.md` から `docs/spec/画面仕様書.md` の共通 UI / prohibited UI / flow への参照を追加し、visual 原則と振る舞い仕様を分離する。
  - Phase 1. 20 画面の traceability を作る
    - `docs/design/screen-map.md` を追加し、screen ごとに `screen_id`、日本語画面名、route_slug、template category、spec slice、primary actor、entry condition、required states、required common UI、main actions、primary APIs、main read/write tables、notification / side effect、acceptance scenario、prompt file、Stitch export path、prototype file を 1 行で対応付ける。
    - screen-map の route は例として `knowledge.detail -> knowledge-detail.html` のように定義し、screen ID を主、slug を従とする。
    - `question.detail` には「質問履歴 / 回答履歴は同画面内 modal / side panel」であること、`admin.members` には members / invitations / join requests の 3 subsection を持つことを manifest に明記する。
  - Phase 2. prototype の共通基盤を spec 準拠で作る
    - `docs/design/prototype/` を新設し、`index.html`、`README.md`、`assets/tokens.css`、`assets/base.css`、`assets/routes.js`、`assets/mock-state.js`、必要に応じて `assets/mock-data.js` を置く。
    - 共通ヘッダーには `workspace name`、`notifications unread badge`、`review queue badge` の表示責務を持たせ、reviewer / admin / owner だけ review queue badge を表示する。
    - 共通 UI として app shell、sidebar nav、status badge、search/filter bar、empty/error/permission/loading state、admin table pattern を定義する。
    - prototype の fixture には少なくとも `owner` / `admin` / `reviewer` / `member` と `unaffiliated authenticated user` / `invitation target user` / `join request applicant` を含め、権限差分を確認できるようにする。
  - Phase 3. 実装順を spec の slice に合わせて段階化する
    - Slice 1: `auth.login`、`workspace.resolution`、`workspace.invitation_accept`、`workspace.join_request`
      - workspace 作成、招待 preview、招待受諾 error、join request comment、join request cancel まで prototype で表現する。
    - Slice 2: `knowledge.list`、`knowledge.detail`、`bookmark.list`
      - formal default、未レビュー導線、bookmark、header badge、empty state、archive 表示、Q&A 由来表示を先に揃える。
    - Slice 3: `knowledge.create`、`knowledge.edit`、`review.queue`
      - `submit_action = draft / shared / request_review`、差し戻し理由、`review_requested -> shared` への戻り、review queue badge と queue list の一致、comments / links の最低限導線を表現する。
    - Slice 4: `knowledge.revisions`、`knowledge.edit_draft_create`、`knowledge.edit_draft_detail`
      - formal と edit draft の分離、未完了下書き 1 件制約、`draft_visibility`、apply 後に正式版更新・旧版履歴保存を示す。
    - Slice 5: `question.list`、`question.detail`、`question.create`、`question.edit`
      - `open -> resolved_locked -> open`、解決時点の回答と再オープン後回答の分離、Q&A から knowledge 作成、質問 / 回答履歴導線を表現する。
    - Slice 6: `notification.list` と cross-cutting 機能
      - notification list、single/all read、comments / links / bookmark の横断導線、通知種別と dedupe 前提を整理する。
    - Slice 7: `admin.members`、`admin.tags`
      - invitations、join requests、role change、member remove、owner transfer、tag rename / merge / archive、merged tag search 影響まで review できる table UI を整える。
  - Phase 4. maintenance ルールを文書化する
    - screen 追加・削除・改名時は `docs/spec/用語・正規一覧.md`、`docs/spec/画面仕様書.md`、`docs/spec/画面APIデータ対応表.md`、`docs/spec/受け入れ基準.md` と `docs/design/screen-map.md` を同時更新する。
    - raw export 更新時は `Google Stitch/` に上書き保管し、保守版 prototype へは screen-map を見ながら必要差分のみを取り込む。
    - prompt 更新時は対応 screen の `screen-map.md` と prototype route を確認し、spec と不整合があれば prompt より spec を優先して差し戻す。
- 実行タスク:
  - [x] 1. `docs/design/README.md` に authority / directory taxonomy / update policy を追加する
  - [x] 2. `docs/design/screen-map.md` を追加し、20 screen ID 全件を spec / prompt / Stitch / prototype に対応付ける
  - [x] 3. `docs/design/prototype/` を新設し、共通 shell / state / role fixture / route manifest を作る
  - [x] 4. Slice 1〜2 の画面を接続し、初回参加・knowledge 閲覧導線を成立させる
  - [x] 5. Slice 3〜5 の画面を接続し、review / edit draft / Q&A knowledge 化導線を成立させる
  - [x] 6. Slice 6〜7 の個人機能 / 管理機能を接続し、通知・ブックマーク・管理 UI を成立させる
  - [x] 7. screen-map と README に基づく更新手順・確認手順を文書化する

## 5. 検証方法
- Validation plan:
  - coverage validation:
    - `docs/spec/用語・正規一覧.md` の 20 screen ID すべてに対して `screen-map.md` の行が存在することを確認する。
    - `docs/spec/画面APIデータ対応表.md` の各 screen ID に対して、`screen-map.md` に primary API / table / side effect の対応があることを確認する。
    - すべての design prompt、Stitch export、prototype route が少なくとも 1 つの `screen_id` に紐付いており、孤立ファイルがないことを確認する。
  - flow validation:
    - `docs/spec/受け入れ基準.md` の Scenario 1〜10 を、prototype で「どの route からどの route / modal / state で確認するか」まで辿れることを確認する。
    - `docs/spec/画面仕様書.md` の基本フロー 4 本が `prototype/index.html` からクリックで追えることを確認する。
  - role/state validation:
    - `owner` / `admin` / `reviewer` / `member` と参加前 actor ごとに、表示される action と hidden にすべき action が `権限マトリクス.md` と矛盾しないことを確認する。
    - `knowledge`、`knowledge edit draft`、`question`、`workspace invitation`、`workspace join request` の主要 state と遷移結果が `状態遷移仕様.md` と矛盾しないことを確認する。
    - `review_requested` 中の編集で `shared` に戻ること、formal knowledge を直接編集させないこと、`resolved_locked` の回答分離を prototype 上で表現できていることを確認する。
  - UI validation:
    - 共通ヘッダーに workspace 名、通知未読、review queue 件数があり、review queue badge は reviewer / admin / owner だけに表示されることを確認する。
    - 一覧画面に `loading / empty / error`、詳細画面に `loading / error / permission_denied` が含まれていることを確認する。
    - `question.detail` の履歴導線が別 screen ではなく modal / side panel になっていることを確認する。
  - linkage validation:
    - `href="#"` や未解決 placeholder は、意図的に disabled と注記したもの以外をゼロにする。
    - 擬似送信後の遷移先とメッセージが acceptance-critical な副作用を誤解させないことを確認する。
- 成功判定:
  - `docs/design/README.md` と `docs/design/screen-map.md` を読めば、各 design artifact の責務、screen ID、主要 API / data、実装順、確認方法が分かる。
  - prototype で 20 画面全件に到達でき、主要 10 シナリオの確認経路が示せる。
  - role・state・badge・共通 UI が spec と矛盾しない。
  - raw export と保守版 prototype の責務が分離され、今後の取り込み手順が明確である。

## 6. リスクと未解決論点
- Risks:
  - `docs/spec` 更新に `docs/design/screen-map.md` が追随しないと、見た目だけ正しく振る舞いが古い prototype になる。
  - route slug を screen ID と切り離して自由命名すると、後続の spec 追従と review が困難になる。
  - `blueprint_enterprise` の表現を canonical 扱いすると、`DESIGN.md` の restrained / readability-first 原則と衝突する。
  - 20 画面を一括で接続してから整える進め方は、slice ごとの review と acceptance 対応を難しくする。
  - 擬似遷移の説明が弱いと、静的 prototype を実アプリ仕様と誤認する。
- Open questions:
  - 現時点の blocker はなし。今後 spec に未定義項目が見つかった場合のみ `docs/spec/確認事項.md` へ起票し、それまでは本計画の前提を確定値として扱う。

## 7. 成果物
- 変更ファイル:
  - `docs/plans/2026-04-05_221554_design_demo_unification_plan.md`
  - `docs/design/README.md`
  - `docs/design/DESIGN.md`
  - `docs/design/DESIGN_日本語.md`
  - `docs/design/screen-map.md`
  - `docs/design/prototype/`
- 付随ドキュメント:
  - 実装レポート: `docs/reports/2026-04-05_224810_design_demo_unification_implementation_report.md`
  - 参照証跡: `.codex/runs/20260405-224810-JST/PLAN.md`
  - 参照証跡: `.codex/runs/20260405-224810-JST/TASKS.md`
  - 参照証跡: `.codex/runs/20260405-224810-JST/REPORT.md`

## 8. 備考
- prototype の route は screen ID に従属する実装都合の命名であり、screen の正規名は必ず spec の screen ID を使う。
- raw export は保存対象、prototype は保守対象であり、どちらも削除せず責務分離で運用する。
