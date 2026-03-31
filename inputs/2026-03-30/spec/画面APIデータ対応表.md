# 画面APIデータ対応表

## 1. 目的

この表は、各画面が

* どの API を呼ぶか
* どの table を読む / 書くか
* どの権限が必要か
* どの副作用や通知が発生するか

を**1 行で追える**ようにするための traceability 文書である。

## 2. 対応表

| Screen ID | 入口条件 | 主 API | 主 read table | 主 write table | 権限 / 表示条件 | 通知 / 副作用 |
| --- | --- | --- | --- | --- | --- | --- |
| `auth.login` | 未ログイン | `GET /api/auth/me`, `POST /api/auth/google/callback` | `users`, `workspaces`, `workspace_members` | auth session 基盤 | 未ログインのみ | login 後に workspace resolution へ遷移 |
| `workspace.resolution` | ログイン済み、workspace 未確定 | `GET /api/workspace-resolution`, `POST /api/workspaces`, `POST /api/workspaces/current/join-requests` | `workspaces`, `workspace_members`, `workspace_join_requests` | `workspaces`, `workspace_members`, `workspace_join_requests`, `workspace_membership_logs`, `notifications` | ログイン済み | workspace 作成、join request 通知 |
| `workspace.invitation_accept` | 招待 token あり | `GET /api/workspace-invitations/{token}`, `POST /api/workspace-invitations/{token}/accept` | `workspace_invitations`, `workspaces` | `workspace_invitations`, `workspace_members`, `workspace_membership_logs` | 招待先本人のみ | invitation preview、membership 作成 |
| `workspace.join_request` | 同一ドメイン workspace 存在、未参加 | `POST /api/workspaces/current/join-requests`, `POST /api/workspace-join-requests/{id}/cancel` | `workspace_join_requests`, `workspaces` | `workspace_join_requests`, `workspace_membership_logs`, `notifications` | ログイン済み、未参加 | owner/admin へ申請通知 |
| `knowledge.list` | workspace member | `GET /api/knowledges`, `POST /api/bookmarks`, `DELETE /api/bookmarks` | `knowledge_items`, `knowledge_item_tags`, `tags`, `bookmarks` | `bookmarks` | visibility を満たす member | bookmark 追加 / 解除 |
| `knowledge.detail` | visibility を満たす | `GET /api/knowledges/{knowledgeId}`, `POST /api/knowledges/{knowledgeId}/share`, `POST /api/knowledges/{knowledgeId}/request-review`, `POST /api/knowledges/{knowledgeId}/archive`, `POST /api/knowledges/{knowledgeId}/revoke-formal`, `POST /api/knowledges/{knowledgeId}/draft-visibility`, `POST /api/knowledges/{knowledgeId}/reviews`, `POST /api/knowledges/{knowledgeId}/formalize`, `POST /api/comments`, `PATCH /api/comments/{commentId}`, `POST /api/comments/{commentId}/hide`, `POST /api/content-links`, `DELETE /api/content-links/{linkId}`, `POST /api/bookmarks`, `DELETE /api/bookmarks` | `knowledge_items`, `knowledge_reviews`, `knowledge_revisions`, `knowledge_item_tags`, `content_links`, `comments`, `bookmarks` | `knowledge_items`, `knowledge_reviews`, `comments`, `content_links`, `bookmarks`, `notifications` | 作成者 / reviewer / admin / owner / 閲覧者で UI 分岐 | review、formalize、archive、comment、link |
| `knowledge.create` | workspace member | `POST /api/knowledges`, `GET /api/workspaces/current/tags` | `tags` | `knowledge_items`, `knowledge_revisions`, `knowledge_item_tags` | workspace member | 作成時は通知なし |
| `knowledge.edit` | 自分の非 formal knowledge | `GET /api/knowledges/{knowledgeId}`, `PATCH /api/knowledges/{knowledgeId}`, `POST /api/knowledges/{knowledgeId}/request-review`, `POST /api/knowledges/{knowledgeId}/draft-visibility` | `knowledge_items`, `knowledge_reviews`, `knowledge_revisions` | `knowledge_items`, `knowledge_revisions`, `knowledge_item_tags` | 作成者本人 | `review_requested` / `changes_requested` 保存時は `shared` へ戻る |
| `knowledge.revisions` | visibility を満たす | `GET /api/knowledges/{knowledgeId}/revisions`, `GET /api/knowledges/{knowledgeId}/revisions/{revisionId}` | `knowledge_revisions` | なし | 閲覧可能者 | read only |
| `knowledge.edit_draft_create` | 自分が作成した formal knowledge | `GET /api/knowledges/{knowledgeId}`, `POST /api/knowledges/{knowledgeId}/edit-drafts` | `knowledge_items`, `knowledge_edit_drafts` | `knowledge_edit_drafts`, `knowledge_edit_draft_revisions`, `knowledge_edit_draft_tags` | 元作成者本人のみ | 未完了 draft の重複防止 |
| `knowledge.edit_draft_detail` | visibility を満たす draft 閲覧条件を満たす | `GET /api/knowledge-edit-drafts/{draftId}`, `PATCH /api/knowledge-edit-drafts/{draftId}`, `POST /api/knowledge-edit-drafts/{draftId}/share`, `POST /api/knowledge-edit-drafts/{draftId}/request-review`, `POST /api/knowledge-edit-drafts/{draftId}/discard`, `POST /api/knowledge-edit-drafts/{draftId}/apply`, `POST /api/knowledge-edit-drafts/{draftId}/draft-visibility`, `POST /api/knowledge-edit-drafts/{draftId}/reviews`, `GET /api/knowledge-edit-drafts/{draftId}/revisions`, `POST /api/comments` | `knowledge_edit_drafts`, `knowledge_edit_draft_revisions`, `knowledge_edit_draft_reviews`, `knowledge_edit_draft_tags`, `comments` | `knowledge_edit_drafts`, `knowledge_edit_draft_revisions`, `knowledge_edit_draft_reviews`, `comments`, `notifications`, `knowledge_items`, `knowledge_revisions` | 作成者 / reviewer / admin / owner で UI 分岐 | changes requested、apply、discard |
| `review.queue` | reviewer / admin / owner | `GET /api/review-queue`, `GET /api/review-queue/count` | `knowledge_items`, `knowledge_edit_drafts`, `tags` | なし | reviewer / admin / owner のみ | badge と同じ対象を表示 |
| `question.list` | workspace member | `GET /api/questions`, `POST /api/bookmarks`, `DELETE /api/bookmarks` | `questions`, `question_tags`, `bookmarks`, `answers` | `bookmarks` | visibility を満たす member | bookmark 追加 / 解除 |
| `question.detail` | visibility を満たす | `GET /api/questions/{questionId}`, `POST /api/questions/{questionId}/answers`, `PATCH /api/answers/{answerId}`, `POST /api/answers/{answerId}/delete`, `POST /api/questions/{questionId}/accept-answer`, `POST /api/questions/{questionId}/reopen`, `POST /api/questions/{questionId}/archive`, `POST /api/questions/{questionId}/knowledges`, `POST /api/comments`, `POST /api/content-links`, `POST /api/bookmarks`, `DELETE /api/bookmarks` | `questions`, `answers`, `answer_revisions`, `question_revisions`, `comments`, `content_links`, `knowledge_items` | `answers`, `questions`, `question_revisions`, `comments`, `content_links`, `bookmarks`, `knowledge_items`, `knowledge_revisions`, `notifications` | 質問投稿者 / admin / owner / 回答者 / 閲覧者で分岐 | new answer、best answer、reopen、knowledge 化 |
| `question.create` | workspace member | `POST /api/questions`, `GET /api/workspaces/current/tags` | `tags` | `questions`, `question_revisions`, `question_tags` | workspace member | 作成時は通知なし |
| `question.edit` | 自分の `open` question | `GET /api/questions/{questionId}`, `PATCH /api/questions/{questionId}` | `questions`, `question_revisions` | `questions`, `question_revisions`, `question_tags` | 質問投稿者本人のみ | `resolved_locked` では編集不可 |
| `notification.list` | ログイン済み | `GET /api/notifications`, `POST /api/notifications/{notificationId}/read`, `POST /api/notifications/read-all` | `notifications` | `notifications` | 自分の通知のみ | 既読化 |
| `bookmark.list` | ログイン済み | `GET /api/bookmarks`, `DELETE /api/bookmarks` | `bookmarks`, `knowledge_items`, `questions` | `bookmarks` | 自分の bookmark のみ | bookmark 解除 |
| `admin.members` | owner / admin | `GET /api/workspaces/current/members`, `GET /api/workspaces/current/invitations`, `POST /api/workspaces/current/invitations`, `POST /api/workspace-invitations/{invitationId}/revoke`, `POST /api/workspace-invitations/{invitationId}/resend`, `GET /api/workspaces/current/join-requests`, `POST /api/workspace-join-requests/{id}/approve`, `POST /api/workspace-join-requests/{id}/reject`, `POST /api/workspaces/current/members/{userId}/role`, `POST /api/workspaces/current/owner-transfer`, `POST /api/workspaces/current/members/{userId}/remove` | `workspace_members`, `workspace_invitations`, `workspace_join_requests`, `workspace_role_change_logs`, `workspace_membership_logs` | 同左 + `notifications` | owner / admin のみ | 招待、再送、承認、role 変更、owner transfer |
| `admin.tags` | owner / admin | `GET /api/workspaces/current/tags`, `POST /api/workspaces/current/tags`, `PATCH /api/tags/{tagId}`, `POST /api/tags/{tagId}/merge`, `POST /api/tags/{tagId}/archive` | `tags`, `knowledge_item_tags`, `question_tags`, `knowledge_edit_draft_tags` | `tags`, 各 tag mapping table, `notifications` | owner / admin のみ | tag merge / archive、tag changed notification |

## 3. 使い方

* backend 実装者は 1 行を起点に endpoint と affected table を確認する
* frontend 実装者は 1 行を起点に screen の API と role 分岐を確認する
* PM / reviewer は通知と副作用の抜け漏れ確認に使う
