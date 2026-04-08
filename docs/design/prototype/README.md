# Prototype README

## 1. 目的

`docs/design/prototype/` は Google Stitch の raw export を見た目優先で保持しながら、`docs/spec/` と `docs/design/screen-map.md` に沿って画面遷移と最低限の state / role-aware 制御を付与した static multi-page prototype である。

## 2. 構成

- `index.html`
  - 20 route と Scenario 1〜10 の launcher
- `assets/routes.js`
  - route manifest、raw export path、fixture/state/tab/modal の定義
- `assets/mock-state.js`
  - query param の解決、fixture 判定、href 生成
- `assets/mock-data.js`
  - state overlay と `question.detail` history panel の文言
- `assets/prototype.js`
  - iframe viewer、rewiring、state overlay、tab filter、permission-safe patch
- `assets/tokens.css`
  - shared token
- `assets/base.css`
  - index と viewer shell の style
- `*.html`
  - `screen-map.md` の `route_slug` に一致する 20 wrapper page
  - shared asset には content hash query を付け、ローカル検証時の stale cache を避ける
- `tools/build_stitch_prototype.py`
  - wrapper page と `assets/routes.js` の再生成スクリプト

## 3. Query Parameters

- `fixture`
  - signed-in route: `owner | admin | reviewer | member`
  - gateway route: `unaffiliated-user | invitation-target-user | join-request-applicant`
- `state`
  - route ごとに `assets/routes.js` が許可する state を使う
- `tab`
  - `admin-members`: `members | invitations | join-requests`
  - `admin-tags`: `active | merged | archived`
- `modal`
  - `question-detail`: `history`

未指定時は各 route の `defaultFixture` / `defaultState` / `defaultTab` を使う。

## 4. Prototype Rules

- raw export 自体は編集せず、prototype 側が same-origin iframe 上で rewiring する
- `href="#"` は runtime で実 route または current route に置換する
- mutation は実行しない
- `loading / empty / error / permission-denied` は overlay で表現する
- `question.detail` の履歴は別 route を作らず side panel で表現する
- `admin.members` は `Members / Invitations / Join Requests` の 3 subsection を持つ

## 5. Scenario 1〜10

| Scenario | Start |
| --- | --- |
| 1. 初回ログインから workspace 作成 | `auth-login.html` |
| 2. 招待、再送、受諾 | `admin-members.html?fixture=owner&tab=invitations` |
| 3. 直接投稿 knowledge の review / formalize | `knowledge-create.html?fixture=member` |
| 4. formal knowledge の edit draft 作成から apply | `knowledge-detail.html?fixture=member&state=formal` |
| 5. 質問、回答、ベストアンサー、再オープン | `question-create.html?fixture=member` |
| 6. Q&A から knowledge 作成 | `question-detail.html?fixture=member&state=reopened` |
| 7. タグ統合、検索、通知、レビュー待ちバッジ | `admin-tags.html?fixture=admin&state=merge` |
| 8. login / refresh / logout と共通ヘッダー | `auth-login.html` |
| 9. 参加申請コメント、取消、コメント編集 / 非表示 | `workspace-join-request.html?fixture=join-request-applicant` |
| 10. 履歴導線と二重実行耐性 | `question-detail.html?fixture=member&modal=history` |

## 6. 再生成手順

1. `python docs/design/prototype/tools/build_stitch_prototype.py`
2. `docs/design/prototype/index.html` と 20 wrapper が再生成される
3. `docs/design/prototype/assets/routes.js` が route manifest で更新される
4. wrapper の asset query も content hash に合わせて更新される

## 7. 確認チェックリスト

- `index.html` から 20 route すべてが開ける
- `question.detail` の履歴は same page side panel で開く
- `admin.members` で tab ごとに行が切り替わる
- reviewer / admin / owner でだけ review queue button が残る
- `docs/design/prototype/**/*.html` に `href="#"` が残っていない

## 8. GitHub Pages

- `.github/workflows/deploy-pages.yml` は `docs/` 全体を GitHub Pages artifact として公開する
- Pages root は `docs/index.html` で、公開後は `design/prototype/index.html` に自動で転送する
- 想定 URL:
  - root: `https://<user>.github.io/<repo>/`
  - prototype index: `https://<user>.github.io/<repo>/design/prototype/index.html`
- 初回は GitHub repository settings の `Pages` で source を `GitHub Actions` に切り替える
