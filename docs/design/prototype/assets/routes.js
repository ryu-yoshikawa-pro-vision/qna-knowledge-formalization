(function () {
  const routes = [
    { id: "auth.login", slug: "auth-login", title: "ログイン", template: "gateway", slice: "Slice 1", group: "認証・参加", defaultActor: "unaffiliated authenticated user", acceptance: ["S1", "S8"] },
    { id: "workspace.resolution", slug: "workspace-resolution", title: "ワークスペース存在判定 / 参加導線", template: "gateway", slice: "Slice 1", group: "認証・参加", defaultActor: "unaffiliated authenticated user", acceptance: ["S1", "S9"] },
    { id: "workspace.invitation_accept", slug: "workspace-invitation-accept", title: "招待受諾", template: "gateway", slice: "Slice 1", group: "認証・参加", defaultActor: "invitation target user", acceptance: ["S2"] },
    { id: "workspace.join_request", slug: "workspace-join-request", title: "参加申請", template: "gateway", slice: "Slice 1", group: "認証・参加", defaultActor: "join request applicant", acceptance: ["S1", "S9"] },
    { id: "knowledge.list", slug: "knowledge-list", title: "ナレッジ一覧", template: "list", slice: "Slice 2", group: "ナレッジ", defaultRole: "member", acceptance: ["S1", "S3", "S7", "S8"] },
    { id: "knowledge.detail", slug: "knowledge-detail", title: "ナレッジ詳細", template: "detail", slice: "Slice 2", group: "ナレッジ", defaultRole: "member", acceptance: ["S3", "S4", "S7"] },
    { id: "knowledge.create", slug: "knowledge-create", title: "ナレッジ作成", template: "editor", slice: "Slice 3", group: "ナレッジ", defaultRole: "member", acceptance: ["S3", "S6"] },
    { id: "knowledge.edit", slug: "knowledge-edit", title: "ナレッジ編集", template: "editor", slice: "Slice 3", group: "ナレッジ", defaultRole: "member", acceptance: ["S3"] },
    { id: "knowledge.revisions", slug: "knowledge-revisions", title: "ナレッジ履歴", template: "history", slice: "Slice 4 / 7", group: "ナレッジ", defaultRole: "member", acceptance: ["S4", "S10"] },
    { id: "knowledge.edit_draft_create", slug: "knowledge-edit-draft-create", title: "正式ナレッジ編集下書き作成", template: "editor", slice: "Slice 4", group: "ナレッジ", defaultRole: "member", acceptance: ["S4"] },
    { id: "knowledge.edit_draft_detail", slug: "knowledge-edit-draft-detail", title: "正式ナレッジ編集下書き詳細 / 編集", template: "editor", slice: "Slice 4", group: "ナレッジ", defaultRole: "member", acceptance: ["S4", "S7"] },
    { id: "review.queue", slug: "review-queue", title: "レビュー待ち一覧", template: "list", slice: "Slice 3", group: "横断レビュー", defaultRole: "reviewer", acceptance: ["S3", "S4", "S7", "S8"] },
    { id: "question.list", slug: "question-list", title: "質問一覧", template: "list", slice: "Slice 5", group: "Q&A", defaultRole: "member", acceptance: ["S5", "S6"] },
    { id: "question.detail", slug: "question-detail", title: "質問詳細", template: "detail", slice: "Slice 5", group: "Q&A", defaultRole: "member", acceptance: ["S5", "S6", "S10"] },
    { id: "question.create", slug: "question-create", title: "質問作成", template: "editor", slice: "Slice 5", group: "Q&A", defaultRole: "member", acceptance: ["S5"] },
    { id: "question.edit", slug: "question-edit", title: "質問編集", template: "editor", slice: "Slice 5", group: "Q&A", defaultRole: "member", acceptance: ["S5"] },
    { id: "notification.list", slug: "notification-list", title: "通知一覧", template: "list", slice: "Slice 6", group: "個人機能", defaultRole: "member", acceptance: ["S7", "S8", "S10"] },
    { id: "bookmark.list", slug: "bookmark-list", title: "ブックマーク一覧", template: "list", slice: "Slice 2 / 6", group: "個人機能", defaultRole: "member", acceptance: ["S2", "S10"] },
    { id: "admin.members", slug: "admin-members", title: "メンバー管理", template: "admin-table", slice: "Slice 7", group: "管理", defaultRole: "owner", acceptance: ["S2", "S7", "S9", "S10"] },
    { id: "admin.tags", slug: "admin-tags", title: "タグ管理", template: "admin-table", slice: "Slice 7", group: "管理", defaultRole: "admin", acceptance: ["S7"] }
  ];

  const scenarios = [
    { id: "scenario-1", title: "Scenario 1 初回ログインから workspace 作成", start: "auth.login", path: ["auth.login", "workspace.resolution", "knowledge.list"] },
    { id: "scenario-2", title: "Scenario 2 招待、再送、受諾", start: "admin.members", path: ["admin.members", "workspace.invitation_accept", "knowledge.list"] },
    { id: "scenario-3", title: "Scenario 3 直接投稿 knowledge の review / formalize", start: "knowledge.create", path: ["knowledge.create", "knowledge.detail", "review.queue", "knowledge.detail"] },
    { id: "scenario-4", title: "Scenario 4 formal knowledge の edit draft 作成から apply", start: "knowledge.detail", path: ["knowledge.detail", "knowledge.edit_draft_create", "knowledge.edit_draft_detail", "review.queue", "knowledge.detail"] },
    { id: "scenario-5", title: "Scenario 5 質問、回答、ベストアンサー、再オープン", start: "question.create", path: ["question.create", "question.detail", "question.detail"] },
    { id: "scenario-6", title: "Scenario 6 Q&A から knowledge 作成", start: "question.detail", path: ["question.detail", "knowledge.create", "knowledge.detail"] },
    { id: "scenario-7", title: "Scenario 7 タグ統合、検索、通知、レビュー待ちバッジ", start: "admin.tags", path: ["admin.tags", "knowledge.list", "notification.list", "review.queue"] },
    { id: "scenario-8", title: "Scenario 8 login / refresh / logout と共通ヘッダー", start: "auth.login", path: ["auth.login", "knowledge.list", "notification.list"] },
    { id: "scenario-9", title: "Scenario 9 参加申請コメント、取消、コメント編集 / 非表示", start: "workspace.join_request", path: ["workspace.join_request", "admin.members", "knowledge.detail"] },
    { id: "scenario-10", title: "Scenario 10 履歴導線と二重実行耐性", start: "question.detail", path: ["question.detail", "knowledge.revisions", "bookmark.list", "admin.members", "notification.list"] }
  ];

  window.DESIGN_PROTO_ROUTES = { routes, scenarios };
})();
