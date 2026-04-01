# 計画書

## 0. 依頼概要
- 依頼内容: `inputs/2026-03-31/懸念点2.md` を確認し、`docs/spec` を完全な handoff 仕様へ更新する
- 背景: API contract、auth 既定、join request path、member 管理通知に齟齬が残っている
- 期待成果: `docs/spec` の矛盾解消、`確認事項.md` の close 維持、懸念点評価記録の追加

## 1. ゴール / 完了条件
- ゴール: `API概要設計書.md` を正本として request / response / auth / side effect を追加判断なしに実装できる状態にする
- 完了条件（DoD）:
  - `/api/workspace-join-requests/{id}` が `docs/spec` から消える
  - `API概要設計書.md` に contract 補完と auth 既定ルールが追加される
  - member 管理 API の通知副作用が除去される
  - `懸念点2_対応記録.md` に全懸念点の判定が残る

## 2. 現状理解と前提
- Current understanding:
  - `API概要設計書.md` には local `response` 未記載と local `auth` 未記載が多数残る
  - `workspace-join-requests/{id}` が `API概要設計書.md`、`テーブル定義.md`、`バリデーション・業務ルール一覧.md`、`画面APIデータ対応表.md`、`画面仕様書.md` に残っている
  - `notification_type` / `notification_target_type` に member 管理通知がない一方、API matrix 側には通知副作用が残っている
- Assumptions:
  - response contract は envelope と `data.items` に全面統一する
  - DTO 詳細は `API概要設計書.md` に集約する
  - member 管理通知は新設しない
- Non-goals:
  - 実装コードや migration の追加
  - scope 拡張

## 3. 影響範囲
- Impacted areas:
  - `docs/spec/API概要設計書.md`
  - `docs/spec/用語・正規一覧.md`
  - `docs/spec/テーブル定義.md`
  - `docs/spec/バリデーション・業務ルール一覧.md`
  - `docs/spec/画面APIデータ対応表.md`
  - `docs/spec/画面仕様書.md`
  - `docs/spec/確認事項.md`
  - `inputs/2026-03-31/懸念点2_対応記録.md`
- Files to inspect:
  - `inputs/2026-03-31/懸念点2.md`
  - `docs/spec/*`

## 4. 変更方針
- Change strategy:
  - `API概要設計書.md` で response contract と auth 既定を先に固定する
  - DTO と response 補完を `# 23` に集約する
  - path parameter と member 管理通知の差分を参照系文書へ伝播する
  - 最後に懸念点評価記録と確認事項を整える
- 実行タスク:
  - [ ] 1. `API概要設計書.md` を補完する
  - [ ] 2. `用語・正規一覧.md` と `テーブル定義.md` を更新する
  - [ ] 3. 参照系文書と評価記録を更新し、grep 検証する

## 5. 検証方法
- Validation plan:
  - `rg -n '\{id\}' docs/spec`
  - `rg -n 'data\\.revisions|data\\.tags|data\\.answers|data\\.comments' docs/spec/API概要設計書.md`
  - `rg -n 'role 変更通知|transfer 通知|削除通知|members/\\{userId\\}/role.*notifications|owner-transfer.*notifications|members/\\{userId\\}/remove.*notifications' docs/spec`
- 成功判定:
  - path、response、notification の残存矛盾が grep で見つからない

## 6. リスクと未解決論点
- Risks:
  - response 全面正規化の置換漏れ
  - `owner-transfer` response の定義不足
- Open questions:
  - なし

## 7. 成果物
- 変更ファイル:
  - `docs/spec/*`
  - `inputs/2026-03-31/懸念点2_対応記録.md`
- 付随ドキュメント:
  - `.codex/runs/20260401-135421-JST/*`

## 8. 備考
- `確認事項.md` は新規 open item がなければ `現時点の確認事項なし` を維持する
