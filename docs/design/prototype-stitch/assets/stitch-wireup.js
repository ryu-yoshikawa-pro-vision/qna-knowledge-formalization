const ROUTES = {
  "auth-login": {
    title: "ログイン",
    rawPath: "../Google Stitch/1. Login Screen/code.html",
    sourceLabel: "1. Login Screen",
    links: [
      { text: "Google でログイン", route: "workspace-resolution", mode: "includes", broad: true },
    ],
  },
  "workspace-resolution": {
    title: "ワークスペース参加ゲート",
    rawPath: "../Google Stitch/2. Workspace Join Gateway/code.html",
    sourceLabel: "2. Workspace Join Gateway",
    links: [
      { text: "ワークスペースに参加する", route: "workspace-join-request", mode: "includes", broad: true },
      { text: "新規作成", route: "knowledge-list", mode: "exact", broad: true },
      { text: "ログイン画面へ戻る", route: "auth-login", mode: "includes", broad: true },
    ],
  },
  "knowledge-list": {
    title: "ナレッジ一覧",
    rawPath: "../Google Stitch/3. Knowledge List Screen/code.html",
    sourceLabel: "3. Knowledge List Screen",
    links: [
      { text: "新規作成", route: "knowledge-create", mode: "exact", broad: true },
      { text: "新規作成を開始", route: "knowledge-create", mode: "includes", broad: true },
      { text: "エラーハンドリング", route: "knowledge-detail", mode: "includes", broad: true },
    ],
  },
  "knowledge-detail": {
    title: "ナレッジ詳細",
    rawPath: "../Google Stitch/4. Knowledge Detail Screen/code.html",
    sourceLabel: "4. Knowledge Detail Screen",
    links: [
      { text: "編集する", route: "knowledge-edit", mode: "includes", broad: true },
      { text: "更新履歴へ", route: "knowledge-revisions", mode: "includes", broad: true },
    ],
  },
  "knowledge-create": {
    title: "ナレッジ作成",
    rawPath: "../Google Stitch/5. Knowledge Create Screen/code.html",
    sourceLabel: "5. Knowledge Create Screen",
    links: [
      { text: "下書き保存", route: "knowledge-edit-draft-detail", mode: "includes", broad: true },
      { text: "共有する", route: "knowledge-detail", mode: "includes", broad: true },
      { text: "レビューをリクエスト", route: "review-queue", mode: "includes", broad: true },
    ],
  },
  "knowledge-edit": {
    title: "ナレッジ編集",
    rawPath: "../Google Stitch/6. Knowledge Edit Screen/code.html",
    sourceLabel: "6. Knowledge Edit Screen",
    links: [
      { text: "下書き保存", route: "knowledge-edit-draft-detail", mode: "includes", broad: true },
      { text: "再共有", route: "knowledge-detail", mode: "includes", broad: true },
      { text: "レビューを依頼", route: "review-queue", mode: "includes", broad: true },
      { text: "詳細へ戻る", route: "knowledge-detail", mode: "includes", broad: true },
    ],
  },
  "review-queue": {
    title: "レビューキュー",
    rawPath: "../Google Stitch/7. Review Queue Screen/code.html",
    sourceLabel: "7. Review Queue Screen",
    links: [
      { text: "レビューを開始", route: "knowledge-review-detail", mode: "includes", broad: true },
    ],
  },
  "admin-members": {
    title: "メンバー管理",
    rawPath: "../Google Stitch/8. Member Management Screen/code.html",
    sourceLabel: "8. Member Management Screen",
    links: [
      { text: "メンバーを招待する", route: "workspace-invitation-accept", mode: "includes", broad: true },
      { text: "参加リクエスト", route: "workspace-join-request", mode: "includes", broad: true },
      { text: "招待", route: "workspace-invitation-accept", mode: "exact", broad: true },
    ],
  },
  "notification-center": {
    title: "通知センター",
    rawPath: "../Google Stitch/9. Notification Center Screen/code.html",
    sourceLabel: "9. Notification Center Screen",
    links: [],
  },
  "question-list": {
    title: "Q&A 一覧",
    rawPath: "../Google Stitch/10. Q&A List Screen/code.html",
    sourceLabel: "10. Q&A List Screen",
    links: [
      { text: "質問を投稿", route: "question-create", mode: "includes", broad: true },
      { text: "新規作成", route: "question-create", mode: "exact", broad: true },
    ],
  },
  "question-detail": {
    title: "Q&A 詳細",
    rawPath: "../Google Stitch/11. Q&A Detail Screen/code.html",
    sourceLabel: "11. Q&A Detail Screen",
    links: [
      { text: "ナレッジ化を開始する", route: "knowledge-create", mode: "includes", broad: true },
      { text: "編集する", route: "question-edit", mode: "includes", broad: true },
    ],
  },
  "question-create": {
    title: "質問投稿",
    rawPath: "../Google Stitch/12. Question Post Screen/code.html",
    sourceLabel: "12. Question Post Screen",
    links: [
      { text: "質問を公開する", route: "question-detail", mode: "includes", broad: true },
      { text: "公開する", route: "question-detail", mode: "exact", broad: true },
      { text: "下書き保存", route: "question-detail", mode: "includes", broad: true },
    ],
  },
  "question-edit": {
    title: "質問編集",
    rawPath: "../Google Stitch/13. Question Edit Screen/code.html",
    sourceLabel: "13. Question Edit Screen",
    links: [
      { text: "変更を保存", route: "question-detail", mode: "includes", broad: true },
    ],
  },
  "bookmark-list": {
    title: "ブックマーク一覧",
    rawPath: "../Google Stitch/14. Bookmark List Screen/code.html",
    sourceLabel: "14. Bookmark List Screen",
    links: [],
  },
  "admin-tags": {
    title: "タグ管理",
    rawPath: "../Google Stitch/15. Tag Management Screen/code.html",
    sourceLabel: "15. Tag Management Screen",
    links: [
      { text: "新しいタグを追加", route: "admin-tags", mode: "includes", broad: true },
      { text: "CSVエクスポート", route: "admin-tags", mode: "includes", broad: true },
    ],
  },
  "knowledge-revisions": {
    title: "ナレッジ更新履歴",
    rawPath: "../Google Stitch/16. Knowledge Version History Screen/code.html",
    sourceLabel: "16. Knowledge Version History Screen",
    links: [
      { text: "詳細へ戻る", route: "knowledge-detail", mode: "includes", broad: true },
    ],
  },
  "workspace-invitation-accept": {
    title: "招待受諾",
    rawPath: "../Google Stitch/17. Workspace Invitation Accept Screen/code.html",
    sourceLabel: "17. Workspace Invitation Accept Screen",
    links: [
      { text: "招待を承諾する", route: "knowledge-list", mode: "includes", broad: true },
      { text: "辞退する", route: "auth-login", mode: "includes", broad: true },
      { text: "ログイン画面へ戻る", route: "auth-login", mode: "includes", broad: true },
    ],
  },
  "workspace-join-request": {
    title: "参加申請",
    rawPath: "../Google Stitch/18. Workspace Join Request Screen/code.html",
    sourceLabel: "18. Workspace Join Request Screen",
    links: [
      { text: "参加申請", route: "knowledge-list", mode: "includes", broad: true },
      { text: "申請を送信", route: "knowledge-list", mode: "includes", broad: true },
      { text: "送信する", route: "knowledge-list", mode: "includes", broad: true },
      { text: "ログイン画面へ戻る", route: "auth-login", mode: "includes", broad: true },
    ],
  },
  "knowledge-edit-draft-detail": {
    title: "編集下書き詳細",
    rawPath: "../Google Stitch/19. Knowledge Edit Draft Detail Screen/code.html",
    sourceLabel: "19. Knowledge Edit Draft Detail Screen",
    links: [
      { text: "編集する", route: "knowledge-edit", mode: "includes", broad: true },
      { text: "レビューを依頼", route: "review-queue", mode: "includes", broad: true },
      { text: "詳細へ戻る", route: "knowledge-detail", mode: "includes", broad: true },
    ],
  },
  "knowledge-review-detail": {
    title: "レビュー詳細",
    rawPath: "../Google Stitch/20. Knowledge Review Detail Screen/code.html",
    sourceLabel: "20. Knowledge Review Detail Screen",
    links: [
      { text: "正式化する", route: "knowledge-detail", mode: "includes", broad: true },
      { text: "差し戻し", route: "review-queue", mode: "includes", broad: true },
      { text: "レビューキューへ戻る", route: "review-queue", mode: "includes", broad: true },
      { text: "一覧へ戻る", route: "review-queue", mode: "includes", broad: true },
    ],
  },
};

const GLOBAL_LINKS = [
  { text: "知識", route: "knowledge-list", mode: "exact" },
  { text: "質問", route: "question-list", mode: "exact" },
  { text: "ブックマーク", route: "bookmark-list", mode: "exact" },
  { text: "通知", route: "notification-center", mode: "exact" },
  { text: "管理者設定", route: "admin-members", mode: "exact" },
  { text: "Privacy Policy", href: "./index.html", mode: "includes", broad: true },
  { text: "Terms of Service", href: "./index.html", mode: "includes", broad: true },
  { text: "Support", href: "./index.html", mode: "includes", broad: true },
  { text: "プライバシーポリシー", href: "./index.html", mode: "includes", broad: true },
  { text: "利用規約", href: "./index.html", mode: "includes", broad: true },
];

const SCENARIOS = [
  {
    title: "Scenario 1: ログインから知識一覧へ",
    description: "Google ログイン後にワークスペース判定を経由してメイン導線へ入る確認用。",
    route: "auth-login",
  },
  {
    title: "Scenario 2: 招待受諾",
    description: "招待リンク受諾からそのまま knowledge list に入る導線。",
    route: "workspace-invitation-accept",
  },
  {
    title: "Scenario 3: 参加申請",
    description: "workspace join request の見た目を保持したまま申請導線を確認する。",
    route: "workspace-join-request",
  },
  {
    title: "Scenario 4: ナレッジ作成",
    description: "knowledge list から create、draft save、share までの導線。",
    route: "knowledge-list",
  },
  {
    title: "Scenario 5: レビュー待ちから正式化",
    description: "review queue から review detail を開き、正式化後に detail へ戻る。",
    route: "review-queue",
  },
  {
    title: "Scenario 6: 正式ナレッジ編集",
    description: "detail から edit、draft detail、revision history を辿る確認用。",
    route: "knowledge-detail",
  },
  {
    title: "Scenario 7: 質問投稿",
    description: "Q&A list から question post、detail、edit の導線。",
    route: "question-list",
  },
  {
    title: "Scenario 8: Q&A からナレッジ化",
    description: "question detail から knowledge create に遷移する導線。",
    route: "question-detail",
  },
  {
    title: "Scenario 9: ブックマークと通知",
    description: "global nav から bookmark と notification を往復する確認用。",
    route: "bookmark-list",
  },
  {
    title: "Scenario 10: 管理画面",
    description: "member management と tag management を Stitch の見た目のまま確認する。",
    route: "admin-members",
  },
];

function routeUrl(routeId) {
  return `./screen.html?route=${encodeURIComponent(routeId)}`;
}

function normalizeText(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

function matchText(text, expected, mode = "exact") {
  if (!text) {
    return false;
  }
  if (mode === "includes") {
    return text.includes(expected);
  }
  return text === expected;
}

function getCandidates(doc, broad = false) {
  const selector = broad
    ? "a, button, [role='button'], [onclick], [class*='cursor-pointer'], [tabindex]"
    : "a, button, [role='button']";
  return Array.from(new Set(doc.querySelectorAll(selector)));
}

function applyLink(element, href) {
  const resolvedHref = href.startsWith(".") ? href : routeUrl(href);

  if (element.tagName === "A") {
    element.setAttribute("href", resolvedHref);
    element.setAttribute("target", "_top");
    element.dataset.codexWired = "true";
    return;
  }

  element.style.cursor = "pointer";
  element.dataset.codexWired = "true";
  element.addEventListener("click", (event) => {
    event.preventDefault();
    window.top.location.href = resolvedHref;
  });
}

function wireByText(doc, spec) {
  const searchPool = getCandidates(doc, spec.broad);
  const matches = searchPool
    .map((element) => ({
      element,
      text: normalizeText(element.textContent),
    }))
    .filter((candidate) => matchText(candidate.text, spec.text, spec.mode))
    .sort((left, right) => left.text.length - right.text.length);

  for (const candidate of matches) {
    applyLink(candidate.element, spec.href || spec.route);
  }
}

function patchFrameDocument(doc, routeId) {
  const routeConfig = ROUTES[routeId];
  const specs = [...GLOBAL_LINKS, ...routeConfig.links];

  for (const spec of specs) {
    wireByText(doc, spec);
  }

  for (const anchor of doc.querySelectorAll("a[href='#']")) {
    if (!anchor.dataset.codexWired) {
      anchor.setAttribute("href", "javascript:void(0)");
    }
  }
}

function bootScreenPage() {
  const routeId = getSearchParams().get("route") || "auth-login";
  const routeConfig = ROUTES[routeId];
  const shell = document.getElementById("screen-shell");
  const frame = document.getElementById("stitch-frame");

  if (!routeConfig || !shell || !frame) {
    shell?.replaceWith(document.getElementById("route-error-template").content.cloneNode(true));
    document.title = "Prototype Stitch Viewer";
    return;
  }

  document.title = `${routeConfig.title} | Prototype Stitch`;
  frame.src = routeConfig.rawPath;

  frame.addEventListener("load", () => {
    try {
      patchFrameDocument(frame.contentDocument, routeId);
    } catch (error) {
      console.warn("stitch patch skipped", error);
    }
  });
}

function createScreenCard(routeId, routeConfig) {
  const anchor = document.createElement("a");
  anchor.className = "screen-card";
  anchor.href = routeUrl(routeId);
  anchor.innerHTML = `
    <span class="card-label">${routeId}</span>
    <h3 class="card-title">${routeConfig.title}</h3>
    <p>${routeConfig.sourceLabel}</p>
    <p class="card-meta">${routeConfig.rawPath}</p>
  `;
  return anchor;
}

function createScenarioCard(scenario) {
  const anchor = document.createElement("a");
  anchor.className = "scenario-card";
  anchor.href = routeUrl(scenario.route);
  anchor.innerHTML = `
    <span class="card-label">${scenario.route}</span>
    <h3 class="card-title">${scenario.title}</h3>
    <p>${scenario.description}</p>
  `;
  return anchor;
}

function bootIndexPage() {
  const screenGrid = document.getElementById("screen-grid");
  const scenarioList = document.getElementById("scenario-list");

  if (!screenGrid || !scenarioList) {
    return;
  }

  for (const [routeId, routeConfig] of Object.entries(ROUTES)) {
    screenGrid.appendChild(createScreenCard(routeId, routeConfig));
  }

  for (const scenario of SCENARIOS) {
    scenarioList.appendChild(createScenarioCard(scenario));
  }
}

if (document.body.dataset.app === "screen") {
  bootScreenPage();
}

if (document.body.dataset.app === "index") {
  bootIndexPage();
}
