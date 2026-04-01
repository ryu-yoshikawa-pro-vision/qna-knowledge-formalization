## この文書が決めること

* endpoint 一覧
* request / response の責務
* auth / validation / state rule / side effect / affected table

## 依存文書

* `README.md`
* `実装前提・技術基準.md`
* `用語・正規一覧.md`
* `業務仕様書.md`
* `状態遷移仕様.md`
* `権限マトリクス.md`

## 関連文書

* `テーブル定義.md`
* `画面仕様書.md`
* `画面APIデータ対応表.md`
* `バリデーション・業務ルール一覧.md`

## 優先される定義

* endpoint 名、request / response field、error code はこの文書を正とする
* 業務ルールは `業務仕様書.md`
* 状態遷移は `状態遷移仕様.md`
* 権限制御は `権限マトリクス.md`
* table / column は `テーブル定義.md`

---

# API概要設計書

## 1. ドキュメントの目的

本ドキュメントは、MVPに必要なAPIを、**リソース単位で整理**し、以下を明確にすることを目的とする。

* どの画面がどのAPIを使うか
* どの操作がどのエンティティを更新するか
* 認証・認可の境界
* 状態遷移とAPIの関係
* 実装時に必要な最低限の request / response 形状

---

# 2. API設計の基本方針

## 2-1. リソース中心で分ける

以下の単位でAPIを分ける。

* auth
* workspace
* membership
* tags
* knowledge
* knowledge edit draft
* review
* question
* answer
* comment
* link
* bookmark
* notification
* search

## 2-2. 状態遷移は専用アクションAPIで表現する

単純な `PATCH` で全部を表現しない。
たとえば、

* review request
* formalize
* reopen
* accept answer
* apply draft

のような**意味の強い操作**は専用APIにする。

## 2-3. 本文更新と運営操作を分ける

他人本文を編集しない前提なので、

* content update API
* status change API
* archive API
* role change API

を明確に分ける。

## 2-4. レスポンス contract を固定する

すべての endpoint は wire format として次の envelope を使う。

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

error 時は次を返す。

```json
{
  "data": null,
  "meta": {},
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

ルール:

* bare array を返さない
* bare scalar を返さない
* list API は `data.items[]` を使う
* page を受け取る list API は `meta.page`, `meta.page_size`, `meta.total_count`, `meta.total_pages` を返す
* mutation API は follow-up GET を前提にせず、primary resource の current snapshot を返す
* idempotent replay 時は `meta.idempotent_replay = true` を返す
* 下位節で response を簡略記載する場合も、実 wire format は必ずこの envelope を使う

## 2-5. idempotency / retry / 二重送信

状態遷移 API は二重送信前提で実装する。

* 同一 request を再送しても、すでに目標状態なら副作用なしで current snapshot を返す
* 到達不能な状態への再送は `STATE_CONFLICT` を返す
* 招待再送、join request 承認、owner transfer、bookmark、read / read-all は重複作成を起こさない

## 2-6. 同時編集と更新競合

MVP では optimistic lock や `ETag` は導入しない。

* 本文編集は author-only を前提にする
* 更新競合時は revision を残したうえで last-write-wins とする
* 運営操作と本文編集は API を分けて競合面を狭くする

## 2-7. ログの意味

この文書で「ログを残す」は汎用 operation log を意味しない。

* 本文更新は `*_revisions`
* review は `knowledge_reviews` / `knowledge_edit_draft_reviews`
* membership イベントは `workspace_membership_logs`
* role change は `workspace_role_change_logs`

---

# 3. 認証・認可

## 3-1. 認証

* Googleログイン完了後、アプリ独自セッションを発行
* Web は session cookie、Mobile は bearer token でAPIを呼ぶ
* Mobile は `POST /api/auth/refresh` で token を更新する

## 3-2. 認可

全APIで最低限次を確認する。

* ログイン済みか
* 所属ワークスペースか
* visibility的に閲覧可能か
* ロール的に操作可能か
* 作成者本人か
* 状態的に操作可能か

## 3-3. エラーコード例

* `UNAUTHENTICATED`
* `FORBIDDEN`
* `NOT_FOUND`
* `VALIDATION_ERROR`
* `STATE_CONFLICT`
* `ALREADY_EXISTS`
* `EXPIRED`
* `DOMAIN_MISMATCH`

## 3-4. auth を endpoint 節で省略した場合の既定ルール

endpoint 節に `### auth` がない場合は、次を既定とする。

### auth bootstrap

* `POST /api/auth/google/callback`
  * Google 認証結果を受け取る bootstrap endpoint

### authenticated pre-membership

* `GET /api/auth/me`
  * ログイン済みユーザー
* `POST /api/auth/logout`
  * 現在の session / refresh token 本人
* `GET /api/workspace-resolution`
  * ログイン済みユーザー
* `POST /api/workspaces`
  * ログイン済みユーザー
* `POST /api/workspaces/current/join-requests`
  * ログイン済み未参加ユーザー
* `POST /api/workspace-join-requests/{joinRequestId}/cancel`
  * 申請者本人

### active member default

次は、個別 auth がない限り active member を既定 auth とする。

* `GET /api/workspaces/current`
* `GET /api/workspaces/current/tags`
* `GET /api/knowledges*`
* `POST /api/knowledges`
* `GET /api/knowledge-edit-drafts/{draftId}`
* `GET /api/knowledge-edit-drafts/{draftId}/revisions`
* `GET /api/questions*`
* `POST /api/questions`
* `POST /api/questions/{questionId}/answers`
* `GET /api/answers/{answerId}/revisions`
* `POST /api/comments`
* `POST /api/bookmarks`
* `DELETE /api/bookmarks`
* `GET /api/bookmarks`
* `GET /api/notifications`
* `POST /api/notifications/{notificationId}/read`
* `POST /api/notifications/read-all`
* `GET /api/notifications/unread-count`

補足:

* endpoint 節に個別 auth がある場合はそちらを優先する
* visibility / role / author / state の追加条件は別途適用する

---

# 4. auth API

## 4-1. `POST /api/auth/google/callback`

### 用途

Google認証結果を受けて、アプリユーザーを作成/更新し、セッションを発行する。

### request

* Google認証トークン or callback code
* `client_platform`
  * `web`
  * `mobile`

### response

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "display_name": "User Name"
    },
    "workspace_resolution": {
      "has_workspace": true,
      "workspace_id": "uuid",
      "relationship_status": "active_member"
    },
    "auth": {
      "transport": "cookie",
      "access_token": null,
      "refresh_token": null
    }
  }
}
```

### rules

* Google login 開始は client 側で行い、専用 API は持たない
* `client_platform = web` の場合は session cookie をセットする
* `client_platform = mobile` の場合は `access_token` / `refresh_token` を返す
* `relationship_status` は `none / pending_join_request / active_member / removed_member` のいずれか

---

## 4-2. `GET /api/auth/me`

### 用途

現在ログイン中ユーザー情報取得。

### response

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "display_name": "User Name",
      "avatar_url": "..."
    }
  }
}
```

---

## 4-3. `POST /api/auth/logout`

### 用途

ログアウト。

### rules

* 現在の session / refresh token を無効化する

---

## 4-4. `POST /api/auth/refresh`

### 用途

Mobile bearer token の再発行。

### auth

* refresh token 本人

### response

```json
{
  "data": {
    "access_token": "jwt-or-session-token",
    "refresh_token": "new-refresh-token"
  }
}
```

---

# 5. workspace API

## 5-1. `GET /api/workspace-resolution`

### 用途

ログインユーザーのメールドメインに対して、既存ワークスペースがあるかを返す。

### response

```json
{
  "data": {
    "domain": "example.com",
    "workspace_exists": true,
    "workspace": {
      "id": "uuid",
      "name": "Example Workspace"
    },
    "relationship_status": "none",
    "join_request": null
  }
}
```

### rules

* `relationship_status` は `none / pending_join_request / active_member / removed_member`
* `join_request` は `pending_join_request` の場合だけ `id`, `status`, `request_comment` を返す

---

## 5-2. `POST /api/workspaces`

### 用途

初回ユーザーがワークスペースを作成する。

### request

```json
{
  "name": "Example Workspace"
}
```

### rules

* 同一ドメインに既存 workspace がないこと

### response

```json
{
  "data": {
    "workspace": {
      "id": "uuid",
      "name": "Example Workspace",
      "primary_domain": "example.com"
    }
  }
}
```

---

## 5-3. `GET /api/workspaces/current`

### 用途

現在所属中のワークスペース情報取得。

### response

```json
{
  "data": {
    "workspace": {
      "id": "uuid",
      "name": "Example Workspace",
      "primary_domain": "example.com"
    },
    "current_membership": {
      "role": "member",
      "membership_status": "active"
    }
  }
}
```

---

# 6. membership / invitation API

## 6-1. `GET /api/workspaces/current/members`

### 用途

メンバー一覧取得。

### auth

* owner / admin

---

## 6-2. `POST /api/workspaces/current/invitations`

### 用途

招待作成。

### request

```json
{
  "email": "target@example.com",
  "role": "member"
}
```

### auth

* owner / admin

### rules

* 同一ドメインのみ
* `owner` 招待不可

---

## 6-3. `GET /api/workspaces/current/invitations`

### 用途

招待一覧取得。

### auth

* owner / admin

---

## 6-4. `POST /api/workspace-invitations/{invitationId}/revoke`

### 用途

招待取り消し。

### auth

* owner / admin

---

## 6-4.1. `GET /api/workspace-invitations/{token}`

### 用途

招待 preview 取得。

### auth

* ログイン済み本人

### response

```json
{
  "data": {
    "workspace": {
      "name": "Example Workspace"
    },
    "invited_email": "target@example.com",
    "role": "member",
    "expires_at": "2026-04-14T00:00:00Z",
    "status": "pending"
  }
}
```

### rules

* token の存在と現在状態を返す
* 受諾可否の最終判定は `POST /api/workspace-invitations/{token}/accept` で行う

---

## 6-5. `POST /api/workspace-invitations/{token}/accept`

### 用途

招待受諾。

### auth

* ログイン済み本人

### rules

* トークン有効
* 期限内
* ログインメール完全一致

---

## 6-5.1. `POST /api/workspace-invitations/{invitationId}/resend`

### 用途

招待再送。

### auth

* owner / admin

### rules

* 旧 `pending` 招待を `revoked` にする
* 新 token / 新 `expires_at` で新しい `pending` 招待を作る
* 同一 workspace + email の active pending は常に 1 件まで

---

## 6-6. `POST /api/workspaces/current/join-requests`

### 用途

参加申請作成。

### request

```json
{
  "comment": "参加申請コメント"
}
```

### auth

* ログイン済みユーザー
* 同一 domain の workspace に対して未参加であること
* 自分自身の `active` membership を持たないこと

### rules

* request の `comment` は DB の `workspace_join_requests.request_comment` へ保存する

---

## 6-7. `GET /api/workspaces/current/join-requests`

### 用途

参加申請一覧取得。

### auth

* owner / admin

---

## 6-8. `POST /api/workspace-join-requests/{joinRequestId}/approve`

### 用途

参加申請承認。

### auth

* owner / admin

---

## 6-9. `POST /api/workspace-join-requests/{joinRequestId}/reject`

### 用途

参加申請却下。

### auth

* owner / admin

### request

```json
{
  "comment": "現在は受け入れ不可"
}
```

---

## 6-10. `POST /api/workspace-join-requests/{joinRequestId}/cancel`

### 用途

申請者本人による取り下げ。

---

## 6-11. `POST /api/workspaces/current/members/{userId}/role`

### 用途

ロール変更。

### auth

* owner / admin

### request

```json
{
  "new_role": "reviewer",
  "reason": "reviewer へ変更"
}
```

### rules

* admin は admin を増やせない
* admin は admin / owner の role を変更できない
* owner移譲は別API

---

## 6-12. `POST /api/workspaces/current/owner-transfer`

### 用途

オーナー移譲。

### auth

* owner

### request

```json
{
  "new_owner_user_id": "uuid"
}
```

### rules

* 実行者は current owner のみ
* 旧 owner は `admin` に変わる
* owner 不在状態は作らない

---

## 6-13. `POST /api/workspaces/current/members/{userId}/remove`

### 用途

メンバー削除。

### auth

* owner / admin

### rules

* owner は admin / reviewer / member を削除できる
* admin は reviewer / member のみ削除できる
* owner 自身の削除はできない
* owner の変更は `POST /api/workspaces/current/owner-transfer` のみ
* 削除時は `workspace_members.membership_status = removed` に更新する
* membership log を必ず記録する

---

# 7. tag API

## 7-1. `GET /api/workspaces/current/tags`

### 用途

タグ一覧取得、サジェスト用取得。

### query

* `q`
* `status`
* `limit`

---

## 7-2. `POST /api/workspaces/current/tags`

### 用途

新規タグ作成。

### request

```json
{
  "name": "playwright"
}
```

### auth

* member 以上

### rules

* 正規化後重複チェック

---

## 7-3. `PATCH /api/tags/{tagId}`

### 用途

タグ改名。

### auth

* owner / admin

### request

```json
{
  "name": "new-name"
}
```

---

## 7-4. `POST /api/tags/{tagId}/merge`

### 用途

タグ統合。

### auth

* owner / admin

### request

```json
{
  "target_tag_id": "uuid"
}
```

---

## 7-5. `POST /api/tags/{tagId}/archive`

### 用途

タグアーカイブ。

### auth

* owner / admin

---

# 8. knowledge API

## 8-1. `GET /api/knowledges`

### 用途

ナレッジ一覧検索。

### query

* `q`
* `tag_ids[]`
* `status_scope`

  * `formal_only`
  * `include_unreviewed`
  * `unreviewed_only`
* `source_type`
* `visibility`
* `include_archived`
* `author_id`
* `updated_from`
* `updated_to`
* `page`
* `page_size`

### response

一覧カード向けの最小情報を返す。

### rules

* `tag_ids[]` には `active` と `merged` の tag ID を渡せる
* `merged` tag ID が渡された場合は統合先 tag に解決してから AND 条件で検索する

---

## 8-2. `POST /api/knowledges`

### 用途

新規ナレッジ作成。

### request

```json
{
  "submit_action": "draft",
  "source_type": "direct_post",
  "visibility": "workspace",
  "draft_visibility": "private",
  "title": "title",
  "summary": "summary",
  "content_json": {},
  "content_markdown": "markdown",
  "result_type": "success",
  "context_text": "context",
  "tag_ids": ["uuid"]
}
```

### auth

* active member

### rules

* `source_type = qa_derived` の新規作成は `POST /api/questions/{questionId}/knowledges` を使う
* `submit_action` は `draft / shared / request_review`
* `submit_action = draft` の場合は review_requested 条件を未満でもよい
* `submit_action = shared` の場合は初期状態を `shared` にする
* `submit_action = request_review` の場合は review_requested 条件を満たしたうえで初期状態を `review_requested` にする
* `submit_action != draft` の場合は `draft_visibility = null` として扱う

---

## 8-3. `GET /api/knowledges/{knowledgeId}`

### 用途

ナレッジ詳細取得。

### response に含めるもの

* 本体
* tags
* current links
* comments summary
* origin info
* revision summary
* archived info
* current user permissions

### permissions DTO

`23-2. 共通 payload` の `knowledge permissions DTO` を参照。

---

## 8-4. `PATCH /api/knowledges/{knowledgeId}`

### 用途

自分の通常ナレッジ本文更新。

### auth

* 作成者本人のみ

### rules

* `formal` 本体には使わない
* `review_requested` 中なら保存時に `shared` へ戻す
* `changes_requested` 中でも保存時に `shared` へ戻す

---

## 8-5. `POST /api/knowledges/{knowledgeId}/share`

### 用途

`draft -> shared`

### auth

* 作成者本人

---

## 8-6. `POST /api/knowledges/{knowledgeId}/request-review`

### 用途

`shared/draft -> review_requested`

### auth

* 作成者本人 / admin / owner

### rules

* 必須項目チェック

---

## 8-7. `POST /api/knowledges/{knowledgeId}/archive`

### 用途

アーカイブ。

### auth

* 自分の非正式ナレッジ: 作成者本人
* 他人のもの / formal: admin / owner

### request

```json
{
  "reason": "..."
}
```

---

## 8-8. `POST /api/knowledges/{knowledgeId}/revoke-formal`

### 用途

正式取り下げ。

### auth

* admin / owner

### request

```json
{
  "reason": "..."
}
```

### rules

* `formal -> shared`
* 理由必須

---

## 8-9. `GET /api/knowledges/{knowledgeId}/revisions`

### 用途

ナレッジ履歴一覧取得。

---

## 8-10. `GET /api/knowledges/{knowledgeId}/revisions/{revisionId}`

### 用途

特定revision詳細取得。

---

## 8-11. `POST /api/knowledges/{knowledgeId}/draft-visibility`

### 用途

通常 knowledge の `draft_visibility` 切替。

### auth

* 作成者本人のみ

### rules

* `status = draft` のときのみ
* `private / reviewer_shared` のみ

### request

```json
{
  "draft_visibility": "reviewer_shared"
}
```

## 2-5. endpoint 記述の補完規則

個別 endpoint 節で省略した項目は、実装 handoff では次を既定値として読む。

* request body 未記載: body なし、または path / query のみで完結する
* response 未記載: `# 23. contract 補完` を正とし、list API は `data.items[]`、mutation API は primary resource の current snapshot を返す
* auth 未記載: `3-4. auth を endpoint 節で省略した場合の既定ルール` を適用する
* state rule 未記載: resource の状態は変えず、参照または単純更新のみ
* side effect 未記載: audit column 更新以外の副作用なし
* affected tables 未記載: 対象 resource の主 table を更新し、詳細は `テーブル定義.md` と `画面APIデータ対応表.md` を参照する
* error code 未記載: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR` を最低限返し得る

---

# 9. knowledge review API

## 9-1. `POST /api/knowledges/{knowledgeId}/reviews`

### 用途

レビュー作成。

### auth

* reviewer / admin / owner

### request

```json
{
  "review_result": "approve",
  "change_request_category": null,
  "comment": "..."
}
```

### rules

* `request_changes` の場合はカテゴリ必須
* `review_revision_id` はサーバ側で現在revisionを解決して記録

---

## 9-2. `POST /api/knowledges/{knowledgeId}/formalize`

### 用途

正式化。

### auth

* admin / owner

### rules

* 投稿者以外の有効レビュー1件以上
* review_requested 条件を満たす

---

# 10. knowledge edit draft API

## 10-1. `POST /api/knowledges/{knowledgeId}/edit-drafts`

### 用途

正式ナレッジから編集下書き作成。

### auth

* 元作成者本人のみ

### rules

* 同時未完了下書きが存在しないこと

---

## 10-2. `GET /api/knowledge-edit-drafts/{draftId}`

### 用途

編集下書き詳細取得。

---

## 10-3. `PATCH /api/knowledge-edit-drafts/{draftId}`

### 用途

編集下書き本文更新。

### auth

* 作成者本人のみ

### rules

* `review_requested` 中に編集したら `shared` へ戻す
* `changes_requested` 中に編集しても `shared` へ戻す
* `applied` / `discarded` は編集不可

---

## 10-4. `POST /api/knowledge-edit-drafts/{draftId}/share`

### 用途

`draft -> shared`

### auth

* 作成者本人

---

## 10-5. `POST /api/knowledge-edit-drafts/{draftId}/request-review`

### 用途

`draft/shared -> review_requested`

### auth

* 作成者本人 / admin / owner

### rules

* review_requested 条件チェック

---

## 10-6. `POST /api/knowledge-edit-drafts/{draftId}/discard`

### 用途

下書き破棄。

### auth

* 作成者本人 / admin / owner

### request

```json
{
  "reason": "..."
}
```

---

## 10-7. `POST /api/knowledge-edit-drafts/{draftId}/apply`

### 用途

正式版へ反映。

### auth

* admin / owner

### rules

* 有効レビュー1件以上
* review_requested 条件を満たす

---

## 10-8. `POST /api/knowledge-edit-drafts/{draftId}/draft-visibility`

### 用途

`private / reviewer_shared` 切替。

### auth

* 作成者本人のみ

### request

```json
{
  "draft_visibility": "reviewer_shared"
}
```

---

## 10-9. `GET /api/knowledge-edit-drafts/{draftId}/revisions`

### 用途

編集下書き履歴一覧取得。

---

## 10-10. `POST /api/knowledge-edit-drafts/{draftId}/reviews`

### 用途

編集下書きレビュー作成。

### auth

* reviewer / admin / owner

### request

```json
{
  "review_result": "approve",
  "change_request_category": null,
  "comment": "..."
}
```

### rules

* `request_changes` の場合はカテゴリ必須
* `review_revision_id` はサーバ側で現在 draft revision を解決して記録

---

# 11. question API

## 11-1. `GET /api/questions`

### 用途

質問一覧検索。

### query

* `q`
* `tag_ids[]`
* `status`
* `visibility`
* `author_id`
* `page`
* `page_size`

---

## 11-2. `POST /api/questions`

### 用途

質問作成。

### request

```json
{
  "visibility": "workspace",
  "title": "question title",
  "content_json": {},
  "content_markdown": "markdown",
  "tag_ids": ["uuid"]
}
```

### auth

* active member

---

## 11-3. `GET /api/questions/{questionId}`

### 用途

質問詳細取得。

### response に含めるもの

* 質問本体
* tags
* comments
* answers
* accepted answer snapshot
* derived knowledges
* links
* permissions

### permissions DTO

`23-2. 共通 payload` の `question permissions DTO` を参照。

---

## 11-4. `PATCH /api/questions/{questionId}`

### 用途

質問本文更新。

### auth

* 質問投稿者本人のみ

### rules

* `open` のときのみ

---

## 11-5. `POST /api/questions/{questionId}/accept-answer`

### 用途

ベストアンサー選定。

### auth

* 質問投稿者 / admin / owner

### request

```json
{
  "answer_id": "uuid"
}
```

### rules

* 質問が `open`
* 回答が削除済みでない

---

## 11-6. `POST /api/questions/{questionId}/reopen`

### 用途

再オープン。

### auth

* 質問投稿者 / admin / owner

---

## 11-7. `POST /api/questions/{questionId}/archive`

### 用途

アーカイブ。

### auth

* 質問投稿者 / admin / owner

### request

```json
{
  "reason": "..."
}
```

---

## 11-8. `GET /api/questions/{questionId}/revisions`

### 用途

質問履歴一覧取得。

### response

```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "revision_number": 3,
        "edited_by": {
          "id": "uuid",
          "display_name": "User Name"
        },
        "created_at": "2026-04-01T00:00:00Z",
        "edit_summary": "表現を更新"
      }
    ]
  },
  "meta": {},
  "error": null
}
```

---

## 11-9. `POST /api/questions/{questionId}/knowledges`

### 用途

Q&A由来ナレッジ作成。

### auth

* その質問を閲覧できるメンバー

### request

```json
{
  "source_answer_id": "uuid or null"
}
```

### response

* 初期値入り draft knowledge を返す

---

# 12. answer API

## 12-1. `POST /api/questions/{questionId}/answers`

### 用途

回答作成。

### request

```json
{
  "content_json": {},
  "content_markdown": "..."
}
```

---

## 12-2. `PATCH /api/answers/{answerId}`

### 用途

回答更新。

### auth

* 回答投稿者本人のみ

### rules

* `locked_at IS NULL`
* `is_deleted = false`

---

## 12-3. `POST /api/answers/{answerId}/delete`

### 用途

回答論理削除。

### auth

* 回答投稿者本人 / admin / owner

### request

```json
{
  "reason": "..."
}
```

### rules

* ベストアンサー回答は解除前不可
* 凍結済み回答は本人不可、admin/ownerのみ

---

## 12-4. `GET /api/answers/{answerId}/revisions`

### 用途

回答履歴一覧取得。

### response

```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "revision_number": 2,
        "edited_by": {
          "id": "uuid",
          "display_name": "User Name"
        },
        "created_at": "2026-04-01T00:00:00Z"
      }
    ]
  },
  "meta": {},
  "error": null
}
```

---

# 13. comment API

## 13-1. `POST /api/comments`

### 用途

コメント作成。

### request

```json
{
  "content_type": "knowledge",
  "content_id": "uuid",
  "parent_comment_id": null,
  "content_json": {},
  "content_markdown": "...",
  "mentioned_user_ids": ["uuid"]
}
```

### auth

* active member
* 対象 content の閲覧条件を満たすこと

### rules

* `parent_comment_id` がある場合、1段返信まで

---

## 13-2. `PATCH /api/comments/{commentId}`

### 用途

自分のコメント更新。

### auth

* コメント投稿者本人のみ

### rules

* `is_edited = true`
* `edited_at = now()`

---

## 13-3. `POST /api/comments/{commentId}/hide`

### 用途

コメント非表示化。

### auth

* admin / owner

### request

```json
{
  "reason_category": "irrelevant",
  "reason_text": "個人情報が含まれるため非表示"
}
```

### rules

* owner / admin のみ
* 個別通知は作らない

---

# 14. link API

## 14-1. `POST /api/content-links`

### 用途

リンク追加。

### request

```json
{
  "source_type": "knowledge",
  "source_id": "uuid",
  "target_type": "question",
  "target_id": "uuid",
  "link_type": "related"
}
```

### auth rules

* member: `related / derived_from`
* reviewer/admin/owner: 全種別

---

## 14-2. `DELETE /api/content-links/{linkId}`

### 用途

リンク削除。

### auth

* 追加者本人
* reviewer / admin / owner

---

# 15. bookmark API

## 15-1. `POST /api/bookmarks`

### 用途

ブックマーク追加。

### request

```json
{
  "content_type": "knowledge",
  "content_id": "uuid"
}
```

---

## 15-2. `DELETE /api/bookmarks`

### 用途

ブックマーク解除。

### request

```json
{
  "content_type": "knowledge",
  "content_id": "uuid"
}
```

---

## 15-3. `GET /api/bookmarks`

### 用途

自分のブックマーク一覧取得。

### query

* `content_type`
* `include_archived`
* `page`
* `page_size`

### default sort

* 追加が新しい順

---

# 16. notification API

## 16-1. `GET /api/notifications`

### 用途

通知一覧取得。

### query

* `unread_only`
* `type`
* `page`
* `page_size`

---

## 16-2. `POST /api/notifications/{notificationId}/read`

### 用途

単体既読。

---

## 16-3. `POST /api/notifications/read-all`

### 用途

一括既読。

---

## 16-4. `GET /api/notifications/unread-count`

### 用途

未読件数取得。

### response

```json
{
  "data": {
    "unread_count": 12
  }
}
```

---

# 17. review queue API

## 17-1. `GET /api/review-queue`

### 用途

レビュー待ち一覧取得。

### auth

* reviewer / admin / owner

### query

* `item_type`
  `knowledge / knowledge_edit_draft / all`
* `author_id`
* `tag_ids[]`
* `page`
* `page_size`

---

## 17-2. `GET /api/review-queue/count`

### 用途

レビュー待ち件数取得。ヘッダーバッジ用。

### auth

* reviewer / admin / owner

### response

```json
{
  "data": {
    "total": 4,
    "knowledge_count": 3,
    "knowledge_edit_draft_count": 1
  }
}
```

---

# 18. search responsibility

MVP の検索責務は一覧 API に含める。

* ナレッジ検索は `GET /api/knowledges`
* 質問検索は `GET /api/questions`

専用 search endpoint は持たない。

---

# 19. 代表的な認可ルール

## 19-1. 他人本文編集禁止

次は常に禁止。

* 他人の knowledge 本文
* 他人の knowledge_edit_draft 本文
* 他人の question 本文
* 他人の answer 本文
* 他人の comment 本文

## 19-2. review_requested 中の本文編集

* knowledge / draft を作成者本人が更新したら `shared` に戻す

## 19-3. formal 本体の直接更新禁止

* formal は `PATCH /api/knowledges/{knowledgeId}` では更新不可
* 編集下書き経由のみ

## 19-4. `admin_only`, `owner_only` の visibility

一覧でも詳細でも必ず認可する

## 19-5. 招待受諾

* ログインメールと招待メール完全一致必須

---

# 20. エラー例

## 20-1. `STATE_CONFLICT`

例:

* `resolved_locked` の質問を編集しようとした
* `applied` 下書きを編集しようとした
* `formal` 本体を直接更新しようとした

## 20-2. `FORBIDDEN`

例:

* member が `duplicate` リンクを追加しようとした
* reviewer が参加申請を承認しようとした
* admin が owner移譲しようとした

## 20-3. `VALIDATION_ERROR`

例:

* review_requested 条件不足
* discard_reason 未入力
* archive_reason 未入力

## 20-4. `DOMAIN_MISMATCH`

例:

* 招待受諾ユーザーのメールドメインが違う
* 外部ドメインユーザーの参加申請

## 20-5. `EXPIRED`

例:

* 招待リンク期限切れ

---

# 21. このAPI概要設計で確定したこと

* 主要リソース単位
* 主要エンドポイント
* 状態遷移を伴う専用操作API
* 認可観点
* 代表的な request / response の責務
* エラーの考え方

---

# 22. endpoint 補完マトリクス

個別 endpoint 節で `side effect` や `affected tables` を省略した箇所は、この一覧を正とする。

## 22-1. auth / participation

| endpoint | affected tables | state rule | side effect | 主な error code |
| --- | --- | --- | --- | --- |
| `GET /api/workspace-resolution` | `workspaces`, `workspace_members`, `workspace_join_requests` | read only | login 後の参加導線判定に使う | `UNAUTHENTICATED`, `NOT_FOUND` |
| `POST /api/auth/google/callback` | `users`, `user_sessions`, `workspace_members` | Google 認証結果に応じて login / signup | Web は session cookie、Mobile は access / refresh token 発行 | `UNAUTHENTICATED`, `DOMAIN_MISMATCH` |
| `POST /api/auth/refresh` | `user_sessions` | refresh token 有効時のみ再発行 | 新 access token 発行、必要なら rotate | `UNAUTHENTICATED`, `EXPIRED` |
| `POST /api/auth/logout` | `user_sessions` | active session のみ無効化 | session / refresh token 失効 | `UNAUTHENTICATED` |
| `POST /api/workspaces` | `workspaces`, `workspace_members`, `workspace_membership_logs` | 同一 domain workspace 未作成時のみ | 作成者を owner で追加 | `VALIDATION_ERROR`, `DOMAIN_MISMATCH` |
| `POST /api/workspaces/current/invitations` | `workspace_invitations` | owner / admin のみ | 招待 token 発行、transactional email 送信依頼 | `FORBIDDEN`, `VALIDATION_ERROR`, `DOMAIN_MISMATCH` |
| `POST /api/workspace-invitations/{invitationId}/revoke` | `workspace_invitations` | `pending` のみ `revoked` | 招待リンク無効化 | `FORBIDDEN`, `STATE_CONFLICT`, `NOT_FOUND` |
| `GET /api/workspace-invitations/{token}` | `workspace_invitations`, `workspaces` | read only | 招待 preview 表示 | `FORBIDDEN`, `NOT_FOUND`, `EXPIRED` |
| `POST /api/workspace-invitations/{invitationId}/resend` | `workspace_invitations` | 旧 `pending` を `revoked`、新 `pending` を追加 | 新 token / 新 expiry 発行 | `FORBIDDEN`, `STATE_CONFLICT`, `NOT_FOUND` |
| `POST /api/workspace-invitations/{token}/accept` | `workspace_invitations`, `workspace_members`, `workspace_membership_logs` | token 有効時に `accepted` | member 作成、重複参加防止 | `FORBIDDEN`, `EXPIRED`, `DOMAIN_MISMATCH` |
| `POST /api/workspaces/current/join-requests` | `workspace_join_requests`, `notifications` | 未参加かつ同一 workspace に `pending` なし | owner / admin へ `join_request_submitted` 通知 | `FORBIDDEN`, `VALIDATION_ERROR`, `DOMAIN_MISMATCH` |
| `POST /api/workspace-join-requests/{joinRequestId}/approve` | `workspace_join_requests`, `workspace_members`, `workspace_membership_logs`, `notifications` | `pending -> approved` | 申請者を member 追加、承認通知 | `FORBIDDEN`, `STATE_CONFLICT`, `NOT_FOUND` |
| `POST /api/workspace-join-requests/{joinRequestId}/reject` | `workspace_join_requests`, `notifications` | `pending -> rejected` | 却下通知 | `FORBIDDEN`, `STATE_CONFLICT`, `NOT_FOUND` |
| `POST /api/workspaces/current/members/{userId}/role` | `workspace_members`, `workspace_role_change_logs` | role change rules を満たす場合のみ | role change log 記録 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/workspaces/current/owner-transfer` | `workspace_members`, `workspace_role_change_logs` | owner を交代させる | 旧 owner を admin にし、role change log 記録 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/workspaces/current/members/{userId}/remove` | `workspace_members`, `workspace_membership_logs` | active member を `removed` | membership log 記録 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |

## 22-2. knowledge / review

| endpoint | affected tables | state rule | side effect | 主な error code |
| --- | --- | --- | --- | --- |
| `POST /api/knowledges` | `knowledge_items`, `knowledge_revisions`, `knowledge_item_tags` | `submit_action` に応じて初期状態は `draft` / `shared` / `review_requested` | revision 1 作成、tag 紐付け | `FORBIDDEN`, `VALIDATION_ERROR` |
| `PATCH /api/knowledges/{knowledgeId}` | `knowledge_items`, `knowledge_revisions`, `knowledge_item_tags` | `review_requested` / `changes_requested` で保存したら `shared` | 新 revision 作成、tag 再同期 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledges/{knowledgeId}/share` | `knowledge_items` | `draft -> shared` | 公開範囲変更のみ | `FORBIDDEN`, `STATE_CONFLICT` |
| `POST /api/knowledges/{knowledgeId}/request-review` | `knowledge_items` | `draft / shared -> review_requested` | レビュー待ち件数対象化 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledges/{knowledgeId}/reviews` | `knowledge_reviews`, `notifications` | `review_requested` のみ | approve / comment / request_changes を記録、changes requested は投稿者通知 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledges/{knowledgeId}/formalize` | `knowledge_items`, `knowledge_reviews`, `notifications` | `review_requested -> formal` | `formalized_at` / `formalized_by_user_id` 記録、正式化通知 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledges/{knowledgeId}/archive` | `knowledge_items` | 非 formal または admin / owner に許可された対象のみ | `archived_at` / `archive_reason` 記録 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledges/{knowledgeId}/revoke-formal` | `knowledge_items`, `knowledge_revisions`, `notifications` | `formal -> shared` | 正式取り下げ理由記録、投稿者通知 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledges/{knowledgeId}/draft-visibility` | `knowledge_items` | `status = draft` のみ | 通知なし | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledges/{knowledgeId}/edit-drafts` | `knowledge_edit_drafts`, `knowledge_edit_draft_revisions`, `knowledge_edit_draft_tags` | formal knowledge に対して未完了 draft 1 件まで | edit draft revision 1 作成 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `PATCH /api/knowledge-edit-drafts/{draftId}` | `knowledge_edit_drafts`, `knowledge_edit_draft_revisions`, `knowledge_edit_draft_tags` | `review_requested` / `changes_requested` で保存したら `shared` | draft revision 追加、tag 再同期 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledge-edit-drafts/{draftId}/request-review` | `knowledge_edit_drafts` | `draft / shared -> review_requested` | レビュー待ち件数対象化 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledge-edit-drafts/{draftId}/reviews` | `knowledge_edit_draft_reviews`, `notifications` | `review_requested` のみ | approve / comment / request_changes を記録、changes requested は投稿者通知 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledge-edit-drafts/{draftId}/apply` | `knowledge_edit_drafts`, `knowledge_edit_draft_reviews`, `knowledge_items`, `knowledge_revisions`, `notifications` | `review_requested -> applied` | formal knowledge を更新、旧正式版を revision 保存、適用通知 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledge-edit-drafts/{draftId}/discard` | `knowledge_edit_drafts` | `draft / shared / changes_requested` から `discarded` | discard reason 記録 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/knowledge-edit-drafts/{draftId}/draft-visibility` | `knowledge_edit_drafts` | `status = draft` のみ | 通知なし | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |

## 22-3. question / answer

| endpoint | affected tables | state rule | side effect | 主な error code |
| --- | --- | --- | --- | --- |
| `POST /api/questions` | `questions`, `question_revisions`, `question_tags` | 初期状態は `open` | revision 1 作成 | `FORBIDDEN`, `VALIDATION_ERROR` |
| `PATCH /api/questions/{questionId}` | `questions`, `question_revisions`, `question_tags` | `open` のみ更新可 | revision 追加 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/questions/{questionId}/accept-answer` | `questions`, `answers`, `question_revisions`, `notifications` | `open -> resolved_locked` | accepted snapshot 保存、採用通知 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/questions/{questionId}/reopen` | `questions`, `notifications` | `resolved_locked -> open` | accepted answer 解除、再オープン通知 | `FORBIDDEN`, `STATE_CONFLICT` |
| `POST /api/questions/{questionId}/archive` | `questions` | `open / resolved_locked -> archived` | archive reason 記録 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/questions/{questionId}/knowledges` | `knowledge_items`, `knowledge_revisions`, `knowledge_item_tags` | source question を参照した knowledge 新規作成 | Q&A 由来 knowledge を作成 | `FORBIDDEN`, `VALIDATION_ERROR` |
| `POST /api/questions/{questionId}/answers` | `answers`, `answer_revisions` | `archived` でなければ作成可 | `resolved_locked` 後は追記回答扱い | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `PATCH /api/answers/{answerId}` | `answers`, `answer_revisions` | `locked_at IS NULL` かつ本人のみ | revision 追加 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |
| `POST /api/answers/{answerId}/delete` | `answers` | 未凍結・非採用は本人可、他は admin / owner | soft delete、reason 記録 | `FORBIDDEN`, `STATE_CONFLICT`, `VALIDATION_ERROR` |

## 22-4. cross-cutting

| endpoint | affected tables | state rule | side effect | 主な error code |
| --- | --- | --- | --- | --- |
| `POST /api/comments` | `comments`, `notifications` | parent depth 2 まで | mention / reply 通知 | `FORBIDDEN`, `VALIDATION_ERROR` |
| `PATCH /api/comments/{commentId}` | `comments` | 本人のみ更新可 | `is_edited = true`, `edited_at` 更新 | `FORBIDDEN`, `STATE_CONFLICT` |
| `POST /api/comments/{commentId}/hide` | `comments` | admin / owner のみ | moderation 記録 | `FORBIDDEN`, `STATE_CONFLICT` |
| `POST /api/content-links` | `content_links` | visibility と link 権限を満たす場合のみ | 重複禁止、自己リンク禁止 | `FORBIDDEN`, `VALIDATION_ERROR` |
| `DELETE /api/content-links/{linkId}` | `content_links` | 作成者または admin / owner | link 削除 | `FORBIDDEN`, `NOT_FOUND` |
| `POST /api/bookmarks` | `bookmarks` | 自分のみ | 重複 bookmark 禁止 | `FORBIDDEN`, `VALIDATION_ERROR` |
| `DELETE /api/bookmarks` | `bookmarks` | 自分のみ | bookmark 削除 | `FORBIDDEN`, `NOT_FOUND` |
| `POST /api/notifications/{notificationId}/read` | `notifications` | 自分宛のみ | `is_read = true` | `FORBIDDEN`, `NOT_FOUND` |
| `POST /api/notifications/read-all` | `notifications` | 自分宛未読のみ | bulk read | `FORBIDDEN` |

---

# 23. contract 補完

この節は、各 endpoint 節で request / response が省略されている部分を補完する。
各個別節に詳細がある場合はそちらを優先し、未定義部分はこの節を正とする。

## 23-1. request 補完

### `PATCH /api/knowledges/{knowledgeId}`

```json
{
  "title": "title",
  "summary": "summary or null",
  "content_json": {},
  "content_markdown": "markdown",
  "visibility": "workspace | admin_only | owner_only",
  "draft_visibility": "private | reviewer_shared | null",
  "result_type": "success | failure | conditional_success | unverified | null",
  "context_text": "context or null",
  "tag_ids": ["uuid"],
  "edit_summary": "optional"
}
```

### `PATCH /api/knowledge-edit-drafts/{draftId}`

```json
{
  "title": "title",
  "summary": "summary or null",
  "content_json": {},
  "content_markdown": "markdown",
  "draft_visibility": "private | reviewer_shared",
  "result_type": "success | failure | conditional_success | unverified | null",
  "context_text": "context or null",
  "tag_ids": ["uuid"],
  "edit_summary": "optional"
}
```

### `PATCH /api/questions/{questionId}`

```json
{
  "visibility": "workspace | admin_only | owner_only",
  "title": "title",
  "content_json": {},
  "content_markdown": "markdown",
  "tag_ids": ["uuid"],
  "edit_summary": "optional"
}
```

### `PATCH /api/answers/{answerId}`

```json
{
  "content_json": {},
  "content_markdown": "markdown"
}
```

### `PATCH /api/comments/{commentId}`

```json
{
  "content_json": {},
  "content_markdown": "markdown"
}
```

補足:

* request で省略した field は current 値を維持する
* `null` を許容してよい field だけ明示的に `null` を送ってよい

## 23-2. 共通 payload

### `user summary`

* `id`
* `email`
* `display_name`
* `avatar_url`

### `workspace membership summary`

* `membership_id`
* `workspace_id`
* `user`
  * `user summary`
* `role`
* `membership_status`
* `joined_at`
* `removed_at`

### `workspace invitation item`

* `id`
* `invited_email`
* `invited_role`
* `status`
* `expires_at`
* `invited_by`
  * `user summary`
* `accepted_by`
  * `user summary | null`
* `accepted_at`
* `created_at`
* `updated_at`

### `workspace join request item`

* `id`
* `request_user`
  * `user summary`
* `request_email`
* `request_comment`
* `status`
* `reviewed_by`
  * `user summary | null`
* `review_comment`
* `requested_at`
* `reviewed_at`
* `created_at`
* `updated_at`

### `tag item`

* `id`
* `name`
* `normalized_name`
* `status`
* `usage_count`
* `created_by`
  * `user summary`
* `merged_into_tag_id`
* `merged_into_tag_name`
* `sample_contents[]`
  * `content_type`
  * `content_id`
  * `title`
  * `created_at`
  * `updated_at`
* `created_at`
* `updated_at`

### `revision item`

* `id`
* `revision_number`
* `edited_by`
  * `user summary`
* `created_at`
* `edit_summary`

### `knowledge list item`

* `id`
* `source_type`
* `status`
* `visibility`
* `draft_visibility`
* `title`
* `summary`
* `result_type`
* `updated_at`
* `formalized_at`
* `created_by`
  * `user summary`
* `tags`
  * `tag item[]`
* `viewer`
  * `is_bookmarked`

### `knowledge detail`

* `id`
* `workspace_id`
* `source_type`
* `source_question_id`
* `source_answer_id`
* `status`
* `visibility`
* `draft_visibility`
* `title`
* `summary`
* `content_json`
* `content_markdown`
* `result_type`
* `context_text`
* `formalized_at`
* `created_by`
  * `user summary`
* `updated_by`
  * `user summary`
* `updated_at`
* `last_content_author`
  * `user summary | null`
* `tags`
  * `tag item[]`
* `links`
  * `link item[]`
* `comments`
  * `comment item[]`
* `latest_revision`
  * `revision item | null`
* `archive_info`
  * `archived_at`
  * `archived_by`
    * `user summary | null`
  * `archive_reason`
* `viewer`
  * `is_bookmarked`
* `permissions`
  * knowledge permissions DTO

### `knowledge review item`

* `id`
* `reviewer`
  * `user summary`
* `review_result`
* `comment_json`
* `comment_markdown`
* `created_at`

### `knowledge edit draft detail`

* `id`
* `knowledge_item_id`
* `status`
* `draft_visibility`
* `title`
* `summary`
* `content_json`
* `content_markdown`
* `result_type`
* `context_text`
* `created_by`
  * `user summary`
* `updated_by`
  * `user summary`
* `tags`
  * `tag item[]`
* `comments`
  * `comment item[]`
* `latest_revision`
  * `revision item | null`
* `permissions`
  * knowledge edit draft permissions DTO

### `question list item`

* `id`
* `status`
* `visibility`
* `title`
* `updated_at`
* `created_by`
  * `user summary`
* `tags`
  * `tag item[]`
* `stats`
  * `answer_count`
  * `comment_count`
* `accepted_answer_exists`
* `viewer`
  * `is_bookmarked`

### `answer item`

* `id`
* `content_json`
* `content_markdown`
* `created_by`
  * `user summary`
* `updated_by`
  * `user summary`
* `locked_at`
* `is_deleted`
* `created_at`
* `updated_at`
* `permissions`
  * answer permissions DTO

### `question detail`

* `id`
* `status`
* `visibility`
* `title`
* `content_json`
* `content_markdown`
* `created_by`
  * `user summary`
* `updated_by`
  * `user summary`
* `accepted_answer_id`
* `accepted_answer_snapshot_json`
* `accepted_answer_snapshot_markdown`
* `tags`
  * `tag item[]`
* `answers`
  * `answer item[]`
* `comments`
  * `comment item[]`
* `links`
  * `link item[]`
* `derived_knowledges`
  * `knowledge list item[]`
* `viewer`
  * `is_bookmarked`
* `permissions`
  * question permissions DTO

### `comment item`

* `id`
* `content_type`
* `content_id`
* `parent_comment_id`
* `content_json`
* `content_markdown`
* `created_by`
  * `user summary`
* `updated_by`
  * `user summary`
* `is_edited`
* `edited_at`
* `is_hidden`
* `hidden_reason_category`
* `hidden_reason_text`
* `created_at`
* `updated_at`
* `permissions`
  * comment permissions DTO

### `link item`

* `id`
* `source_type`
* `source_id`
* `target_type`
* `target_id`
* `link_type`
* `created_by`
  * `user summary`
* `created_at`

### `bookmark item`

* `id`
* `content_type`
* `content_id`
* `created_at`
* `preview`
  * `title`
  * `summary`
  * `status`
  * `visibility`
  * `updated_at`
  * `created_by`
    * `user summary`
  * `tags`
    * `tag item[]`

### `notification item`

* `id`
* `type`
* `actor`
  * `user summary | null`
* `target_type`
* `target_id`
* `message`
* `is_read`
* `created_at`

### `review queue item`

* `content_type`
  * `knowledge | knowledge_edit_draft`
* `id`
* `status`
* `title`
* `summary`
* `submitted_at`
* `updated_at`
* `created_by`
  * `user summary`
* `tags`
  * `tag item[]`

### `knowledge permissions DTO`

* `can_edit`
* `can_share`
* `can_request_review`
* `can_archive`
* `can_revoke_formal`
* `can_formalize`
* `can_review`
* `can_comment`
* `can_add_link`
* `can_create_edit_draft`
* `can_change_draft_visibility`

### `knowledge edit draft permissions DTO`

* `can_edit`
* `can_share`
* `can_request_review`
* `can_discard`
* `can_apply`
* `can_review`
* `can_comment`
* `can_change_draft_visibility`

### `question permissions DTO`

* `can_edit`
* `can_answer`
* `can_accept_answer`
* `can_reopen`
* `can_archive`
* `can_create_knowledge`
* `can_comment`
* `can_add_link`

### `answer permissions DTO`

* `can_edit`
* `can_delete`

### `comment permissions DTO`

* `can_edit`
* `can_hide`
* `can_reply`

## 23-3. response 補完

### auth

#### `POST /api/auth/logout`

* `data.logged_out = true`

### workspace / membership / invitation

#### `GET /api/workspaces/current/members`

* `data.items[] = workspace membership summary`

#### `POST /api/workspaces/current/invitations`

* `data.invitation = workspace invitation item`

#### `GET /api/workspaces/current/invitations`

* `data.items[] = workspace invitation item`

#### `POST /api/workspace-invitations/{invitationId}/revoke`

#### `POST /api/workspace-invitations/{invitationId}/resend`

* `data.invitation = workspace invitation item`

#### `POST /api/workspace-invitations/{token}/accept`

* `data.invitation = workspace invitation item`
* `data.membership = workspace membership summary`

#### `POST /api/workspaces/current/join-requests`

* `data.join_request = workspace join request item`

#### `GET /api/workspaces/current/join-requests`

* `data.items[] = workspace join request item`

#### `POST /api/workspace-join-requests/{joinRequestId}/approve`

#### `POST /api/workspace-join-requests/{joinRequestId}/reject`

#### `POST /api/workspace-join-requests/{joinRequestId}/cancel`

* `data.join_request = workspace join request item`

#### `POST /api/workspaces/current/members/{userId}/role`

#### `POST /api/workspaces/current/members/{userId}/remove`

* `data.membership = workspace membership summary`

#### `POST /api/workspaces/current/owner-transfer`

* `data.owner_transfer.previous_owner_membership = workspace membership summary`
* `data.owner_transfer.current_owner_membership = workspace membership summary`

### tag

#### `GET /api/workspaces/current/tags`

* `data.items[] = tag item`

#### `POST /api/workspaces/current/tags`

#### `PATCH /api/tags/{tagId}`

#### `POST /api/tags/{tagId}/merge`

#### `POST /api/tags/{tagId}/archive`

* `data.tag = tag item`

### knowledge

#### `GET /api/knowledges`

* `data.items[] = knowledge list item`

#### `POST /api/knowledges`

#### `GET /api/knowledges/{knowledgeId}`

#### `PATCH /api/knowledges/{knowledgeId}`

#### `POST /api/knowledges/{knowledgeId}/share`

#### `POST /api/knowledges/{knowledgeId}/request-review`

#### `POST /api/knowledges/{knowledgeId}/archive`

#### `POST /api/knowledges/{knowledgeId}/revoke-formal`

#### `POST /api/knowledges/{knowledgeId}/formalize`

#### `POST /api/knowledges/{knowledgeId}/draft-visibility`

* `data.knowledge = knowledge detail`

#### `GET /api/knowledges/{knowledgeId}/revisions`

* `data.items[] = revision item`

#### `GET /api/knowledges/{knowledgeId}/revisions/{revisionId}`

* `data.revision = revision item`
* `data.snapshot.title`
* `data.snapshot.summary`
* `data.snapshot.content_json_snapshot`
* `data.snapshot.content_markdown_snapshot`
* `data.snapshot.result_type_snapshot`
* `data.snapshot.context_text_snapshot`

#### `POST /api/knowledges/{knowledgeId}/reviews`

* `data.review = knowledge review item`
* `data.knowledge = knowledge detail`

#### `POST /api/knowledges/{knowledgeId}/edit-drafts`

* `data.knowledge_edit_draft = knowledge edit draft detail`

### knowledge edit draft

#### `GET /api/knowledge-edit-drafts/{draftId}`

#### `PATCH /api/knowledge-edit-drafts/{draftId}`

#### `POST /api/knowledge-edit-drafts/{draftId}/share`

#### `POST /api/knowledge-edit-drafts/{draftId}/request-review`

#### `POST /api/knowledge-edit-drafts/{draftId}/discard`

#### `POST /api/knowledge-edit-drafts/{draftId}/apply`

#### `POST /api/knowledge-edit-drafts/{draftId}/draft-visibility`

* `data.knowledge_edit_draft = knowledge edit draft detail`

#### `GET /api/knowledge-edit-drafts/{draftId}/revisions`

* `data.items[] = revision item`

#### `POST /api/knowledge-edit-drafts/{draftId}/reviews`

* `data.review = knowledge review item`
* `data.knowledge_edit_draft = knowledge edit draft detail`

### question / answer

#### `GET /api/questions`

* `data.items[] = question list item`

#### `POST /api/questions`

#### `GET /api/questions/{questionId}`

#### `PATCH /api/questions/{questionId}`

#### `POST /api/questions/{questionId}/accept-answer`

#### `POST /api/questions/{questionId}/reopen`

#### `POST /api/questions/{questionId}/archive`

* `data.question = question detail`

#### `GET /api/questions/{questionId}/revisions`

#### `GET /api/answers/{answerId}/revisions`

* `data.items[] = revision item`

#### `POST /api/questions/{questionId}/knowledges`

* `data.knowledge = knowledge detail`

#### `POST /api/questions/{questionId}/answers`

#### `PATCH /api/answers/{answerId}`

#### `POST /api/answers/{answerId}/delete`

* `data.answer = answer item`

### comment / link / bookmark / notification / review queue

#### `POST /api/comments`

#### `PATCH /api/comments/{commentId}`

#### `POST /api/comments/{commentId}/hide`

* `data.comment = comment item`

#### `POST /api/content-links`

#### `DELETE /api/content-links/{linkId}`

* `data.link = link item`

#### `POST /api/bookmarks`

#### `DELETE /api/bookmarks`

* `data.bookmark = bookmark item`

#### `GET /api/bookmarks`

* `data.items[] = bookmark item`

#### `GET /api/notifications`

* `data.items[] = notification item`

#### `POST /api/notifications/{notificationId}/read`

* `data.notification = notification item`

#### `POST /api/notifications/read-all`

* `data.read_count`
* `data.unread_count_after`

#### `GET /api/review-queue`

* `data.items[] = review queue item`
