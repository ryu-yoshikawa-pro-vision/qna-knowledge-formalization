# Prototype README

## 1. 目的

`docs/design/prototype/` は `docs/spec/` に整合する static multi-page demo である。runtime backend は使わず、query parameter と mock data で role / actor / state を切り替える。

## 2. 構成

- `index.html`
  - 20 画面への launcher と Scenario 1〜10 の確認入口
- `assets/tokens.css`
  - 色、タイポ、spacing、badge 用 token
- `assets/base.css`
  - app shell、table、editor、detail、gateway の共通 style
- `assets/routes.js`
  - screen route manifest と Scenario 1〜10 の導線定義
- `assets/mock-state.js`
  - role / actor / preset / badge count / query helper
- `assets/mock-data.js`
  - 各 screen の mock content、actions、validation note
- `assets/prototype.js`
  - 共通 renderer
- `*.html`
  - 20 screen ID に対応する wrapper page

## 3. Route Rules

- 正規名は `screen_id`
- filename は `route_slug + ".html"`
- `index.html` 以外は `body[data-screen]` で screen ID を指定する
- signed-in screen では `?role=owner|admin|reviewer|member` を使う
- pre-membership screen では `?actor=unaffiliated%20authenticated%20user|invitation%20target%20user|join%20request%20applicant` を使う
- state variation は `?preset=<name>` を使う

## 4. Role / Actor Fixture

### signed-in role

- `owner`
- `admin`
- `reviewer`
- `member`

### pre-membership actor

- `unaffiliated authenticated user`
- `invitation target user`
- `join request applicant`

## 5. Scenario 1〜10 の確認導線

| Scenario | 開始 route | 確認ポイント |
| --- | --- | --- |
| 1. 初回ログインから workspace 作成 | `auth-login.html` | `workspace-resolution.html?preset=create-path` 経由で `knowledge-list.html` に到達する |
| 2. 招待、再送、受諾 | `admin-members.html?role=owner&preset=invitations` | `workspace-invitation-accept.html?preset=preview` と `accepted` を確認する |
| 3. 直接投稿 knowledge の review / formalize | `knowledge-create.html?role=member&preset=request-review` | `knowledge-detail.html?preset=review-requested` → `review-queue.html?role=reviewer` → `knowledge-detail.html?role=admin&preset=formal` |
| 4. formal knowledge の edit draft 作成から apply | `knowledge-detail.html?role=member&preset=formal` | `knowledge-edit-draft-create.html` → `knowledge-edit-draft-detail.html?preset=review-requested` → `knowledge-detail.html?role=admin&preset=formal` |
| 5. 質問、回答、ベストアンサー、再オープン | `question-create.html?role=member` | `question-detail.html?preset=open` → `resolved` → `reopened` |
| 6. Q&A から knowledge 作成 | `question-detail.html?preset=reopened` | `knowledge-create.html?preset=qa-derived` を確認する |
| 7. タグ統合、検索、通知、レビュー待ちバッジ | `admin-tags.html?role=admin&preset=merge` | `knowledge-list.html?role=reviewer` の badge と `notification-list.html` を確認する |
| 8. login / refresh / logout と共通ヘッダー | `auth-login.html` | `knowledge-list.html` 以降の header badge と `notification-list.html` を確認する |
| 9. 参加申請コメント、取消、コメント編集 / 非表示 | `workspace-join-request.html?preset=pending` | `admin-members.html?preset=join-requests` と `knowledge-detail.html?preset=formal` の comment area を確認する |
| 10. 履歴導線と二重実行耐性 | `question-detail.html?preset=history` | 同画面内 side panel、`bookmark-list.html`、`admin-members.html?preset=invitations`、`notification-list.html?preset=read-all` を確認する |

## 6. 確認チェックリスト

- 20 route すべてが `index.html` から開ける
- `question.detail` の履歴は同一画面内 panel で確認できる
- `admin.members` に `Members / Invitations / Join Requests` がある
- reviewer / admin / owner でだけ review queue badge が出る
- list 画面に `loading / empty / error` がある
- detail / editor / admin 画面に `error / permission_denied` がある
- prototype 配下に `href="#"` が残っていない

## 7. 更新手順

1. `docs/design/screen-map.md` の影響 row を特定する
2. `assets/routes.js` の route metadata と scenario path を更新する
3. `assets/mock-data.js` の screen body / actions / notices を更新する
4. 必要なら wrapper page を追加または削除する
5. `index.html` と `README.md` の scenario table を再確認する
6. `Select-String -Pattern 'href=\"#\"' -Path docs/design/prototype/**/*.html` で placeholder link を確認する
