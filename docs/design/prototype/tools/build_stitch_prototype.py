from __future__ import annotations

import base64
import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = ROOT / "assets"


ROUTES = [
    {
        "id": "auth.login",
        "slug": "auth-login",
        "title": "ログイン",
        "group": "認証・参加",
        "template": "gateway",
        "slice": "Slice 1",
        "rawPath": "../Google Stitch/1. Login Screen/code.html",
        "screenLabel": "1. Login Screen",
        "fixtures": ["unaffiliated-user"],
        "defaultFixture": "unaffiliated-user",
        "states": ["default", "loading", "error"],
        "defaultState": "default",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "workspace.resolution",
        "slug": "workspace-resolution",
        "title": "ワークスペース存在判定 / 参加導線",
        "group": "認証・参加",
        "template": "gateway",
        "slice": "Slice 1",
        "rawPath": "../Google Stitch/2. Workspace Join Gateway Screen/code.html",
        "screenLabel": "2. Workspace Join Gateway Screen",
        "fixtures": ["unaffiliated-user"],
        "defaultFixture": "unaffiliated-user",
        "states": ["create-path", "pending-join", "active-member", "error"],
        "defaultState": "pending-join",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "workspace.invitation_accept",
        "slug": "workspace-invitation-accept",
        "title": "招待受諾",
        "group": "認証・参加",
        "template": "gateway",
        "slice": "Slice 1",
        "rawPath": "../Google Stitch/9. Invitation Acceptance Screen/code.html",
        "screenLabel": "9. Invitation Acceptance Screen",
        "fixtures": ["invitation-target-user"],
        "defaultFixture": "invitation-target-user",
        "states": ["pending", "accepted", "expired", "error"],
        "defaultState": "pending",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "workspace.join_request",
        "slug": "workspace-join-request",
        "title": "参加申請",
        "group": "認証・参加",
        "template": "gateway",
        "slice": "Slice 1",
        "rawPath": "../Google Stitch/10. Join Request Screen/code.html",
        "screenLabel": "10. Join Request Screen",
        "fixtures": ["join-request-applicant"],
        "defaultFixture": "join-request-applicant",
        "states": ["default", "pending", "cancelled", "error"],
        "defaultState": "default",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "knowledge.list",
        "slug": "knowledge-list",
        "title": "ナレッジ一覧",
        "group": "ナレッジ",
        "template": "list",
        "slice": "Slice 2",
        "rawPath": "../Google Stitch/3. Knowledge List Screen/code.html",
        "screenLabel": "3. Knowledge List Screen",
        "fixtures": ["owner", "admin", "reviewer", "member"],
        "defaultFixture": "member",
        "states": ["default", "loading", "empty", "error"],
        "defaultState": "default",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "knowledge.detail",
        "slug": "knowledge-detail",
        "title": "ナレッジ詳細",
        "group": "ナレッジ",
        "template": "detail",
        "slice": "Slice 2",
        "rawPath": "../Google Stitch/4. Knowledge Detail Screen/code.html",
        "screenLabel": "4. Knowledge Detail Screen",
        "fixtures": ["owner", "admin", "reviewer", "member"],
        "defaultFixture": "member",
        "states": ["formal", "review-requested", "changes-requested", "archived", "loading", "error", "permission-denied"],
        "defaultState": "formal",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "knowledge.create",
        "slug": "knowledge-create",
        "title": "ナレッジ作成",
        "group": "ナレッジ",
        "template": "editor",
        "slice": "Slice 3",
        "rawPath": "../Google Stitch/5. Knowledge Create Screen/code.html",
        "screenLabel": "5. Knowledge Create Screen",
        "fixtures": ["member"],
        "defaultFixture": "member",
        "states": ["draft", "review-requested", "qa-derived", "error", "permission-denied"],
        "defaultState": "draft",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "knowledge.edit",
        "slug": "knowledge-edit",
        "title": "ナレッジ編集",
        "group": "ナレッジ",
        "template": "editor",
        "slice": "Slice 3",
        "rawPath": "../Google Stitch/11. Knowledge Edit Screen/code.html",
        "screenLabel": "11. Knowledge Edit Screen",
        "fixtures": ["member"],
        "defaultFixture": "member",
        "states": ["draft", "changes-requested", "loading", "error", "permission-denied"],
        "defaultState": "draft",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "knowledge.revisions",
        "slug": "knowledge-revisions",
        "title": "ナレッジ履歴",
        "group": "ナレッジ",
        "template": "history",
        "slice": "Slice 4 / 7",
        "rawPath": "../Google Stitch/12. Knowledge History Screen/code.html",
        "screenLabel": "12. Knowledge History Screen",
        "fixtures": ["owner", "admin", "reviewer", "member"],
        "defaultFixture": "member",
        "states": ["default", "loading", "error"],
        "defaultState": "default",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "knowledge.edit_draft_create",
        "slug": "knowledge-edit-draft-create",
        "title": "正式ナレッジ編集下書き作成",
        "group": "ナレッジ",
        "template": "editor",
        "slice": "Slice 4",
        "rawPath": "../Google Stitch/13. Formal Knowledge Edit Draft Creation Screen/code.html",
        "screenLabel": "13. Formal Knowledge Edit Draft Creation Screen",
        "fixtures": ["member"],
        "defaultFixture": "member",
        "states": ["default", "duplicate-blocked", "error", "permission-denied"],
        "defaultState": "default",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "knowledge.edit_draft_detail",
        "slug": "knowledge-edit-draft-detail",
        "title": "正式ナレッジ編集下書き詳細 / 編集",
        "group": "ナレッジ",
        "template": "editor",
        "slice": "Slice 4",
        "rawPath": "../Google Stitch/14. Formal Knowledge Edit Draft Detail _ Edit Screen/code.html",
        "screenLabel": "14. Formal Knowledge Edit Draft Detail _ Edit Screen",
        "fixtures": ["owner", "admin", "reviewer", "member"],
        "defaultFixture": "member",
        "states": ["draft", "review-requested", "applied", "discarded", "error", "permission-denied"],
        "defaultState": "draft",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "review.queue",
        "slug": "review-queue",
        "title": "レビュー待ち一覧",
        "group": "レビュー",
        "template": "list",
        "slice": "Slice 3",
        "rawPath": "../Google Stitch/6. Review Queue Screen/code.html",
        "screenLabel": "6. Review Queue Screen",
        "fixtures": ["owner", "admin", "reviewer"],
        "defaultFixture": "reviewer",
        "states": ["default", "loading", "empty", "error", "permission-denied"],
        "defaultState": "default",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "question.list",
        "slug": "question-list",
        "title": "質問一覧",
        "group": "Q&A",
        "template": "list",
        "slice": "Slice 5",
        "rawPath": "../Google Stitch/15. Question List Screen/code.html",
        "screenLabel": "15. Question List Screen",
        "fixtures": ["owner", "admin", "reviewer", "member"],
        "defaultFixture": "member",
        "states": ["open", "loading", "empty", "error"],
        "defaultState": "open",
        "tabs": ["all", "open", "resolved", "archived"],
        "defaultTab": "all",
        "modals": [],
    },
    {
        "id": "question.detail",
        "slug": "question-detail",
        "title": "質問詳細",
        "group": "Q&A",
        "template": "detail",
        "slice": "Slice 5",
        "rawPath": "../Google Stitch/7. Question Detail Screen/code.html",
        "screenLabel": "7. Question Detail Screen",
        "fixtures": ["owner", "admin", "reviewer", "member"],
        "defaultFixture": "member",
        "states": ["resolved", "open", "reopened", "archived", "loading", "error", "permission-denied"],
        "defaultState": "resolved",
        "tabs": [],
        "defaultTab": "",
        "modals": ["history"],
    },
    {
        "id": "question.create",
        "slug": "question-create",
        "title": "質問作成",
        "group": "Q&A",
        "template": "editor",
        "slice": "Slice 5",
        "rawPath": "../Google Stitch/16. Question Create Screen/code.html",
        "screenLabel": "16. Question Create Screen",
        "fixtures": ["member"],
        "defaultFixture": "member",
        "states": ["default", "error", "permission-denied"],
        "defaultState": "default",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "question.edit",
        "slug": "question-edit",
        "title": "質問編集",
        "group": "Q&A",
        "template": "editor",
        "slice": "Slice 5",
        "rawPath": "../Google Stitch/17. Question Edit Screen/code.html",
        "screenLabel": "17. Question Edit Screen",
        "fixtures": ["member"],
        "defaultFixture": "member",
        "states": ["default", "locked", "error", "permission-denied"],
        "defaultState": "default",
        "tabs": [],
        "defaultTab": "",
        "modals": [],
    },
    {
        "id": "notification.list",
        "slug": "notification-list",
        "title": "通知一覧",
        "group": "個人機能",
        "template": "list",
        "slice": "Slice 6",
        "rawPath": "../Google Stitch/18. Notifications Screen/code.html",
        "screenLabel": "18. Notifications Screen",
        "fixtures": ["owner", "admin", "reviewer", "member"],
        "defaultFixture": "member",
        "states": ["default", "loading", "empty", "error", "read-all"],
        "defaultState": "default",
        "tabs": ["all", "unread"],
        "defaultTab": "all",
        "modals": [],
    },
    {
        "id": "bookmark.list",
        "slug": "bookmark-list",
        "title": "ブックマーク一覧",
        "group": "個人機能",
        "template": "list",
        "slice": "Slice 2 / 6",
        "rawPath": "../Google Stitch/19. Bookmarks Screen/code.html",
        "screenLabel": "19. Bookmarks Screen",
        "fixtures": ["owner", "admin", "reviewer", "member"],
        "defaultFixture": "member",
        "states": ["default", "loading", "empty", "error"],
        "defaultState": "default",
        "tabs": ["all", "knowledge", "question"],
        "defaultTab": "all",
        "modals": [],
    },
    {
        "id": "admin.members",
        "slug": "admin-members",
        "title": "メンバー管理",
        "group": "管理",
        "template": "admin-table",
        "slice": "Slice 7",
        "rawPath": "../Google Stitch/8. Member Management Screen/code.html",
        "screenLabel": "8. Member Management Screen",
        "fixtures": ["owner", "admin"],
        "defaultFixture": "owner",
        "states": ["default", "loading", "error", "permission-denied"],
        "defaultState": "default",
        "tabs": ["members", "invitations", "join-requests"],
        "defaultTab": "members",
        "modals": [],
    },
    {
        "id": "admin.tags",
        "slug": "admin-tags",
        "title": "タグ管理",
        "group": "管理",
        "template": "admin-table",
        "slice": "Slice 7",
        "rawPath": "../Google Stitch/20. Tag Management Screen/code.html",
        "screenLabel": "20. Tag Management Screen",
        "fixtures": ["owner", "admin"],
        "defaultFixture": "admin",
        "states": ["default", "loading", "error", "permission-denied", "merge"],
        "defaultState": "default",
        "tabs": ["active", "merged", "archived"],
        "defaultTab": "active",
        "modals": [],
    },
]


SCENARIOS = [
    {
        "id": "scenario-1",
        "title": "Scenario 1 初回ログインから workspace 作成",
        "description": "ログインから workspace resolution を経由してナレッジ一覧へ入る。",
        "route": "auth.login",
        "params": {},
        "path": ["auth.login", "workspace.resolution", "knowledge.list"],
    },
    {
        "id": "scenario-2",
        "title": "Scenario 2 招待、再送、受諾",
        "description": "管理画面から招待受諾へ遷移し、受諾後にナレッジ一覧へ入る。",
        "route": "admin.members",
        "params": {"fixture": "owner", "tab": "invitations"},
        "path": ["admin.members", "workspace.invitation_accept", "knowledge.list"],
    },
    {
        "id": "scenario-3",
        "title": "Scenario 3 直接投稿 knowledge の review / formalize",
        "description": "ナレッジ作成から review queue を経て formal detail に戻る。",
        "route": "knowledge.create",
        "params": {"fixture": "member"},
        "path": ["knowledge.create", "knowledge.detail", "review.queue", "knowledge.detail"],
    },
    {
        "id": "scenario-4",
        "title": "Scenario 4 formal knowledge の edit draft 作成から apply",
        "description": "formal knowledge detail から edit draft create/detail を辿る。",
        "route": "knowledge.detail",
        "params": {"fixture": "member", "state": "formal"},
        "path": ["knowledge.detail", "knowledge.edit_draft_create", "knowledge.edit_draft_detail", "review.queue", "knowledge.detail"],
    },
    {
        "id": "scenario-5",
        "title": "Scenario 5 質問、回答、ベストアンサー、再オープン",
        "description": "質問作成から detail の resolved / reopened state を確認する。",
        "route": "question.create",
        "params": {"fixture": "member"},
        "path": ["question.create", "question.detail", "question.detail"],
    },
    {
        "id": "scenario-6",
        "title": "Scenario 6 Q&A から knowledge 作成",
        "description": "question detail から QA-derived knowledge create に入る。",
        "route": "question.detail",
        "params": {"fixture": "member", "state": "reopened"},
        "path": ["question.detail", "knowledge.create", "knowledge.detail"],
    },
    {
        "id": "scenario-7",
        "title": "Scenario 7 タグ統合、検索、通知、レビュー待ちバッジ",
        "description": "タグ管理、ナレッジ検索、通知、review badge を横断確認する。",
        "route": "admin.tags",
        "params": {"fixture": "admin", "state": "merge"},
        "path": ["admin.tags", "knowledge.list", "notification.list", "review.queue"],
    },
    {
        "id": "scenario-8",
        "title": "Scenario 8 login / refresh / logout と共通ヘッダー",
        "description": "ログインから共通ヘッダーを持つ画面へ入り、通知と review badge を確認する。",
        "route": "auth.login",
        "params": {},
        "path": ["auth.login", "knowledge.list", "notification.list"],
    },
    {
        "id": "scenario-9",
        "title": "Scenario 9 参加申請コメント、取消、コメント編集 / 非表示",
        "description": "join request 送信と admin 側の確認導線を確認する。",
        "route": "workspace.join_request",
        "params": {"fixture": "join-request-applicant"},
        "path": ["workspace.join_request", "admin.members", "knowledge.detail"],
    },
    {
        "id": "scenario-10",
        "title": "Scenario 10 履歴導線と二重実行耐性",
        "description": "question detail の history side panel と read-only flow を確認する。",
        "route": "question.detail",
        "params": {"fixture": "member", "modal": "history"},
        "path": ["question.detail", "knowledge.revisions", "bookmark.list", "admin.members", "notification.list"],
    },
]


ROUTE_TEMPLATE = """<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} | Google Stitch Prototype</title>
    <link rel="icon" href="data:," />
    <link rel="stylesheet" href="{tokens_href}" />
    <link rel="stylesheet" href="{base_href}" />
  </head>
  <body data-screen="{screen_id}">
    <div id="app"></div>
    <script>
      window.DESIGN_PROTO_RAW_HTML_B64 = "{raw_html_b64}";
    </script>
    <script defer src="{routes_href}"></script>
    <script defer src="{mock_data_href}"></script>
    <script defer src="{mock_state_href}"></script>
    <script defer src="{prototype_href}"></script>
  </body>
</html>
"""


INDEX_TEMPLATE = """<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Google Stitch Prototype Index</title>
    <link rel="icon" href="data:," />
    <link rel="stylesheet" href="{tokens_href}" />
    <link rel="stylesheet" href="{base_href}" />
  </head>
  <body data-screen="__index__">
    <div id="app"></div>
    <script defer src="{routes_href}"></script>
    <script defer src="{mock_data_href}"></script>
    <script defer src="{mock_state_href}"></script>
    <script defer src="{prototype_href}"></script>
  </body>
</html>
"""


def write_if_changed(path: Path, content: str) -> None:
    if path.exists() and path.read_text(encoding="utf-8") == content:
        return
    path.write_text(content, encoding="utf-8")


def short_hash(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()[:12]


def asset_href(name: str, versions: dict[str, str]) -> str:
    version = versions.get(name, "")
    if not version:
        return f"assets/{name}"
    return f"assets/{name}?v={version}"


def main() -> None:
    routes_payload = {
        "routes": ROUTES,
        "scenarios": SCENARIOS,
    }
    routes_js = (
        "// Generated by docs/design/prototype/tools/build_stitch_prototype.py\n"
        f"window.DESIGN_PROTO_ROUTES = {json.dumps(routes_payload, ensure_ascii=False, indent=2)};\n"
    )
    write_if_changed(ASSETS_DIR / "routes.js", routes_js)

    versions = {
        "tokens.css": short_hash((ASSETS_DIR / "tokens.css").read_text(encoding="utf-8")),
        "base.css": short_hash((ASSETS_DIR / "base.css").read_text(encoding="utf-8")),
        "routes.js": short_hash(routes_js),
        "mock-data.js": short_hash((ASSETS_DIR / "mock-data.js").read_text(encoding="utf-8")),
        "mock-state.js": short_hash((ASSETS_DIR / "mock-state.js").read_text(encoding="utf-8")),
        "prototype.js": short_hash((ASSETS_DIR / "prototype.js").read_text(encoding="utf-8")),
    }

    shared_asset_args = {
        "tokens_href": asset_href("tokens.css", versions),
        "base_href": asset_href("base.css", versions),
        "routes_href": asset_href("routes.js", versions),
        "mock_data_href": asset_href("mock-data.js", versions),
        "mock_state_href": asset_href("mock-state.js", versions),
        "prototype_href": asset_href("prototype.js", versions),
    }

    write_if_changed(ROOT / "index.html", INDEX_TEMPLATE.format(**shared_asset_args))

    for route in ROUTES:
        raw_html = (ROOT / route["rawPath"]).read_text(encoding="utf-8")
        raw_html_b64 = base64.b64encode(raw_html.encode("utf-8")).decode("ascii")
        wrapper = ROUTE_TEMPLATE.format(
            title=route["title"],
            screen_id=route["id"],
            raw_html_b64=raw_html_b64,
            **shared_asset_args,
        )
        write_if_changed(ROOT / f"{route['slug']}.html", wrapper)


if __name__ == "__main__":
    main()
