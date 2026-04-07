(function () {
  function section(title, copy, content) {
    return '<section class="section"><div class="section-head"><div><div class="section-kicker">Section</div><h2 class="section-title">' + title + '</h2></div></div><p class="section-copy">' + copy + '</p>' + content + "</section>";
  }

  function card(title, copy, meta) {
    return '<article class="card"><h3 class="card-title">' + title + '</h3><p class="card-copy">' + copy + '</p>' + (meta ? '<p class="card-meta">' + meta + "</p>" : "") + "</article>";
  }

  function status(label, variant) {
    return '<span class="status status-' + variant + '">' + label + "</span>";
  }

  function badges(items) {
    return '<div class="status-row">' + items.join("") + "</div>";
  }

  function bulletList(items) {
    return '<ul class="bullet-list">' + items.map(function (item) {
      return "<li>" + item + "</li>";
    }).join("") + "</ul>";
  }

  function flowList(items) {
    return '<ol class="flow-list">' + items.map(function (item) {
      return "<li>" + item + "</li>";
    }).join("") + "</ol>";
  }

  function metrics(items) {
    return '<div class="metric-grid">' + items.map(function (item) {
      return '<div class="metric-card"><div class="meta-label">' + item.label + '</div><div class="metric-value">' + item.value + '</div><p class="card-meta">' + item.note + "</p></div>";
    }).join("") + "</div>";
  }

  function inputField(label, value) {
    return '<div class="editor-field"><label>' + label + '</label><div class="input">' + value + "</div></div>";
  }

  function textAreaField(label, value) {
    return '<div class="editor-field"><label>' + label + '</label><div class="textarea">' + value + "</div></div>";
  }

  function table(headers, rows) {
    return '<div class="table-wrap"><div class="table-scroll"><table><thead><tr>' + headers.map(function (header) {
      return "<th>" + header + "</th>";
    }).join("") + "</tr></thead><tbody>" + rows.map(function (row) {
      return "<tr" + (row.className ? ' class="' + row.className + '"' : "") + ">" + row.cells.map(function (cell) {
        return "<td>" + cell + "</td>";
      }).join("") + "</tr>";
    }).join("") + "</tbody></table></div></div>";
  }

  function emptyBlock(title, copy) {
    return '<div class="empty-block"><strong>' + title + "</strong><p>" + copy + "</p></div>";
  }

  function errorBlock(title, copy) {
    return '<div class="error-block"><strong>' + title + "</strong><p>" + copy + "</p></div>";
  }

  function permissionBlock(title, copy) {
    return '<div class="permission-block"><strong>' + title + "</strong><p>" + copy + "</p></div>";
  }

  function loadingBlock() {
    return '<div class="loading-block"><strong>Loading state</strong><div class="loading-bars"><div class="loading-bar"></div><div class="loading-bar"></div><div class="loading-bar"></div></div></div>';
  }

  const pages = {
    "__index__": {
      title: "Design Prototype Index",
      subtitle: "20 screen routes, shared shell, and Scenario 1 through 10 coverage."
    },
    "auth.login": {
      title: "ログイン画面",
      subtitle: "Google sign-in only, no marketing chrome.",
      signedIn: false,
      supportActors: ["unaffiliated authenticated user"],
      specRefs: ["docs/spec/画面仕様書.md", "docs/spec/受け入れ基準.md"],
      designRefs: ["docs/design/DESIGN.md", "docs/design/1. Login Screen.md"],
      coverage: ["Scenario 1", "Scenario 8"],
      presets: {
        default: {
          label: "Default",
          stateBadges: [status("未ログイン", "draft"), status("Workspace 未確定", "info")],
          summary: "社内知識基盤への入口。workspace ベース access と Google sign-in を明示し、最短で `workspace.resolution` に進める。",
          notices: [
            { tone: "info", title: "Behavior note", body: "この画面では signed-in navigation を出さず、Google login と workspace-based access policy だけを見せる。" }
          ],
          actions: [
            { label: "Continue with Google", kind: "primary", route: "workspace.resolution", params: { preset: "create-path" } }
          ],
          body:
            section("Value proposition", "質問、回答、直接投稿を formal knowledge に変える product であることを短く伝える。", '<div class="two-up">' +
              card("Knowledge-first access", "ログイン後の主要導線は質問投稿ではなく knowledge discovery。", "spec: Scenario 1, Scenario 8") +
              card("Workspace-based access", "同一ドメイン workspace に紐づく access policy を entry point で明示する。", "actor: unaffiliated authenticated user") +
            "</div>") +
            section("Sign-in journey", "Google sign-in 後は workspace existence 判定へ進む。", flowList([
              "Google login を完了する",
              "workspace resolution で create / invitation / join request の入口を判断する",
              "workspace 参加後は knowledge list を landing にする"
            ]))
        }
      }
    },
    "workspace.resolution": {
      title: "ワークスペース存在判定 / 参加導線画面",
      subtitle: "Create path and join path are kept on the same gateway.",
      signedIn: false,
      supportActors: ["unaffiliated authenticated user"],
      specRefs: ["docs/spec/画面仕様書.md", "docs/spec/画面APIデータ対応表.md"],
      designRefs: ["docs/design/2. Workspace Join Gateway Screen.md", "docs/design/README.md"],
      coverage: ["Scenario 1", "Scenario 9"],
      presets: {
        "create-path": {
          label: "Create path",
          stateBadges: [status("relationship_status = none", "info")],
          summary: "同一ドメイン workspace が未作成のときに owner として初回作成へ進む path。",
          notices: [
            { tone: "success", title: "Scenario 1", body: "workspace 作成後は creator が owner になり、`knowledge.list` に遷移する。" }
          ],
          actions: [
            { label: "Workspace を作成して続行", kind: "primary", route: "knowledge.list", params: { role: "owner" } },
            { label: "既存 workspace path を見る", kind: "secondary", route: "workspace.resolution", params: { preset: "existing-workspace" } }
          ],
          body:
            section("Create workspace", "workspace 未作成時は迷わせず create を primary action にする。", '<div class="editor-form">' +
              inputField("Workspace name", "Knowledge Operations Japan") +
              inputField("Domain", "example.co.jp") +
              card("Expected result", "workspace 1 件作成、creator を owner に昇格、knowledge list へ landing。", "write: workspaces, workspace_members, notifications") +
            "</div>") +
            section("State coverage", "参加前 actor が見るべき状態を gateway 上でまとめる。", metrics([
              { label: "Workspace", value: "0", note: "同一ドメイン未作成" },
              { label: "Join request", value: "0", note: "pending request なし" },
              { label: "Invitation", value: "0", note: "token を持たない状態" }
            ]))
        },
        "existing-workspace": {
          label: "Existing workspace",
          stateBadges: [status("relationship_status = pending_join_request", "changes"), status("招待待ち", "info")],
          summary: "同一ドメイン workspace が既に存在し、招待または join request を促す path。",
          notices: [
            { tone: "warning", title: "Scenario 9", body: "join request を送った後は cancel でき、owner/admin に notification が飛ぶ。" }
          ],
          actions: [
            { label: "Join request へ進む", kind: "primary", route: "workspace.join_request", params: { preset: "draft" } },
            { label: "Invitation preview を確認", kind: "secondary", route: "workspace.invitation_accept", params: { actor: "invitation target user", preset: "preview" } }
          ],
          body:
            section("Existing workspace options", "同一ドメイン workspace を検知したら create より join 導線を優先する。", '<div class="screen-grid">' +
              card("Join request", "コメント付き申請、pending 状態、cancel 導線を一画面で扱う。", "acceptance: Scenario 9") +
              card("Invitation acceptance", "token 保持者には preview / accept / expired を見せる。", "acceptance: Scenario 2") +
            "</div>") +
            section("Fallback states", "gateway でも empty / error を持つ。", '<div class="two-up">' +
              emptyBlock("No invitation token", "token が無い場合は join request へ誘導する。") +
              errorBlock("Domain mismatch", "招待 token の domain が一致しない場合は `DOMAIN_MISMATCH` を説明する。") +
            "</div>")
        }
      }
    },
    "workspace.invitation_accept": {
      title: "招待受諾画面",
      subtitle: "Preview invitation metadata before accept.",
      signedIn: false,
      supportActors: ["invitation target user"],
      specRefs: ["docs/spec/状態遷移仕様.md", "docs/spec/受け入れ基準.md"],
      designRefs: ["docs/design/9. Invitation Acceptance Screen.md", "docs/design/README.md"],
      coverage: ["Scenario 2"],
      presets: {
        preview: {
          label: "Preview",
          stateBadges: [status("pending", "under-review"), status("Invitation target", "info")],
          summary: "workspace 名、招待 email、role、expiry、status を preview し、受諾前に確認する。",
          notices: [
            { tone: "info", title: "Preview fields", body: "workspace 名、招待メール、role、expiry、status の 5 要素を必ず見せる。" }
          ],
          actions: [
            { label: "招待を受諾して続行", kind: "primary", route: "knowledge.list", params: { role: "member" } },
            { label: "Accepted state を見る", kind: "secondary", route: "workspace.invitation_accept", params: { preset: "accepted" } }
          ],
          body:
            section("Invitation preview", "preview は受諾前の事実確認であり、marketing copy は不要。", '<div class="screen-grid">' +
              card("Workspace", "Knowledge Operations Japan", "workspace status: active") +
              card("Invited email", "new.member@example.co.jp", "role: member / expires in 48h") +
            "</div>") +
            section("Failure handling", "受諾不能な状態も同画面で説明する。", '<div class="two-up">' +
              errorBlock("Expired token", "status = expired の場合は再招待依頼の導線だけを残す。") +
              errorBlock("Wrong account", "招待先本人以外では accept させない。") +
            "</div>")
        },
        accepted: {
          label: "Accepted",
          stateBadges: [status("accepted", "success")],
          summary: "受諾後は membership 作成を明示し、そのまま knowledge list に送る。",
          notices: [
            { tone: "success", title: "Membership created", body: "`workspace_members` と `workspace_membership_logs` が更新される想定を注記する。" }
          ],
          actions: [
            { label: "Knowledge list へ進む", kind: "primary", route: "knowledge.list", params: { role: "member" } }
          ],
          body:
            section("Accepted result", "状態が終端であることを明示し、次の action を一つに絞る。", '<div class="card-stack">' +
              card("Membership status", "active member として workspace 参加が完了。", "state machine: pending -> accepted") +
              card("Next destination", "default landing は knowledge list。", "knowledge-first design") +
            "</div>")
        },
        expired: {
          label: "Expired",
          stateBadges: [status("expired", "danger")],
          summary: "再送依頼が必要な終端状態。",
          notices: [
            { tone: "danger", title: "Terminal state", body: "`accepted / revoked / expired` は実質終端。逆遷移させない。" }
          ],
          actions: [
            { label: "再招待が必要なことを確認", kind: "secondary", route: "admin.members", params: { role: "admin", preset: "invitations" } }
          ],
          body: section("Expired handling", "受諾ボタンは消し、再送依頼だけを示す。", errorBlock("Invitation expired", "owner/admin に再送を依頼してください。"))
        }
      }
    },
    "workspace.join_request": {
      title: "参加申請画面",
      subtitle: "Commented join request with cancel support.",
      signedIn: false,
      supportActors: ["join request applicant"],
      specRefs: ["docs/spec/画面仕様書.md", "docs/spec/状態遷移仕様.md"],
      designRefs: ["docs/design/10. Join Request Screen.md", "docs/design/README.md"],
      coverage: ["Scenario 1", "Scenario 9"],
      presets: {
        draft: {
          label: "Draft",
          stateBadges: [status("pending を作成前", "draft")],
          summary: "申請コメント付きで request を作成する直前の状態。",
          notices: [
            { tone: "info", title: "Comment is required for review context", body: "`request_comment` を UI で明示し、理由なき申請にしない。" }
          ],
          actions: [
            { label: "Join request を送る", kind: "primary", route: "workspace.join_request", params: { preset: "pending" } },
            { label: "Workspace gateway へ戻る", kind: "secondary", route: "workspace.resolution", params: { preset: "existing-workspace" } }
          ],
          body:
            section("Join request form", "申請理由と期待 role を最小入力でまとめる。", '<div class="editor-form">' +
              inputField("Workspace", "Knowledge Operations Japan") +
              textAreaField("Request comment", "Knowledge review と tags governance を担当するため参加したいです。") +
              card("Expected side effect", "owner/admin へ申請通知。`workspace_membership_logs.action = join_requested` を残す。", "acceptance: Scenario 9") +
            "</div>")
        },
        pending: {
          label: "Pending",
          stateBadges: [status("pending", "under-review"), status("cancel 可能", "changes")],
          summary: "pending request と cancel action を同一画面で確認する。",
          notices: [
            { tone: "warning", title: "Cancel is idempotent", body: "取消再実行で余分な副作用を出さない。log は `join_cancelled` を記録する。" }
          ],
          actions: [
            { label: "申請を取り消す", kind: "destructive", route: "workspace.join_request", params: { preset: "draft" } },
            { label: "管理側の確認画面へ", kind: "secondary", route: "admin.members", params: { role: "admin", preset: "join-requests" } }
          ],
          body:
            section("Pending request summary", "送信済み申請の status と comment を読み返せるようにする。", '<div class="screen-grid">' +
              card("Request status", "pending / submitted 5 minutes ago", "reviewed by owner or admin") +
              card("Submitted comment", "Knowledge review と tags governance を担当するため参加したいです。", "stored in workspace_join_requests.request_comment") +
            "</div>") +
            section("System states", "gateway でも empty / error を持つ。", '<div class="two-up">' +
              loadingBlock() +
              errorBlock("Submission error", "network failure 時は retry を出し、重複作成を避ける。") +
            "</div>")
        }
      }
    },
    "knowledge.list": {
      title: "ナレッジ一覧画面",
      subtitle: "Formal knowledge is the default browsing surface.",
      signedIn: true,
      supportRoles: ["owner", "admin", "reviewer", "member"],
      specRefs: ["docs/spec/画面仕様書.md", "docs/spec/受け入れ基準.md"],
      designRefs: ["docs/design/DESIGN.md", "docs/design/3. Knowledge List Screen.md"],
      coverage: ["Scenario 1", "Scenario 3", "Scenario 7", "Scenario 8"],
      presets: {
        default: {
          label: "Default",
          stateBadges: [status("Formal default", "formal"), status("Q&A derived 混在", "qa")],
          summary: "formal knowledge を default で並べ、search/filter、bookmark、badge を一か所に集約する。",
          notices: [
            { tone: "info", title: "Header contract", body: "workspace 名、通知未読、review queue badge を signed-in shell で共有する。" }
          ],
          actions: [
            { label: "Knowledge を投稿", kind: "primary", route: "knowledge.create", params: { role: "member", preset: "draft" } },
            { label: "詳細を開く", kind: "secondary", route: "knowledge.detail", params: { role: "member", preset: "formal" } },
            { label: "Bookmarks を見る", kind: "tertiary", route: "bookmark.list", params: { role: "member", preset: "default" } }
          ],
          body:
            section("Search and filters", "検索、tag、status、source type を固定位置に置く。", '<div class="screen-grid">' +
              card("Search", "formal knowledge、Q&A derived、archived の違いを同一 UI で比較する。", "query + sort + chip filters") +
              card("Filter set", "tag filter、status filter、updated date sort を compact に並べる。", "list screens use the same filter language") +
            "</div>") +
            section("Knowledge cards", "一覧比較に必要な metadata だけを載せる。", '<div class="card-stack">' +
              card("認証 refresh token の rotation 方針", badges([status("Formal", "formal"), status("Security", "info")]) + '<p class="card-copy">token rotate、logout 無効化、session traceability をまとめた formal knowledge。</p><p class="card-meta">updated 2h ago / created by S. Ito / bookmarked</p>', "acceptance: Scenario 8") +
              card("質問から派生した DB migration 手順", badges([status("Formal", "formal"), status("Q&A derived", "qa")]) + '<p class="card-copy">best answer を起点に formalized した migration checklist。</p><p class="card-meta">source_question_id present / updated yesterday</p>', "acceptance: Scenario 6") +
              card("レビュー差し戻し中の editor UX", badges([status("Changes requested", "changes"), status("Shared", "draft")]) + '<p class="card-copy">review_requested 中の編集で shared に戻る rule を説明。</p><p class="card-meta">creator only edit / badge visible</p>', "acceptance: Scenario 3") +
            "</div>") +
            section("List states", "list では loading / empty / error を必須にする。", '<div class="screen-grid">' + loadingBlock() + emptyBlock("No formal knowledge yet", "workspace 参加直後は create action を primary にする。") + errorBlock("Knowledge fetch failed", "retry button と read-only fallback note を表示する。") + "</div>")
        },
        empty: {
          label: "Empty",
          stateBadges: [status("Empty", "muted")],
          summary: "formal knowledge 0 件時の empty state。",
          notices: [{ tone: "warning", title: "Next action", body: "Knowledge-first を守りつつ、create か question browse を提案する。" }],
          actions: [{ label: "最初の Knowledge を作成", kind: "primary", route: "knowledge.create", params: { role: "member" } }],
          body: section("Empty state", "filter で 0 件なのか、workspace 全体で 0 件なのかを明示する。", emptyBlock("No formal knowledge yet", "最初の knowledge を投稿するか、question から知見候補を探してください。"))
        },
        error: {
          label: "Error",
          stateBadges: [status("Error", "danger")],
          summary: "再試行導線付き error state。",
          notices: [{ tone: "danger", title: "Retry only", body: "失敗時も bookmark や create を誤って動かさない。" }],
          actions: [{ label: "再試行して一覧を開く", kind: "primary", route: "knowledge.list", params: { role: "member", preset: "default" } }],
          body: section("Error state", "曖昧な failure copy を避ける。", errorBlock("Knowledge list unavailable", "API 再試行後も失敗する場合は support へ連絡してください。"))
        }
      }
    },
    "knowledge.detail": {
      title: "ナレッジ詳細画面",
      subtitle: "Read deeply, act carefully, never suggest editing another user's body.",
      signedIn: true,
      supportRoles: ["owner", "admin", "reviewer", "member"],
      specRefs: ["docs/spec/状態遷移仕様.md", "docs/spec/権限マトリクス.md", "docs/spec/画面APIデータ対応表.md"],
      designRefs: ["docs/design/4. Knowledge Detail Screen.md", "docs/design/DESIGN.md"],
      coverage: ["Scenario 3", "Scenario 4", "Scenario 7"],
      presets: {
        "review-requested": {
          label: "Review requested",
          stateBadges: [status("Under review", "under-review"), status("Previous formal version exists", "previous")],
          summary: "review_requested 中の正文読みと reviewer/admin/owner action を同居させる。",
          notices: [
            { tone: "warning", title: "Invariant", body: "review_requested 中に本文が変わったら `shared` に戻す。prototype でもその注記を常に表示する。" }
          ],
          actions: [
            { label: "レビュー待ち一覧へ", kind: "secondary", route: "review.queue", params: { role: "reviewer", preset: "default" } },
            { label: "Formalize view を見る", kind: "primary", route: "knowledge.detail", roles: ["owner", "admin"], params: { preset: "formal" } },
            { label: "編集画面を開く", kind: "tertiary", route: "knowledge.edit", roles: ["member"], params: { preset: "changes-requested" } }
          ],
          body:
            section("Knowledge body", "本文を主役にしつつ、status、source、result attributes をタイトル直下へ集約する。", '<div class="card-stack">' +
              card("レビュー差し戻し中の editor UX", badges([status("Under Review", "under-review"), status("Q&A derived", "qa")]) + '<p class="card-copy">差し戻し理由を editor 上部に残し、再保存時に shared へ戻すべき理由を説明する。</p><p class="card-meta">creator: S. Ito / last updated: 2026-04-03 14:20 / last content author: S. Ito</p>', "read: knowledge_items, knowledge_reviews") +
              card("Links and comments", '<p class="card-copy">related / derived_from links と question-level comment thread を detail 下部で扱う。</p>' + bulletList(["related link: Token rotation acceptance checklist", "comment: review reason を本文でなく comment に残す", "bookmark toggle is visible to all viewers"]), "write: comments, content_links, bookmarks") +
            "</div>") +
            section("System states", "detail では loading / error / permission_denied を必須にする。", '<div class="screen-grid">' +
              loadingBlock() +
              errorBlock("Knowledge detail failed", "retry しても再現する場合は list に戻す。") +
              permissionBlock("You cannot review this content", "viewer role では review controls を出さない。") +
            "</div>")
        },
        formal: {
          label: "Formal",
          stateBadges: [status("Formal", "formal"), status("Search target", "success")],
          summary: "formal knowledge は default search 対象であり、edit draft を別提案として扱う。",
          notices: [
            { tone: "success", title: "Formalized content", body: "正式化済み本文は source of truth。直接編集せず edit draft を作る。" }
          ],
          actions: [
            { label: "Edit draft を作成", kind: "primary", route: "knowledge.edit_draft_create", params: { role: "member", preset: "ready" } },
            { label: "履歴を見る", kind: "secondary", route: "knowledge.revisions", params: { role: "member" } },
            { label: "Revoke formal を確認", kind: "tertiary", route: "knowledge.detail", roles: ["owner", "admin"], params: { preset: "archived" } }
          ],
          body:
            section("Formal surface", "formal は current truth として読み物優先にする。", '<div class="screen-grid">' +
              card("Context", "Auth / security / session management", "result_type: success") +
              card("Tags", "security, auth, mobile, refresh-token", "bookmarkable, searchable") +
            "</div>") +
            section("Comments and links", "comment と links は周辺情報として整理し、本文と混ぜない。", '<div class="two-up">' +
              card("Related links", "Mobile refresh acceptance, session revoke design, notification dedupe rule", "link types: related, derived_from") +
              card("Discussion", "owner/admin は comment hide 可。本文編集は不可。", "permission split from body editing") +
            "</div>")
        },
        archived: {
          label: "Archived",
          stateBadges: [status("Archived", "archived")],
          summary: "archive 理由を detail 上で説明し、active content と混同させない。",
          notices: [
            { tone: "danger", title: "Archive reason is mandatory", body: "archive / discard / delete 系は理由を残す前提で示す。" }
          ],
          actions: [
            { label: "一覧へ戻る", kind: "secondary", route: "knowledge.list", params: { role: "member" } }
          ],
          body: section("Archived state", "status badge と archive reason を title 近くに固定する。", '<div class="card-stack">' +
            card("Archive reason", "OAuth provider migration 完了により旧手順を閉じた。", "visibility remains read-only") +
            permissionBlock("No edit on archived content", "bookmark 以外の mutation action は出さない。") +
          "</div>")
        }
      }
    },
    "knowledge.create": {
      title: "ナレッジ作成画面",
      subtitle: "Save, share, and request review are separated.",
      signedIn: true,
      supportRoles: ["owner", "admin", "reviewer", "member"],
      specRefs: ["docs/spec/画面仕様書.md", "docs/spec/受け入れ基準.md"],
      designRefs: ["docs/design/5. Knowledge Create Screen.md", "docs/design/DESIGN.md"],
      coverage: ["Scenario 3", "Scenario 6"],
      presets: {
        draft: {
          label: "Draft",
          stateBadges: [status("Draft", "draft")],
          summary: "`submit_action = draft` を default として見せ、review action とは分ける。",
          notices: [{ tone: "info", title: "Editor rule", body: "保存系と申請系の action を明確に分離する。" }],
          actions: [
            { label: "下書き保存", kind: "primary", route: "knowledge.detail", params: { role: "member", preset: "review-requested" } },
            { label: "Question 一覧を見る", kind: "secondary", route: "question.list", params: { role: "member" } }
          ],
          body:
            section("Editor fields", "title、summary、tags、body、source_type を最小構成で持つ。", '<div class="editor-form">' +
              inputField("Title", "Refresh token rotation fallback checklist") +
              inputField("Summary", "token rotate / revoke / logout の挙動を 7 項目で確認する。") +
              inputField("Tags", "auth, mobile, session") +
              textAreaField("Body", "1. Mobile refresh では token rotate を確認する。 2. Logout 後は current session と refresh token を失効する。") +
            "</div>") +
            section("Submission paths", "submit_action で初期状態が変わる。", metrics([
              { label: "draft", value: "保存", note: "自分だけが続き編集する" },
              { label: "shared", value: "共有", note: "workspace visible, review 申請前" },
              { label: "request_review", value: "申請", note: "review queue badge に反映" }
            ]))
        },
        "request-review": {
          label: "Request review",
          stateBadges: [status("Under review", "under-review")],
          summary: "作成直後に request_review した path。",
          notices: [{ tone: "success", title: "Queue impact", body: "`review_requested` 件数が header badge と queue list に反映される。" }],
          actions: [
            { label: "レビュー待ち一覧へ", kind: "primary", route: "review.queue", params: { role: "reviewer" } },
            { label: "ナレッジ詳細を開く", kind: "secondary", route: "knowledge.detail", params: { role: "member", preset: "review-requested" } }
          ],
          body: section("Review readiness", "reviewer が見る metadata を create 直後から揃える。", '<div class="screen-grid">' +
            card("Checklist", "summary, tags, result attributes, links seed を入力済み。", "ready for review") +
            card("Queue sync", "review queue badge = 3、queue list でも同じ item が見える。", "Scenario 7") +
          "</div>")
        },
        "qa-derived": {
          label: "Q&A derived",
          stateBadges: [status("Q&A derived", "qa"), status("Draft", "draft")],
          summary: "question detail から knowledge 化した初期 draft。",
          notices: [{ tone: "info", title: "Scenario 6", body: "best answer があれば初期本文に差し込む。" }],
          actions: [
            { label: "Question detail に戻る", kind: "secondary", route: "question.detail", params: { role: "member", preset: "reopened" } },
            { label: "Knowledge detail を確認", kind: "primary", route: "knowledge.detail", params: { role: "member", preset: "formal" } }
          ],
          body: section("Derived draft", "source_question_id と best answer snapshot を起点に draft を生成する。", '<div class="card-stack">' +
            card("Source question", "Mobile refresh 後に session が切れ続ける件", "source_question_id = qst_204") +
            card("Seed body", "Best answer: refresh token rotate と logout 時 revoke の順序を見直す。", "source_type = qa_derived") +
          "</div>")
        }
      }
    },
    "knowledge.edit": {
      title: "ナレッジ編集画面",
      subtitle: "Editing a review-requested item returns it to shared.",
      signedIn: true,
      supportRoles: ["member"],
      specRefs: ["docs/spec/状態遷移仕様.md", "docs/spec/権限マトリクス.md"],
      designRefs: ["docs/design/11. Knowledge Edit Screen.md", "docs/design/DESIGN.md"],
      coverage: ["Scenario 3"],
      presets: {
        "changes-requested": {
          label: "Changes requested",
          stateBadges: [status("Changes requested", "changes")],
          summary: "差し戻し理由を editor 上部で見せ、再保存時の state rollback を明示する。",
          notices: [{ tone: "warning", title: "Rollback rule", body: "review_requested / changes_requested の本文保存時は `shared` に戻る。" }],
          actions: [
            { label: "保存して shared に戻す", kind: "primary", route: "knowledge.detail", params: { role: "member", preset: "review-requested" } }
          ],
          body:
            section("Requested changes", "差し戻し理由は body と混ぜず banner で見せる。", '<div class="notice warning"><p class="notice-title">Reviewer feedback</p><p>reopen 後の回答分離が summary から読み取りづらい。history 導線を detail 上で明示してください。</p></div>') +
            section("Editor", "作成者本人だけが本文を編集できる。", '<div class="editor-form">' +
              inputField("Title", "質問から派生した DB migration 手順") +
              textAreaField("Body", "resolved_locked と reopened answers を別セクションで説明する。") +
            "</div>")
        },
        shared: {
          label: "Shared",
          stateBadges: [status("Shared", "draft")],
          summary: "再編集後、未申請の共有状態に戻った姿。",
          notices: [{ tone: "success", title: "Ready for resubmission", body: "本文更新後は reviewer に古い申請を残さない。" }],
          actions: [
            { label: "再レビュー申請", kind: "primary", route: "knowledge.detail", params: { role: "member", preset: "review-requested" } }
          ],
          body: section("Shared after edit", "再申請前に tag / summary / links を整える。", metrics([
            { label: "Body", value: "Updated", note: "history entry created" },
            { label: "Status", value: "shared", note: "review queue から外れる" },
            { label: "Visibility", value: "workspace", note: "member can read" }
          ]))
        }
      }
    },
    "knowledge.revisions": {
      title: "ナレッジ履歴画面",
      subtitle: "Current version and revision history are separated.",
      signedIn: true,
      supportRoles: ["owner", "admin", "reviewer", "member"],
      specRefs: ["docs/spec/画面仕様書.md", "docs/spec/受け入れ基準.md"],
      designRefs: ["docs/design/12. Knowledge History Screen.md", "docs/design/README.md"],
      coverage: ["Scenario 4", "Scenario 10"],
      presets: {
        default: {
          label: "Default",
          stateBadges: [status("Revision history", "info")],
          summary: "現在版とは別 route で traceability を読む。",
          notices: [{ tone: "info", title: "Read only", body: "advanced diff ではなく、誰がいつ何を更新したかを優先する。" }],
          actions: [
            { label: "正式版へ戻る", kind: "primary", route: "knowledge.detail", params: { role: "member", preset: "formal" } }
          ],
          body:
            section("Revision timeline", "history screen は読み物ではなく traceability view。", '<div class="history-panel"><ol class="timeline"><li>v12 / 2026-04-04 18:20 / apply from edit draft / by A. Tanaka</li><li>v11 / 2026-04-03 14:20 / formalize / by R. Sato</li><li>v10 / 2026-04-02 09:42 / request_review / by S. Ito</li></ol></div>') +
            section("Selected revision", "revision detail は metadata と body snapshot を並べる。", '<div class="card-stack">' +
              card("Revision metadata", "updated_by, updated_at, source draft id, review id", "acceptance: Scenario 4") +
              card("Snapshot body", "旧正式版は knowledge_revisions に保存され、current formal と混ざらない。", "acceptance: Scenario 10") +
            "</div>")
        }
      }
    },
    "knowledge.edit_draft_create": {
      title: "正式ナレッジ編集下書き作成画面",
      subtitle: "Only the original author can open a new edit draft.",
      signedIn: true,
      supportRoles: ["member"],
      specRefs: ["docs/spec/権限マトリクス.md", "docs/spec/受け入れ基準.md"],
      designRefs: ["docs/design/13. Formal Knowledge Edit Draft Creation Screen.md", "docs/design/README.md"],
      coverage: ["Scenario 4"],
      presets: {
        ready: {
          label: "Ready",
          stateBadges: [status("Formal source", "formal"), status("New proposal", "draft")],
          summary: "formal 本文は source of truth のまま、proposal として新規 draft を作る。",
          notices: [{ tone: "info", title: "Ownership", body: "edit draft create は元作成者本人だけ。" }],
          actions: [
            { label: "Edit draft を作成", kind: "primary", route: "knowledge.edit_draft_detail", params: { role: "member", preset: "draft" } },
            { label: "Formal detail に戻る", kind: "secondary", route: "knowledge.detail", params: { role: "member", preset: "formal" } }
          ],
          body:
            section("Before creating draft", "formal content と proposal boundary を並べて確認させる。", '<div class="two-up">' +
              card("Current formal", "Auth / session / revoke design の正式版。直接編集不可。", "status = formal") +
              card("New proposal", "Mobile refresh failure handling を追加する edit draft を作る。", "write: knowledge_edit_drafts") +
            "</div>")
        },
        "existing-draft": {
          label: "Existing draft",
          stateBadges: [status("Duplicate blocked", "danger")],
          summary: "未完了 draft が既に 1 件あるため、新規作成を止める。",
          notices: [{ tone: "danger", title: "Single active draft rule", body: "未完了 edit draft は 1 件に保つ。" }],
          actions: [
            { label: "既存 draft を開く", kind: "primary", route: "knowledge.edit_draft_detail", params: { role: "member", preset: "draft" } }
          ],
          body: section("Existing draft notice", "重複 create を UI で防ぐ。", permissionBlock("Active draft already exists", "既存 draft を更新するか discard してから再作成してください。"))
        }
      }
    },
    "knowledge.edit_draft_detail": {
      title: "正式ナレッジ編集下書き詳細 / 編集画面",
      subtitle: "Proposal, review, apply, and discard live on the draft, not on the formal body.",
      signedIn: true,
      supportRoles: ["owner", "admin", "reviewer", "member"],
      specRefs: ["docs/spec/状態遷移仕様.md", "docs/spec/権限マトリクス.md"],
      designRefs: ["docs/design/14. Formal Knowledge Edit Draft Detail _ Edit Screen.md", "docs/design/DESIGN.md"],
      coverage: ["Scenario 4", "Scenario 7"],
      presets: {
        draft: {
          label: "Draft",
          stateBadges: [status("Draft", "draft"), status("Proposal", "info")],
          summary: "formal knowledge と proposal を分けたまま編集する。",
          notices: [{ tone: "info", title: "Proposal only", body: "current formal version は別画面で残し、ここは変更案だけを扱う。" }],
          actions: [
            { label: "レビュー申請", kind: "primary", route: "knowledge.edit_draft_detail", params: { role: "member", preset: "review-requested" } },
            { label: "Discard を確認", kind: "destructive", route: "knowledge.edit_draft_detail", params: { role: "member", preset: "applied" } }
          ],
          body:
            section("Draft editor", "proposal body と review note を一緒に見せる。", '<div class="editor-form">' +
              inputField("Draft title", "Refresh token fallback and logout sequencing") +
              textAreaField("Proposal body", "Mobile refresh failure 時に logout 後 revoke を再確認する steps を追加する。") +
              card("Draft visibility", "private / reviewer_shared を切り替える。", "permission: creator only") +
            "</div>")
        },
        "review-requested": {
          label: "Review requested",
          stateBadges: [status("Under review", "under-review"), status("Reviewer shared", "info")],
          summary: "review queue に並ぶ edit draft proposal。",
          notices: [{ tone: "warning", title: "Reviewer/admin/owner split", body: "review は reviewer/admin/owner、apply は admin/owner に限定する。" }],
          actions: [
            { label: "レビュー待ち一覧へ", kind: "secondary", route: "review.queue", params: { role: "reviewer" } },
            { label: "Apply 結果を見る", kind: "primary", route: "knowledge.edit_draft_detail", roles: ["owner", "admin"], params: { preset: "applied" } }
          ],
          body:
            section("Review rail", "changes requested と apply の両方を proposal 文脈で見せる。", '<div class="two-up">' +
              card("Review result", "approve / request_changes / comment", "write: knowledge_edit_draft_reviews") +
              card("Apply prerequisites", "有効 review 1 件以上、admin/owner role", "acceptance: Scenario 4") +
            "</div>") +
            section("Comments", "review comment と proposal note を detail 下部に残す。", card("Review thread", "再オープン後 answer section の見せ方を proposal に反映してください。", "changes requested example"))
        },
        applied: {
          label: "Applied",
          stateBadges: [status("Applied", "success"), status("Formal updated", "formal")],
          summary: "apply 後は formal 更新と旧正式版保存を知らせる終端状態。",
          notices: [{ tone: "success", title: "Apply result", body: "`knowledge_items` 同一 ID 更新、旧正式版は `knowledge_revisions` へ保存。" }],
          actions: [
            { label: "正式版 detail を開く", kind: "primary", route: "knowledge.detail", params: { role: "admin", preset: "formal" } },
            { label: "履歴を確認", kind: "secondary", route: "knowledge.revisions", params: { role: "admin" } }
          ],
          body: section("Applied summary", "終端状態では mutate action を残さない。", '<div class="card-stack">' +
            card("Formal updated", "knowledge_items same ID updated", "state: review_requested -> applied") +
            card("Revision saved", "旧正式版 snapshot を knowledge_revisions へ保存", "acceptance: Scenario 4") +
          "</div>")
        }
      }
    },
    "review.queue": {
      title: "レビュー待ち一覧画面",
      subtitle: "The queue list and header badge must always agree.",
      signedIn: true,
      supportRoles: ["owner", "admin", "reviewer"],
      specRefs: ["docs/spec/画面仕様書.md", "docs/spec/状態遷移仕様.md"],
      designRefs: ["docs/design/6. Review Queue Screen.md", "docs/design/README.md"],
      coverage: ["Scenario 3", "Scenario 4", "Scenario 7", "Scenario 8"],
      presets: {
        default: {
          label: "Default",
          stateBadges: [status("review_requested", "under-review"), status("Badge sync", "info")],
          summary: "knowledge と edit draft の `review_requested` を一つの triage list で見る。",
          notices: [{ tone: "info", title: "Badge parity", body: "header の review queue count と同一件数を見せる。" }],
          actions: [
            { label: "Knowledge review を開く", kind: "primary", route: "knowledge.detail", params: { role: "reviewer", preset: "review-requested" } },
            { label: "Edit draft review を開く", kind: "secondary", route: "knowledge.edit_draft_detail", params: { role: "reviewer", preset: "review-requested" } }
          ],
          body:
            section("Queue metrics", "badge に見合う triage context を数値化する。", metrics([
              { label: "Total", value: "3", note: "header badge と一致" },
              { label: "Knowledge", value: "2", note: "direct posts + qa-derived" },
              { label: "Edit draft", value: "1", note: "formal revision proposal" }
            ])) +
            section("Queue list", "対象 type を混在表示しても status と next action を読み違えないようにする。", '<div class="card-stack">' +
              card("Knowledge / レビュー差し戻し中の editor UX", "creator = S. Ito / updated 2h ago / tags: review, editor", "next: approve or request changes") +
              card("Edit draft / Refresh token fallback and logout sequencing", "creator = A. Tanaka / updated 40m ago / draft visibility: reviewer_shared", "next: review, apply by admin/owner") +
            "</div>")
        },
        empty: {
          label: "Empty",
          stateBadges: [status("No review_requested items", "muted")],
          summary: "review queue 0 件時の静かな empty state。",
          notices: [{ tone: "success", title: "No work in queue", body: "notification の代わりに badge 0 で知らせる。" }],
          actions: [
            { label: "Knowledge list へ戻る", kind: "secondary", route: "knowledge.list", params: { role: "reviewer" } }
          ],
          body: section("Empty queue", "queue 0 件を status-driven に伝える。", emptyBlock("No items waiting for review", "新しい review request が入るまで knowledge browse に戻ってください。"))
        }
      }
    },
    "question.list": {
      title: "質問一覧画面",
      subtitle: "Questions are lighter-weight than knowledge but still searchable.",
      signedIn: true,
      supportRoles: ["owner", "admin", "reviewer", "member"],
      specRefs: ["docs/spec/画面仕様書.md", "docs/spec/受け入れ基準.md"],
      designRefs: ["docs/design/15. Question List Screen.md", "docs/design/DESIGN.md"],
      coverage: ["Scenario 5", "Scenario 6"],
      presets: {
        default: {
          label: "Default",
          stateBadges: [status("Open", "info"), status("Resolved", "success")],
          summary: "Q&A は secondary domain だが search/filter/derived knowledge 導線は明示する。",
          notices: [{ tone: "info", title: "Knowledge is still primary", body: "sidebar では Knowledge を先、Questions を後に置く。" }],
          actions: [
            { label: "質問を投稿", kind: "primary", route: "question.create", params: { role: "member" } },
            { label: "質問詳細を開く", kind: "secondary", route: "question.detail", params: { role: "member", preset: "open" } }
          ],
          body:
            section("Question cards", "本文は出しすぎず、status と未解決情報を優先する。", '<div class="card-stack">' +
              card("Mobile refresh 後に session が切れ続ける", badges([status("Open", "info"), status("2 answers", "draft")]) + '<p class="card-copy">logout 後 revoke の順序と token rotate の失敗条件を確認したい。</p><p class="card-meta">created by K. Mori / tags: auth, mobile</p>', "can derive knowledge later") +
              card("resolved_locked の answer snapshot 管理", badges([status("Resolved", "success"), status("Best answer selected", "formal")]) + '<p class="card-copy">reopen 後の answer をどう分けるべきか。</p><p class="card-meta">accepted answer snapshot available</p>', "acceptance: Scenario 5") +
            "</div>") +
            section("List states", "questions でも empty / error / loading を持つ。", '<div class="screen-grid">' +
              loadingBlock() +
              emptyBlock("No questions", "質問がまだない場合は create を案内する。") +
              errorBlock("Question fetch failed", "retry と bookmark fallback を分けて案内する。") +
            "</div>")
        },
        empty: {
          label: "Empty",
          stateBadges: [status("Empty", "muted")],
          summary: "質問 0 件時の empty state。",
          notices: [{ tone: "warning", title: "Suggest one next action", body: "Knowledge browse か question create のどちらか一つを促す。" }],
          actions: [{ label: "最初の質問を作成", kind: "primary", route: "question.create", params: { role: "member" } }],
          body: section("Empty state", "質問がないことを責めずに、次の行動を一つ出す。", emptyBlock("No questions yet", "まずは unresolved issue を一件投稿してください。"))
        }
      }
    },
    "question.detail": {
      title: "質問詳細画面",
      subtitle: "Resolved snapshot and reopened follow-up answers are visibly separated.",
      signedIn: true,
      supportRoles: ["owner", "admin", "reviewer", "member"],
      specRefs: ["docs/spec/状態遷移仕様.md", "docs/spec/受け入れ基準.md", "docs/spec/画面仕様書.md"],
      designRefs: ["docs/design/7. Question Detail Screen.md", "docs/design/DESIGN.md"],
      coverage: ["Scenario 5", "Scenario 6", "Scenario 10"],
      presets: {
        open: {
          label: "Open",
          stateBadges: [status("Open", "info"), status("Can answer", "success")],
          summary: "質問本文、answer list、comment、links、knowledge 化導線を一画面で扱う。",
          notices: [{ tone: "info", title: "No comment UI on answers", body: "comment は question scope のみ。answer ごとの comment UI は出さない。" }],
          actions: [
            { label: "回答を追加", kind: "primary", route: "question.detail", params: { role: "member", preset: "resolved" } },
            { label: "質問を編集", kind: "secondary", route: "question.edit", params: { role: "member", preset: "default" } },
            { label: "Knowledge 化 path を見る", kind: "tertiary", route: "knowledge.create", params: { role: "member", preset: "qa-derived" } }
          ],
          body:
            section("Question and answers", "question detail は読む画面だが、knowledge 化導線を見失わせない。", '<div class="card-stack">' +
              card("Mobile refresh 後に session が切れ続ける", badges([status("Open", "info"), status("Bookmark", "qa")]) + '<p class="card-copy">Google login は通るが、mobile refresh で current session が invalid になる。</p><p class="card-meta">creator: K. Mori / tags: auth, mobile</p>', "derived knowledge: 1 draft") +
              card("Current answers", bulletList(["Answer 1: rotate 実装の順序を見直す", "Answer 2: logout で current refresh token revoke を先に行う"]), "answer create / edit / delete are visible to the answer author only") +
            "</div>")
        },
        resolved: {
          label: "Resolved",
          stateBadges: [status("Resolved", "success"), status("Snapshot fixed", "formal")],
          summary: "`open -> resolved_locked` 後の fixed answer snapshot。",
          notices: [{ tone: "success", title: "Snapshot preserved", body: "resolved 時点の best answer と他回答を固定し、reopen 後回答と混同させない。" }],
          actions: [
            { label: "Reopen 状態を見る", kind: "primary", route: "question.detail", params: { role: "member", preset: "reopened" } },
            { label: "Knowledge 化を確認", kind: "secondary", route: "knowledge.create", params: { role: "member", preset: "qa-derived" } }
          ],
          body:
            section("Resolved snapshot", "best answer とその時点の回答群を安定したセクションに分離する。", '<div class="two-up">' +
              card("Best answer", "refresh token rotate failure 時に logout revoke の順序を見直す。", "accepted answer snapshot saved") +
              card("Other answers at resolution", "monitoring alert の閾値調整、device-specific retry note", "frozen with resolved state") +
            "</div>") +
            section("History entry points", "履歴は別 screen を作らず同画面内 panel で開く。", '<div class="history-panel"><strong>History side panel</strong><ol class="timeline"><li>question revision v5 / updated by K. Mori</li><li>answer revision v3 / updated by R. Sato</li></ol></div>')
        },
        reopened: {
          label: "Reopened",
          stateBadges: [status("Reopened", "changes"), status("Knowledge draft created", "qa")],
          summary: "resolved_locked 後に reopen した follow-up phase。",
          notices: [{ tone: "warning", title: "Resolved snapshot remains frozen", body: "reopen 後の回答は follow-up セクションにのみ追加する。" }],
          actions: [
            { label: "Knowledge draft を開く", kind: "primary", route: "knowledge.create", params: { role: "member", preset: "qa-derived" } },
            { label: "履歴 panel を見る", kind: "secondary", route: "question.detail", params: { role: "member", preset: "history" } }
          ],
          body:
            section("Answer separation", "resolved snapshot と reopened answers を視覚的に二分する。", '<div class="screen-grid">' +
              card("Resolved snapshot", "Best answer + frozen answers", "top section / green emphasis") +
              card("Follow-up answers", "API retry fallback, iOS-only reproduction case", "later additions / amber emphasis") +
            "</div>") +
            section("Knowledge derivation", "best answer があれば draft seed に反映する。", card("Derived knowledge", "Refresh token fallback and logout sequencing", "source_type = qa_derived / source_question_id set"))
        },
        history: {
          label: "History panel",
          stateBadges: [status("History side panel", "info")],
          summary: "question / answer 履歴を同一画面内 panel で確認する Scenario 10 用 preset。",
          notices: [{ tone: "info", title: "No separate history route", body: "`question.detail` の中で panel を開く。" }],
          actions: [
            { label: "Question open state へ戻る", kind: "secondary", route: "question.detail", params: { role: "member", preset: "open" } }
          ],
          body:
            section("Inline history panel", "GET revisions API の存在を UI で trace する。", '<div class="two-up">' +
              card("Question revisions", "v5 typo fix / v4 add logs / v3 accepted answer note", "GET /api/questions/{questionId}/revisions") +
              card("Answer revisions", "v3 add revoke step / v2 clarify mobile-only condition", "GET /api/answers/{answerId}/revisions") +
            "</div>")
        }
      }
    },
    "question.create": {
      title: "質問作成画面",
      subtitle: "Lightweight posting with the same editorial discipline.",
      signedIn: true,
      supportRoles: ["owner", "admin", "reviewer", "member"],
      specRefs: ["docs/spec/画面仕様書.md", "docs/spec/受け入れ基準.md"],
      designRefs: ["docs/design/16. Question Create Screen.md", "docs/design/DESIGN.md"],
      coverage: ["Scenario 5"],
      presets: {
        default: {
          label: "Default",
          stateBadges: [status("Open", "info")],
          summary: "質問投稿は lightweight だが tag と body は knowledge 化を想定して書かせる。",
          notices: [{ tone: "info", title: "No notification on create", body: "作成直後は通知を飛ばさない。" }],
          actions: [
            { label: "質問を投稿", kind: "primary", route: "question.detail", params: { role: "member", preset: "open" } }
          ],
          body:
            section("Question editor", "question は knowledge より軽く、しかし structure は保つ。", '<div class="editor-form">' +
              inputField("Title", "Mobile refresh 後に session が切れ続ける") +
              inputField("Tags", "auth, mobile, session") +
              textAreaField("Body", "Google login は通るが、iOS で refresh 後に current session が invalid になる。再現手順を知りたい。") +
            "</div>")
        }
      }
    },
    "question.edit": {
      title: "質問編集画面",
      subtitle: "Open questions only.",
      signedIn: true,
      supportRoles: ["member"],
      specRefs: ["docs/spec/権限マトリクス.md", "docs/spec/状態遷移仕様.md"],
      designRefs: ["docs/design/17. Question Edit Screen.md", "docs/design/README.md"],
      coverage: ["Scenario 5"],
      presets: {
        default: {
          label: "Editable",
          stateBadges: [status("Open", "info")],
          summary: "質問投稿者本人だけが open 状態で編集できる。",
          notices: [{ tone: "info", title: "Question body editing", body: "resolved_locked になると編集 UI を消す。" }],
          actions: [
            { label: "更新を保存", kind: "primary", route: "question.detail", params: { role: "member", preset: "open" } }
          ],
          body:
            section("Question editor", "edit でも create と同じ editorial language を使う。", '<div class="editor-form">' +
              inputField("Title", "Mobile refresh 後に session が切れ続ける") +
              textAreaField("Body", "再現条件として logout を跨ぐケースも追加したい。") +
            "</div>")
        },
        locked: {
          label: "Locked",
          stateBadges: [status("resolved_locked", "success")],
          summary: "resolved_locked では edit UI を消す。",
          notices: [{ tone: "danger", title: "Editing blocked", body: "`resolved_locked` は質問本文を固定する。" }],
          actions: [
            { label: "Question detail を確認", kind: "secondary", route: "question.detail", params: { role: "member", preset: "resolved" } }
          ],
          body: section("Permission denied", "編集不能な理由を短く説明する。", permissionBlock("This question is locked", "質問本文は resolved_locked では編集できません。reopen 後も過去 snapshot は固定のままです。"))
        }
      }
    },
    "notification.list": {
      title: "通知一覧画面",
      subtitle: "Unread, read-all, and no extra side effects on repeat.",
      signedIn: true,
      supportRoles: ["owner", "admin", "reviewer", "member"],
      specRefs: ["docs/spec/画面APIデータ対応表.md", "docs/spec/受け入れ基準.md"],
      designRefs: ["docs/design/18. Notifications Screen.md", "docs/design/README.md"],
      coverage: ["Scenario 7", "Scenario 8", "Scenario 10"],
      presets: {
        default: {
          label: "Unread mix",
          stateBadges: [status("Unread", "info"), status("Read", "draft")],
          summary: "通知種別と既読状態を一覧比較し、content deep link を持たせる。",
          notices: [{ tone: "info", title: "Dedupe rule", body: "既読再実行で余分な副作用を発生させない。" }],
          actions: [
            { label: "すべて既読にする", kind: "primary", route: "notification.list", params: { role: "member", preset: "read-all" } },
            { label: "関連 Knowledge を開く", kind: "secondary", route: "knowledge.detail", params: { role: "member", preset: "formal" } }
          ],
          body:
            section("Notification feed", "type と unread を明確にし、行単位で destination を持たせる。", '<div class="card-stack">' +
              card("knowledge_changes_requested", badges([status("Unread", "info")]) + '<p class="card-copy">レビュー差し戻し中の editor UX に reviewer から comment が追加された。</p>', "destination: knowledge.detail") +
              card("join_request_submitted", badges([status("Unread", "info")]) + '<p class="card-copy">join request applicant から参加申請が届いた。</p>', "destination: admin.members") +
              card("question_reopened", badges([status("Read", "draft")]) + '<p class="card-copy">resolved question が reopen された。</p>', "destination: question.detail") +
            "</div>")
        },
        "read-all": {
          label: "Read all",
          stateBadges: [status("All read", "success")],
          summary: "read-all 後の落ち着いた状態。",
          notices: [{ tone: "success", title: "Idempotent read", body: "再度 read-all しても余分な副作用や badge 差分を出さない。" }],
          actions: [
            { label: "通知一覧を再確認", kind: "secondary", route: "notification.list", params: { role: "member", preset: "default" } }
          ],
          body: section("Read all result", "既読後は deep link だけ残し、バッジは 0 になる。", metrics([
            { label: "Unread", value: "0", note: "header badge cleared" },
            { label: "Reviewed items", value: "7", note: "list remains accessible" },
            { label: "Repeat side effect", value: "0", note: "Scenario 10" }
          ]))
        }
      }
    },
    "bookmark.list": {
      title: "ブックマーク一覧画面",
      subtitle: "Knowledge and questions in one saved list.",
      signedIn: true,
      supportRoles: ["owner", "admin", "reviewer", "member"],
      specRefs: ["docs/spec/画面APIデータ対応表.md", "docs/spec/受け入れ基準.md"],
      designRefs: ["docs/design/19. Bookmarks Screen.md", "docs/design/README.md"],
      coverage: ["Scenario 2", "Scenario 10"],
      presets: {
        default: {
          label: "Saved items",
          stateBadges: [status("Knowledge", "formal"), status("Question", "qa")],
          summary: "bookmark content type を跨いで保存済み item を一一覧にする。",
          notices: [{ tone: "info", title: "Bookmark is idempotent", body: "同一対象に再実行しても重複作成しない。" }],
          actions: [
            { label: "Knowledge detail を開く", kind: "primary", route: "knowledge.detail", params: { role: "member", preset: "formal" } },
            { label: "Question detail を開く", kind: "secondary", route: "question.detail", params: { role: "member", preset: "open" } }
          ],
          body:
            section("Bookmark items", "preview created_by を含めて軽量に表示する。", '<div class="card-stack">' +
              card("認証 refresh token の rotation 方針", badges([status("Knowledge", "formal")]) + '<p class="card-copy">created_by: S. Ito / updated 2h ago</p>', "bookmark content type = knowledge") +
              card("Mobile refresh 後に session が切れ続ける", badges([status("Question", "qa")]) + '<p class="card-copy">created_by: K. Mori / latest answer 40m ago</p>', "bookmark content type = question") +
            "</div>")
        },
        empty: {
          label: "Empty",
          stateBadges: [status("Empty", "muted")],
          summary: "bookmark 0 件時は one-step next action を出す。",
          notices: [{ tone: "warning", title: "No saved items", body: "一覧で bookmark toggle を案内し、ここでは create 導線を押し出しすぎない。" }],
          actions: [
            { label: "Knowledge list へ戻る", kind: "primary", route: "knowledge.list", params: { role: "member" } }
          ],
          body: section("Empty state", "bookmark は browsing の補助機能として説明する。", emptyBlock("No bookmarks yet", "一覧画面の bookmark action から保存してください。"))
        }
      }
    },
    "admin.members": {
      title: "メンバー管理画面",
      subtitle: "Members, invitations, and join requests in a quiet table-based admin surface.",
      signedIn: true,
      supportRoles: ["owner", "admin"],
      specRefs: ["docs/spec/画面APIデータ対応表.md", "docs/spec/権限マトリクス.md"],
      designRefs: ["docs/design/8. Member Management Screen.md", "docs/design/0-2. Admin Table Foundation.md"],
      coverage: ["Scenario 2", "Scenario 7", "Scenario 9", "Scenario 10"],
      presets: {
        members: {
          label: "Members",
          stateBadges: [status("Members", "info"), status("Operational table", "draft")],
          summary: "active member の role / state / join date / actions を table で管理する。",
          notices: [{ tone: "info", title: "Operational clarity", body: "role change、remove、owner transfer は row action に限定する。" }],
          actions: [
            { label: "招待一覧へ", kind: "secondary", route: "admin.members", params: { role: "owner", preset: "invitations" } },
            { label: "Join requests へ", kind: "secondary", route: "admin.members", params: { role: "admin", preset: "join-requests" } }
          ],
          body:
            section("Members table", "admin screens は card より table を優先する。", table(
              ["Name", "Email", "Role", "Membership", "Join date", "Actions"],
              [
                { cells: ["S. Ito", "s.ito@example.co.jp", status("owner", "formal"), "active", "2026-03-21", "owner transfer / remove"] },
                { cells: ["A. Tanaka", "a.tanaka@example.co.jp", status("admin", "info"), "active", "2026-03-24", "role change / remove"] },
                { cells: ["R. Sato", "r.sato@example.co.jp", status("reviewer", "under-review"), "active", "2026-03-29", "revoke reviewer"] }
              ]
            )) +
            section("Permission notes", "owner と admin の差分を table 外で明示する。", '<div class="two-up">' +
              card("Owner only", "owner transfer, admin promotion", "owner cannot edit another user's body") +
              card("Admin allowed", "invite, approve join request, formalize, comment hide", "cannot transfer owner") +
            "</div>")
        },
        invitations: {
          label: "Invitations",
          stateBadges: [status("Pending invitation", "under-review"), status("Resend safety", "warning")],
          summary: "招待の作成、再送、revoked old pending の確認。",
          notices: [{ tone: "warning", title: "Single active pending", body: "再送時は旧 pending を revoked にし、新 token / expiry を発行する。" }],
          actions: [
            { label: "招待受諾 preview を見る", kind: "primary", route: "workspace.invitation_accept", params: { actor: "invitation target user", preset: "preview" } },
            { label: "Members view に戻る", kind: "secondary", route: "admin.members", params: { role: "owner", preset: "members" } }
          ],
          body:
            section("Invitations table", "preview metadata と resend safety を運用者に見せる。", table(
              ["Email", "Role", "Status", "Expiry", "Updated", "Actions"],
              [
                { cells: ["new.member@example.co.jp", "member", status("pending", "under-review"), "2026-04-07 10:00", "sent 5m ago", "revoke / resend"] },
                { cells: ["old.member@example.co.jp", "member", status("revoked", "danger"), "2026-04-05 08:00", "replaced by resend", "view history"], className: "archived-row" }
              ]
            )) +
            section("Scenario 2 notes", "preview で見せる 5 要素と active pending 1 件 rule を固定する。", bulletList([
              "workspace 名、招待 email、role、expiry、status を preview で表示",
              "resend 後は旧 pending が revoked",
              "accepted 後は workspace member 作成"
            ]))
        },
        "join-requests": {
          label: "Join requests",
          stateBadges: [status("Pending join request", "under-review"), status("Comment required", "info")],
          summary: "join request comment、approve / reject、cancel trace を table で確認する。",
          notices: [{ tone: "info", title: "Scenario 9", body: "join request comment は `workspace_join_requests.request_comment` に保存される。" }],
          actions: [
            { label: "Join request applicant view", kind: "secondary", route: "workspace.join_request", params: { actor: "join request applicant", preset: "pending" } },
            { label: "Members view に戻る", kind: "secondary", route: "admin.members", params: { role: "admin", preset: "members" } }
          ],
          body:
            section("Join requests table", "申請コメントと承認 action を一目で比較する。", table(
              ["Applicant", "Comment", "Status", "Submitted", "Action"],
              [
                { cells: ["K. Mori", "Knowledge review と tags governance を担当したい。", status("pending", "under-review"), "2026-04-05 14:12", "approve / reject"] },
                { cells: ["N. Yamada", "監査対応のため閲覧権限が必要。", status("cancelled", "danger"), "2026-04-04 09:00", "view log"], className: "archived-row" }
              ]
            )) +
            section("Admin states", "table でも loading / empty / error / permission を持つ。", '<div class="screen-grid">' +
              loadingBlock() +
              emptyBlock("No join requests", "pending request がない状態。") +
              permissionBlock("Admin only", "member には管理画面を見せない。") +
            "</div>")
        }
      }
    },
    "admin.tags": {
      title: "タグ管理画面",
      subtitle: "Rename, merge, and archive with operational safety.",
      signedIn: true,
      supportRoles: ["owner", "admin"],
      specRefs: ["docs/spec/画面APIデータ対応表.md", "docs/spec/受け入れ基準.md"],
      designRefs: ["docs/design/20. Tag Management Screen.md", "docs/design/0-2. Admin Table Foundation.md"],
      coverage: ["Scenario 7"],
      presets: {
        default: {
          label: "Active tags",
          stateBadges: [status("Active", "info"), status("Usage count", "draft")],
          summary: "status、usage_count、normalized_name、sample contents を table で追う。",
          notices: [{ tone: "info", title: "Governance surface", body: "tag merge / rename / archive は admin table で quiet に扱う。" }],
          actions: [
            { label: "Merge preset を見る", kind: "primary", route: "admin.tags", params: { role: "admin", preset: "merge" } },
            { label: "Knowledge search result を見る", kind: "secondary", route: "knowledge.list", params: { role: "reviewer", preset: "default" } }
          ],
          body:
            section("Tags table", "sample contents と normalized name を同一 row に置く。", table(
              ["Tag", "Normalized", "Status", "Usage", "Creator", "Updated", "Actions"],
              [
                { cells: ["refresh-token", "refresh-token", status("active", "info"), "18", "A. Tanaka", "2026-04-04", "rename / merge / archive"] },
                { cells: ["session-revoke", "session-revoke", status("active", "info"), "9", "S. Ito", "2026-04-03", "rename / merge / archive"] }
              ]
            )) +
            section("Sample contents", "tag governance の影響先を sample で示す。", '<div class="two-up">' +
              card("Knowledge samples", "認証 refresh token の rotation 方針 / Logout session revoke checklist", "knowledge_items") +
              card("Question samples", "Mobile refresh 後に session が切れ続ける", "questions") +
            "</div>")
        },
        merge: {
          label: "Merge",
          stateBadges: [status("Merged", "warning"), status("Search fallback", "info")],
          summary: "old tag を merged にし、existing content を target tag に寄せる。",
          notices: [{ tone: "warning", title: "Scenario 7", body: "old tag 検索でも target 結果が返る前提を明示する。" }],
          actions: [
            { label: "Notification feed を見る", kind: "secondary", route: "notification.list", params: { role: "member", preset: "default" } },
            { label: "Tag active table に戻る", kind: "primary", route: "admin.tags", params: { role: "admin", preset: "default" } }
          ],
          body:
            section("Merge result", "merge 前後の state と search behavior を並べる。", table(
              ["Tag", "Status", "Merged into", "Search behavior", "Actions"],
              [
                { cells: ["refresh-token-fallback", status("merged", "changes"), "refresh-token", "old tag search resolves to target results", "view impact"], className: "archived-row" },
                { cells: ["refresh-token", status("active", "info"), "-", "target tag", "rename / archive"] }
              ]
            )) +
            section("Notifications", "my content への tag changed notification を忘れない。", card("tag_changed_on_my_content", "merge 対象 content の作成者 / 関連者へ通知する。", "write: notifications"))
        },
        archived: {
          label: "Archived",
          stateBadges: [status("Archived", "archived")],
          summary: "archived tag を muted row として示す。",
          notices: [{ tone: "danger", title: "Archive safety", body: "destructive action は confirmation 前提で quiet に分離する。" }],
          actions: [
            { label: "Active tags に戻る", kind: "secondary", route: "admin.tags", params: { role: "admin", preset: "default" } }
          ],
          body: section("Archived rows", "inactive row は色調で落とし、通常 action を減らす。", table(
            ["Tag", "Status", "Usage", "Updated", "Action"],
            [{ cells: ["legacy-refresh", status("archived", "archived"), "0", "2026-03-18", "view history"], className: "archived-row" }]
          ))
        }
      }
    }
  };

  window.DESIGN_PROTO_PAGES = pages;
})();
