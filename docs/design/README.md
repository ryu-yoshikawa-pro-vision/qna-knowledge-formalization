# Design Directory Guide

## 1. 目的

`docs/design/` は visual / system 原則、screen prompt、raw export、保守対象 prototype の責務を分離し、`docs/spec/` と矛盾しない形で design artifact を保守するためのディレクトリである。

## 2. Authority Matrix

| 区分 | 正本 | 決めること | 補足 |
| --- | --- | --- | --- |
| 振る舞い / state / role / API / acceptance | `docs/spec/` | 画面責務、状態遷移、権限、API、table、受け入れ基準 | `README.md` の優先順位に従う |
| visual / system 原則 | `docs/design/DESIGN.md` | tone、layout、badge、component language、禁止 UI | `docs/design/DESIGN_日本語.md` は和訳参照 |
| foundation prompt | `docs/design/0-1. Foundation _ App Shell.md` / `0-2. Admin Table Foundation.md` | 共通 app shell / admin table の生成指示 | raw export 生成の前提 |
| screen prompt | `docs/design/*.md` の screen prompt 群 | 各 screen の生成意図と visual guidance | 振る舞いは spec を上書きしない |
| raw export | `docs/design/Google Stitch/*/code.html` | Stitch が出力した未整備 HTML | 参照専用、保守対象外 |
| exploratory reference | `docs/design/Google Stitch/blueprint_enterprise/DESIGN.md` | 追加の visual idea | canonical ではない |
| screen manifest | `docs/design/screen-map.md` | 20 screen ID と prompt / raw export / prototype の対応 | screen ID を主キーにする |
| 保守対象 demo | `docs/design/prototype/` | click-through prototype、共通 shell、fixture、route manifest | static multi-page、mock state 前提 |

## 3. Directory Taxonomy

- `DESIGN.md`
  - English source-of-truth for the visual system.
- `DESIGN_日本語.md`
  - `DESIGN.md` の参照用和訳。内容差分を作らない。
- `0-1. Foundation _ App Shell.md`
  - signed-in shell と reusable browsing components の生成 prompt。
- `0-2. Admin Table Foundation.md`
  - admin screens の table foundation prompt。
- `1. ...` から `20. ...`
  - 20 screen の Stitch prompt。
- `Google Stitch/`
  - raw export の保管場所。`code.html` と `screen.png` を元のまま保持する。
- `screen-map.md`
  - spec / prompt / raw export / prototype の traceability manifest。
- `prototype/`
  - 保守対象の linked demo。shared assets と screen wrappers で構成する。

## 4. Prototype Contract

`docs/design/prototype/` は次を満たすこと。

- `index.html` から 20 画面すべてへ移動できる
- route filename は screen ID 従属の kebab-case slug とする
- signed-in screen は共通 header / sidebar / page header / status badge / empty/error/permission/loading を共有する
- fixture は少なくとも `owner`、`admin`、`reviewer`、`member`、`unaffiliated authenticated user`、`invitation target user`、`join request applicant` を扱える
- mutation は実行せず、擬似遷移と注記で state / side effect を示す
- `question.detail` の履歴は別 route を作らず modal / side panel として表現する
- `admin.members` は `Members`、`Invitations`、`Join Requests` の 3 subsection を持つ

## 5. Update Policy

### 5-1. spec が更新されたとき

次を同一変更で確認または更新する。

1. `docs/spec/用語・正規一覧.md`
2. `docs/spec/画面仕様書.md`
3. `docs/spec/画面APIデータ対応表.md`
4. `docs/spec/受け入れ基準.md`
5. `docs/design/screen-map.md`
6. `docs/design/prototype/README.md`
7. 影響する prototype route

### 5-2. prompt が更新されたとき

1. 対応 screen ID を `screen-map.md` で特定する
2. spec と不整合がないか確認する
3. raw export へ再生成する必要がある場合のみ `Google Stitch/` を上書き保存する
4. 保守対象 prototype へは必要差分だけを手で反映する

### 5-3. raw export が更新されたとき

1. `Google Stitch/` に保存する
2. `screen-map.md` の参照 path が変わっていないか確認する
3. `prototype/` は自動上書きしない
4. 見た目差分を手で取り込み、spec と acceptance を再確認する

## 6. Validation Checklist

- `screen-map.md` に 20 screen ID 全件がある
- prompt / raw export / prototype file が全 screen ID に 1 件以上紐付く
- prototype の signed-in pages に workspace 名、通知未読、review queue がある
- review queue badge は `reviewer` / `admin` / `owner` でのみ表示される
- `loading / empty / error / permission_denied` が list/detail/admin で確認できる
- `href="#"` や未接続 anchor が prototype に残っていない
- Scenario 1〜10 の確認 route が `prototype/README.md` から辿れる

## 7. Maintenance Notes

- design artifact では常に screen ID を主キーとして扱い、route slug は display / filesystem 上の別名に留める。
- `blueprint_enterprise` はアイデア参照には使えるが、振る舞い・状態・権限の判断根拠に使わない。
- prototype で spec 未定義項目に遭遇した場合は `docs/spec/確認事項.md` を確認し、未記載なら spec 側へ起票してから反映する。
