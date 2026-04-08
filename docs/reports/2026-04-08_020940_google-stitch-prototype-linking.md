# Google Stitch Prototype Linking Update

## Summary
- ログイン起点の分岐を見直し、`workspace.resolution` から招待受諾・join request・ホームへ遷移できるようにした
- breadcrumb、notification card、bookmark card、related link など self route に落ちていた内部リンクを route-aware に置き換えた
- デザインは Stitch export を維持し、既存の visible UI 要素だけを遷移導線として再利用した

## Main Changes
- `auth.login`
  - `Google でログイン` → `workspace.resolution` 既定 route
- `workspace.resolution`
  - `ワークスペースに参加する` → `workspace.invitation_accept`
  - `ドメイン外を検索` → `workspace.join_request`
  - `新規作成` → `knowledge.list`
- shared chrome
  - `ワークスペース` breadcrumb / header text → `knowledge.list`
  - admin `設定` breadcrumb → `admin.members`
- `notification.list`
  - 承認通知カード → `knowledge.detail`
  - コメント通知カード → `question.detail`
- `bookmark.list`
  - 各カード → `knowledge.detail` / `question.detail` / `knowledge.edit`
- `knowledge.detail`
  - `コメントを追加` / `チャットを開始` → `question.create`
  - 関連リンク → `knowledge.detail` の別 state

## Validation
- `node --check docs/design/prototype/assets/prototype.js`
- `python docs/design/prototype/tools/build_stitch_prototype.py`
- Playwright-CLI:
  - `auth-login.html` → `workspace-resolution.html`
  - `workspace-resolution.html` → `workspace-invitation-accept.html`
  - `workspace-resolution.html` → `knowledge-list.html`
  - `notification-list.html` → `question-detail.html`
  - `bookmark-list.html` で各カードが clickable になっていることを確認

## Result
- ユーザーが prototype 上でクリックして辿るべき主要フローは、URL 直打ちなしで到達できるようになった
- raw Stitch の placeholder anchor や generic card 由来で止まっていた導線が解消された
