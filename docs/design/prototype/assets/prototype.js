(function () {
  var ROUTES = (window.DESIGN_PROTO_ROUTES && window.DESIGN_PROTO_ROUTES.routes) || [];
  var SCENARIOS = (window.DESIGN_PROTO_ROUTES && window.DESIGN_PROTO_ROUTES.scenarios) || [];
  var STATE = window.DESIGN_PROTO_STATE;
  var DATA = window.DESIGN_PROTO_DATA || {};
  var SCREEN_ID = document.body.dataset.screen || "__index__";
  var APP = document.getElementById("app");

  var INJECTED_STYLE = [
    "html.codex-prototype-runtime { min-height: 100%; height: 100%; }",
    "body.codex-prototype-runtime { min-height: 100vh !important; min-height: 100dvh !important; }",
    "body.codex-prototype-runtime { position: relative !important; }",
    ".codex-proto-hidden { display: none !important; }",
    ".codex-proto-disabled { pointer-events: none !important; cursor: default !important; }",
    ".codex-proto-linkable { cursor: pointer !important; }",
    ".codex-proto-icon-anchor { position: relative !important; }",
    ".codex-proto-count-badge { position: absolute; top: -6px; right: -6px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px; background: #002045; color: #fff; font-family: Inter, sans-serif; font-size: 10px; font-weight: 700; line-height: 18px; text-align: center; box-shadow: 0 6px 20px rgba(0, 27, 60, 0.14); }",
    ".codex-proto-click-card { cursor: pointer !important; transition: transform 160ms ease, box-shadow 160ms ease; }",
    ".codex-proto-click-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0, 27, 60, 0.08); }",
    ".codex-proto-state-layer { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 120; background: rgba(247, 249, 251, 0.78); backdrop-filter: blur(10px); }",
    ".codex-proto-state-layer[data-mode='blocked'] { background: rgba(247, 249, 251, 0.88); }",
    ".codex-proto-state-layer[data-mode='denied'] { background: rgba(247, 249, 251, 0.96); }",
    ".codex-proto-state-card { width: min(560px, calc(100% - 32px)); border-radius: 24px; background: rgba(255,255,255,0.96); box-shadow: 0 18px 50px rgba(0,27,60,0.10); padding: 24px 26px; font-family: Inter, sans-serif; color: #191c1e; }",
    ".codex-proto-state-card[data-kind='floating'] { position: fixed; right: 24px; bottom: 24px; width: min(360px, calc(100% - 32px)); padding: 18px 18px 16px; z-index: 130; }",
    ".codex-proto-state-kicker { margin: 0 0 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #002045; }",
    ".codex-proto-state-card h2 { margin: 0; font-family: Manrope, sans-serif; font-size: 24px; line-height: 1.15; color: #002045; }",
    ".codex-proto-state-card p { margin: 12px 0 0; font-size: 14px; line-height: 1.75; color: #43474e; }",
    ".codex-proto-state-card[data-tone='warning'] { border: 1px solid rgba(198,149,94,0.32); }",
    ".codex-proto-state-card[data-tone='danger'] { border: 1px solid rgba(147,0,10,0.22); }",
    ".codex-proto-state-card[data-tone='success'] { border: 1px solid rgba(45,106,79,0.24); }",
    ".codex-proto-state-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }",
    ".codex-proto-state-link { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; padding: 0 14px; border-radius: 999px; background: #002045; color: #fff; text-decoration: none; font-size: 13px; font-weight: 700; }",
    ".codex-proto-state-link.is-secondary { background: #f2f4f6; color: #002045; }",
    ".codex-proto-side-panel { position: fixed; top: 0; right: 0; bottom: 0; width: min(420px, calc(100vw - 32px)); padding: 28px; background: rgba(255,255,255,0.98); box-shadow: -18px 0 50px rgba(0,27,60,0.12); z-index: 140; font-family: Inter, sans-serif; overflow-y: auto; }",
    ".codex-proto-side-panel h2 { margin: 0; font-family: Manrope, sans-serif; font-size: 28px; line-height: 1.1; color: #002045; }",
    ".codex-proto-side-panel h3 { margin: 20px 0 8px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #5f6570; }",
    ".codex-proto-side-panel ul { margin: 0; padding-left: 18px; color: #43474e; line-height: 1.75; }",
    ".codex-proto-side-panel .codex-proto-close { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; padding: 0 14px; border-radius: 999px; background: #f2f4f6; color: #002045; text-decoration: none; font-size: 13px; font-weight: 700; margin-top: 18px; }",
    ".codex-proto-tab-active { color: #002045 !important; border-bottom: 2px solid #002045 !important; opacity: 1 !important; }",
    ".codex-proto-readonly-surface { opacity: 0.62 !important; pointer-events: none !important; user-select: none !important; }",
    ".codex-proto-denied-context > *:not(.codex-proto-state-layer) { filter: blur(6px); opacity: 0.18; pointer-events: none !important; user-select: none !important; }",
  ].join("");

  function routeById(routeId) {
    return STATE.getRouteById(routeId);
  }

  function decodeBase64Utf8(value) {
    if (!value) {
      return "";
    }
    try {
      var binary = window.atob(value);
      var bytes = Uint8Array.from(binary, function (char) {
        return char.charCodeAt(0);
      });
      if (typeof TextDecoder !== "undefined") {
        return new TextDecoder("utf-8").decode(bytes);
      }
      return decodeURIComponent(
        Array.prototype.map
          .call(bytes, function (byte) {
            return "%" + byte.toString(16).padStart(2, "0");
          })
          .join("")
      );
    } catch (error) {
      return "";
    }
  }

  function embeddedRawHtml() {
    return decodeBase64Utf8(window.DESIGN_PROTO_RAW_HTML_B64 || "");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function groupBy(items, key) {
    return items.reduce(function (accumulator, item) {
      var bucket = item[key];
      if (!accumulator[bucket]) {
        accumulator[bucket] = [];
      }
      accumulator[bucket].push(item);
      return accumulator;
    }, {});
  }

  function injectRuntimeStyle(doc) {
    if (doc.getElementById("codex-proto-runtime-style")) {
      return;
    }
    var style = doc.createElement("style");
    style.id = "codex-proto-runtime-style";
    style.textContent = INJECTED_STYLE;
    doc.head.appendChild(style);
    doc.documentElement.classList.add("codex-prototype-runtime");
    doc.body.classList.add("codex-prototype-runtime");
  }

  function normalizeElementText(element) {
    return STATE.normalizeText(element.textContent || "");
  }

  function toArray(listLike) {
    return Array.prototype.slice.call(listLike || []);
  }

  function queryAll(root, selector) {
    return toArray(root.querySelectorAll(selector));
  }

  function shortTextMatch(element, text, options) {
    var normalized = normalizeElementText(element);
    if (!normalized) {
      return false;
    }
    var maxLength = options && options.maxLength ? options.maxLength : 80;
    if (normalized.length > maxLength) {
      return false;
    }
    return normalized.indexOf(text) >= 0;
  }

  function findByText(root, selectors, text, options) {
    var selector = Array.isArray(selectors) ? selectors.join(",") : selectors;
    return queryAll(root, selector).filter(function (element) {
      return shortTextMatch(element, text, options);
    });
  }

  function findButtonsByIcon(root, iconName) {
    return queryAll(root, "button, a, div, span").filter(function (element) {
      var icon = element.classList && element.classList.contains("material-symbols-outlined") ? element : element.querySelector(".material-symbols-outlined");
      if (!icon || STATE.normalizeText(icon.textContent || "") !== iconName) {
        return false;
      }
      var text = normalizeElementText(element);
      return !text || text === iconName || text.length <= 40;
    });
  }

  function closestInteractive(target) {
    return target.closest("a, button, input, select, textarea, label");
  }

  function wireElement(element, href, options) {
    if (!element || !href) {
      return;
    }
    var settings = options || {};
    if (element.tagName === "A") {
      element.setAttribute("href", href);
      element.setAttribute("target", "_top");
      return;
    }

    element.classList.add("codex-proto-linkable");
    if (!settings.quiet) {
      element.classList.add("codex-proto-click-card");
    }
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "0");
    }
    element.setAttribute("role", "link");
    element.addEventListener("click", function (event) {
      var nearestInteractive = closestInteractive(event.target);
      if (event.target !== element && nearestInteractive && nearestInteractive !== element) {
        return;
      }
      event.preventDefault();
      window.top.location.href = href;
    });
    element.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.top.location.href = href;
      }
    });
  }

  function wireFirstByText(doc, selectors, text, href, options) {
    var match = findByText(doc, selectors, text, options)[0];
    if (match) {
      wireElement(match, href, options);
    }
  }

  function wireAllByText(doc, selectors, text, href, options) {
    findByText(doc, selectors, text, options).forEach(function (element) {
      wireElement(element, href, options);
    });
  }

  function wireClosestContainerByText(doc, selectors, text, containerSelector, href, options) {
    var match = findByText(doc, selectors, text, options)[0];
    if (!match) {
      return;
    }
    var container = match.closest(containerSelector);
    wireElement(container || match, href, options);
  }

  function wireFirstByIcon(doc, iconName, href, options) {
    var button = findButtonsByIcon(doc, iconName)[0];
    if (button) {
      wireElement(button, href, options);
    }
  }

  function disableElement(element) {
    if (!element) {
      return;
    }
    element.classList.add("codex-proto-disabled");
    element.setAttribute("aria-disabled", "true");
    element.setAttribute("tabindex", "-1");
    element.removeAttribute("role");
    if (element.tagName === "A") {
      element.removeAttribute("href");
      element.removeAttribute("target");
      return;
    }
    if (element.tagName === "BUTTON" || element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT") {
      element.disabled = true;
    }
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      element.readOnly = true;
    }
  }

  function disableAllByText(doc, selectors, text, options) {
    findByText(doc, selectors, text, options).forEach(function (element) {
      disableElement(element);
    });
  }

  function disableAll(doc, selector) {
    queryAll(doc, selector).forEach(function (element) {
      disableElement(element);
    });
  }

  function applyReadonlySurface(surface) {
    if (!surface) {
      return;
    }
    surface.classList.add("codex-proto-readonly-surface");
    queryAll(surface, "a, button, input, textarea, select").forEach(function (element) {
      disableElement(element);
    });
  }

  function applyReadonlySelectors(doc, selectors) {
    var selector = Array.isArray(selectors) ? selectors.join(",") : selectors;
    queryAll(doc, selector).forEach(function (surface) {
      applyReadonlySurface(surface);
    });
  }

  function hideByText(doc, selectors, text, options) {
    findByText(doc, selectors, text, options).forEach(function (element) {
      element.classList.add("codex-proto-hidden");
    });
  }

  function hideByIcon(doc, iconName) {
    findButtonsByIcon(doc, iconName).forEach(function (element) {
      element.classList.add("codex-proto-hidden");
    });
  }

  function decorateButtonCount(buttons, count) {
    buttons.forEach(function (button) {
      if (button.querySelector(".codex-proto-count-badge")) {
        return;
      }
      button.classList.add("codex-proto-icon-anchor");
      var badge = button.ownerDocument.createElement("span");
      badge.className = "codex-proto-count-badge";
      badge.textContent = String(count);
      button.appendChild(badge);
    });
  }

  function linkifyCards(doc, selector, hrefs) {
    queryAll(doc, selector).slice(0, hrefs.length).forEach(function (card, index) {
      wireElement(card, hrefs[index], { quiet: false });
    });
  }

  function currentHref(route, context, overrides) {
    return STATE.buildHref(route.id, overrides || {}, context);
  }

  function indexHref() {
    if (STATE && typeof STATE.indexHref === "function") {
      return STATE.indexHref();
    }
    try {
      return new URL("index.html", window.location.href || "").toString();
    } catch (error) {
      return "./index.html";
    }
  }

  function sidebarNavSelector() {
    return "aside nav > a, aside nav > div, aside nav > button";
  }

  function signedInHomeHref(context) {
    return STATE.buildHref("knowledge.list", { fixture: "member" }, context);
  }

  function workspaceEntryHref(route, context) {
    if (route.template === "gateway") {
      if (route.id === "auth.login") {
        return STATE.buildHref("auth.login", { fixture: "unaffiliated-user" }, context);
      }
      return STATE.buildHref("workspace.resolution", { fixture: "unaffiliated-user" }, context);
    }
    return signedInHomeHref(context);
  }

  function wireShellLinks(doc, route, context) {
    var workspaceHref = workspaceEntryHref(route, context);
    var chromeSelector = "header a, header button, header div, header span, main nav a, main nav div, main nav span";

    wireAllByText(doc, chromeSelector, "ワークスペース", workspaceHref, { maxLength: 16, quiet: true });

    if (route.id.indexOf("admin.") === 0) {
      wireAllByText(doc, chromeSelector, "設定", STATE.buildHref("admin.members", { fixture: context.fixture }, context), { maxLength: 8, quiet: true });
    }

    if (route.template !== "gateway") {
      var homeHref = signedInHomeHref(context);
      wireAllByText(doc, "aside h1, aside p, header span, header div", "知識基盤", homeHref, { maxLength: 16, quiet: true });
      wireAllByText(doc, "header span, header div", "Knowledge Infrastructure", homeHref, { maxLength: 40, quiet: true });
    }
  }

  function wireGlobalNavigation(doc, route, context) {
    var navSelector = sidebarNavSelector();
    wireFirstByText(doc, navSelector, "知識", STATE.buildHref("knowledge.list", {}, context), { maxLength: 48, quiet: true });
    wireFirstByText(doc, navSelector, "質問", STATE.buildHref("question.list", {}, context), { maxLength: 48, quiet: true });
    wireFirstByText(doc, navSelector, "ブックマーク", STATE.buildHref("bookmark.list", {}, context), { maxLength: 48, quiet: true });
    wireFirstByText(doc, navSelector, "通知", STATE.buildHref("notification.list", {}, context), { maxLength: 48, quiet: true });

    if (STATE.isAdminFixture(context.fixture)) {
      wireFirstByText(doc, navSelector, "管理者設定", STATE.buildHref("admin.members", {}, context), { maxLength: 64, quiet: true });
    } else {
      hideByText(doc, navSelector, "管理者設定", { maxLength: 64 });
    }

    if (route.id.indexOf("question.") === 0) {
      wireAllByText(doc, "button, a", "新規作成", STATE.buildHref("question.create", { fixture: "member" }, context), { maxLength: 24 });
    } else if (route.id.indexOf("knowledge.") === 0 || route.id === "review.queue") {
      wireAllByText(doc, "button, a", "新規作成", STATE.buildHref("knowledge.create", { fixture: "member" }, context), { maxLength: 24 });
    }

    wireFirstByIcon(doc, "notifications", STATE.buildHref("notification.list", {}, context), { quiet: true });

    var reviewButtons = findButtonsByIcon(doc, "rate_review");
    if (STATE.isPrivilegedFixture(context.fixture)) {
      reviewButtons.forEach(function (button) {
        wireElement(button, STATE.buildHref("review.queue", {}, context), { quiet: true });
      });
      decorateButtonCount(reviewButtons, 3);
    } else {
      reviewButtons.forEach(function (button) {
        button.classList.add("codex-proto-hidden");
      });
    }
  }

  function wireFooterLinks(doc) {
    ["Privacy Policy", "Terms of Service", "Support", "プライバシーポリシー", "利用規約", "ヘルプセンター"].forEach(function (label) {
      wireAllByText(doc, "a, button", label, indexHref(), { maxLength: 32, quiet: true });
    });
  }

  function wireKnowledgeList(doc, context) {
    var cardTargets = [
      STATE.buildHref("knowledge.detail", { fixture: "member", state: "formal" }, context),
      STATE.buildHref("knowledge.detail", { fixture: "member", state: "review-requested" }, context),
      STATE.buildHref("knowledge.detail", { fixture: "member", state: "formal" }, context),
    ];
    linkifyCards(doc, "main .group.bg-surface-container-lowest", cardTargets);
    wireAllByText(doc, "button, a", "新規作成を開始", STATE.buildHref("knowledge.create", { fixture: "member", state: "draft" }, context), { maxLength: 24 });
    findButtonsByIcon(doc, "bookmark").forEach(function (button) {
      if (button.closest("main")) {
        wireElement(button, STATE.buildHref("bookmark.list", {}, context), { quiet: true });
      }
    });
  }

  function wireKnowledgeDetail(doc, context) {
    var editRoute = context.state === "formal" || context.state === "archived" ? "knowledge.edit_draft_create" : "knowledge.edit";
    wireAllByText(doc, "button, a", "編集する", STATE.buildHref(editRoute, { fixture: "member" }, context), { maxLength: 20 });
    wireAllByText(doc, "button, a", "更新履歴へ", STATE.buildHref("knowledge.revisions", {}, context), { maxLength: 40 });
    wireAllByText(doc, "button, a", "Q&Aから作成されました", STATE.buildHref("question.detail", { fixture: "member", state: "resolved" }, context), { maxLength: 32, quiet: true });
    wireAllByText(doc, "button, a", "すべて見る", STATE.buildHref("question.detail", { fixture: "member", state: "resolved" }, context), { maxLength: 18, quiet: true });
    wireAllByText(doc, "button, a", "ブックマーク", STATE.buildHref("bookmark.list", {}, context), { maxLength: 18 });
    wireAllByText(doc, "button, a", "コメントを追加", STATE.buildHref("question.create", { fixture: "member" }, context), { maxLength: 20 });
    wireAllByText(doc, "button, a", "チャットを開始", STATE.buildHref("question.create", { fixture: "member" }, context), { maxLength: 20 });
    wireAllByText(doc, "button, a, div, span", "社内規定・福利厚生ガイド", STATE.buildHref("knowledge.detail", { fixture: "member", state: "archived" }, context), { maxLength: 32, quiet: true });
    wireAllByText(doc, "button, a, div, span", "開発環境セットアップWiki", STATE.buildHref("knowledge.detail", { fixture: "member", state: "review-requested" }, context), { maxLength: 32, quiet: true });
  }

  function wireKnowledgeCreate(doc, context) {
    wireAllByText(doc, "button, a", "下書き保存", STATE.buildHref("knowledge.edit", { fixture: "member", state: "draft" }, context), { maxLength: 18 });
    wireAllByText(doc, "button, a", "共有する", STATE.buildHref("knowledge.detail", { fixture: "member", state: "formal" }, context), { maxLength: 18 });
    wireAllByText(doc, "button, a", "レビューをリクエスト", STATE.buildHref("review.queue", { fixture: "reviewer" }, context), { maxLength: 24 });
  }

  function wireKnowledgeEdit(doc, context) {
    wireAllByText(doc, "button, a", "レビューをリクエスト", STATE.buildHref("review.queue", { fixture: "reviewer" }, context), { maxLength: 24 });
    wireAllByText(doc, "button, a", "再共有", STATE.buildHref("knowledge.detail", { fixture: "member", state: "formal" }, context), { maxLength: 12 });
    wireAllByText(doc, "button, a", "下書き保存", STATE.buildHref("knowledge.edit", { fixture: "member", state: "draft" }, context), { maxLength: 18 });
  }

  function wireKnowledgeRevisions(doc, context) {
    wireAllByText(doc, "button, a", "詳細へ戻る", STATE.buildHref("knowledge.detail", { state: "formal" }, context), { maxLength: 20 });
  }

  function wireEditDraftCreate(doc, context) {
    wireAllByText(doc, "button, a", "キャンセル", STATE.buildHref("knowledge.detail", { fixture: "member", state: "formal" }, context), { maxLength: 16 });
    wireAllByText(doc, "button, a", "ドラフトを作成", STATE.buildHref("knowledge.edit_draft_detail", { fixture: "member", state: "draft" }, context), { maxLength: 24 });
  }

  function wireEditDraftDetail(doc, context) {
    wireAllByText(doc, "button, a", "下書き保存", STATE.buildHref("knowledge.edit_draft_detail", { fixture: "member", state: "draft" }, context), { maxLength: 18 });
    wireAllByText(doc, "button, a", "レビューを依頼", STATE.buildHref("review.queue", { fixture: "reviewer" }, context), { maxLength: 24 });
    wireAllByText(doc, "button, a, div, span", "公式ナレッジ", STATE.buildHref("knowledge.detail", { fixture: "member", state: "formal" }, context), { maxLength: 24, quiet: true });
  }

  function wireReviewQueue(doc, context) {
    var buttons = findByText(doc, "button, a", "レビューを開始", { maxLength: 24 });
    if (buttons[0]) {
      wireElement(buttons[0], STATE.buildHref("knowledge.detail", { fixture: "reviewer", state: "review-requested" }, context));
    }
    if (buttons[1]) {
      wireElement(buttons[1], STATE.buildHref("knowledge.edit_draft_detail", { fixture: "reviewer", state: "review-requested" }, context));
    }
    if (buttons[2]) {
      wireElement(buttons[2], STATE.buildHref("knowledge.detail", { fixture: "admin", state: "review-requested" }, context));
    }
  }

  function wireQuestionList(doc, context) {
    var cardTargets = [
      STATE.buildHref("question.detail", { fixture: "member", state: "open" }, context),
      STATE.buildHref("question.detail", { fixture: "member", state: "resolved" }, context),
      STATE.buildHref("question.detail", { fixture: "member", state: "reopened" }, context),
    ];
    linkifyCards(doc, "main .group", cardTargets);
    findButtonsByIcon(doc, "bookmark").forEach(function (button) {
      if (button.closest("main")) {
        wireElement(button, STATE.buildHref("bookmark.list", {}, context), { quiet: true });
      }
    });
    wireAllByText(doc, "button, a", "新規作成", STATE.buildHref("question.create", { fixture: "member" }, context), { maxLength: 24 });
  }

  function wireQuestionDetail(doc, context) {
    wireAllByText(doc, "button, a", "ナレッジ化を開始する", STATE.buildHref("knowledge.create", { fixture: "member", state: "qa-derived" }, context), { maxLength: 32 });
    wireAllByText(doc, "button, a", "ブックマーク", STATE.buildHref("bookmark.list", {}, context), { maxLength: 18 });
    wireAllByText(doc, "button, a", "history", STATE.buildHref("question.detail", { fixture: context.fixture, state: context.state, modal: "history" }, context), { maxLength: 24, quiet: true });
    wireAllByText(doc, "button, a", "Slackチャンネル命名規則ガイドライン", STATE.buildHref("knowledge.detail", { fixture: "member", state: "formal" }, context), { maxLength: 48, quiet: true });
    wireAllByText(doc, "button, a", "新入社員向けSlack基本操作", STATE.buildHref("knowledge.detail", { fixture: "member", state: "review-requested" }, context), { maxLength: 48, quiet: true });
    wireAllByText(doc, "button, a", "共有", STATE.buildHref("notification.list", {}, context), { maxLength: 8, quiet: true });
  }

  function wireQuestionCreate(doc, context) {
    wireAllByText(doc, "button, a", "キャンセル", STATE.buildHref("question.list", { fixture: "member", state: "open" }, context), { maxLength: 16 });
    wireAllByText(doc, "button, a", "質問を公開する", STATE.buildHref("question.detail", { fixture: "member", state: "open" }, context), { maxLength: 24 });
  }

  function wireQuestionEdit(doc, context) {
    wireAllByText(doc, "button, a", "キャンセル", STATE.buildHref("question.detail", { fixture: "member", state: "open" }, context), { maxLength: 16 });
    wireAllByText(doc, "button, a", "変更を保存", STATE.buildHref("question.detail", { fixture: "member", state: "open" }, context), { maxLength: 24 });
    wireAllByText(doc, "button, a", "保存する", STATE.buildHref("question.detail", { fixture: "member", state: "open" }, context), { maxLength: 16 });
  }

  function wireNotifications(doc, context) {
    wireAllByText(doc, "button, a", "すべて既読にする", STATE.buildHref("notification.list", { state: "read-all" }, context), { maxLength: 32 });
    wireAllByText(doc, "button, a", "新入社員向けオンボーディング手順", STATE.buildHref("knowledge.detail", { fixture: "member", state: "formal" }, context), { maxLength: 48, quiet: true });
    wireClosestContainerByText(doc, "p, span", "あなたのナレッジが承認されました", ".group", STATE.buildHref("knowledge.detail", { fixture: "member", state: "formal" }, context), { maxLength: 32, quiet: true });
    wireClosestContainerByText(doc, "p, span", "あなたの質問にコメントしました", ".group", STATE.buildHref("question.detail", { fixture: "member", state: "resolved" }, context), { maxLength: 32, quiet: true });
  }

  function wireBookmarks(doc, context) {
    wireAllByText(doc, "button, a", "Slackチャンネル命名規則ガイドライン", STATE.buildHref("knowledge.detail", { fixture: "member", state: "formal" }, context), { maxLength: 48, quiet: true });
    wireAllByText(doc, "button, a", "Slackのチャンネル一覧はどこで確認できますか？", STATE.buildHref("question.detail", { fixture: "member", state: "resolved" }, context), { maxLength: 48, quiet: true });
    wireClosestContainerByText(doc, "h3, p, span", "クラウド基盤におけるセキュリティ・ガバナンス標準（2024年版）", ".group", STATE.buildHref("knowledge.detail", { fixture: "member", state: "formal" }, context), { maxLength: 40 });
    wireClosestContainerByText(doc, "h3, p, span", "VPN接続時のレイテンシ増加について", ".group", STATE.buildHref("question.detail", { fixture: "member", state: "resolved" }, context), { maxLength: 32 });
    wireClosestContainerByText(doc, "h3, p, span", "新入社員向けオンボーディング・チェックリスト", ".group", STATE.buildHref("knowledge.edit", { fixture: "member", state: "draft" }, context), { maxLength: 32 });
    wireClosestContainerByText(doc, "h3, p, span", "マイクロサービス・アーキテクチャへの移行戦略", ".group", STATE.buildHref("knowledge.detail", { fixture: "member", state: "review-requested" }, context), { maxLength: 32 });
    wireAllByText(doc, "button, a", "さらに過去の履歴を見る", STATE.buildHref("bookmark.list", { fixture: "member", state: "loading" }, context), { maxLength: 24, quiet: true });
    findButtonsByIcon(doc, "bookmark_remove").forEach(function (button) {
      wireElement(button, STATE.buildHref("bookmark.list", { state: "empty" }, context), { quiet: true });
    });
  }

  function wireAdminMembers(doc, context) {
    wireAllByText(doc, "button, a", "メンバーを招待する", STATE.buildHref("workspace.invitation_accept", { fixture: "invitation-target-user", state: "pending" }, context), { maxLength: 28 });
    wireAllByText(doc, "button, a", "再送", STATE.buildHref("workspace.invitation_accept", { fixture: "invitation-target-user", state: "pending" }, context), { maxLength: 12, quiet: true });
    wireAllByText(doc, "button, a", "承認", STATE.buildHref("knowledge.list", { fixture: "member" }, context), { maxLength: 12, quiet: true });
    wireAllByText(doc, "button, a", "却下", currentHref(routeById("admin.members"), context, { fixture: context.fixture, tab: "join-requests" }), { maxLength: 12, quiet: true });
    wireAllByText(doc, "button, a", "メンバー", STATE.buildHref("admin.members", { fixture: context.fixture, tab: "members" }, context), { maxLength: 16, quiet: true });
    wireAllByText(doc, "button, a", "招待", STATE.buildHref("admin.members", { fixture: context.fixture, tab: "invitations" }, context), { maxLength: 16, quiet: true });
    wireAllByText(doc, "button, a", "参加リクエスト", STATE.buildHref("admin.members", { fixture: context.fixture, tab: "join-requests" }, context), { maxLength: 22, quiet: true });
  }

  function wireAdminTags(doc, context) {
    wireAllByText(doc, "button, a", "CSVエクスポート", currentHref(routeById("admin.tags"), context), { maxLength: 20, quiet: true });
    wireAllByText(doc, "button, a", "新しいタグを追加", currentHref(routeById("admin.tags"), context), { maxLength: 24, quiet: true });
    wireAllByText(doc, "button, a", "ガイドラインを読む", currentHref(routeById("admin.tags"), context), { maxLength: 24, quiet: true });
    wireAllByText(doc, "button, a", "アクティブ", STATE.buildHref("admin.tags", { fixture: context.fixture, tab: "active" }, context), { maxLength: 24, quiet: true });
    wireAllByText(doc, "button, a", "統合済み", STATE.buildHref("admin.tags", { fixture: context.fixture, tab: "merged" }, context), { maxLength: 24, quiet: true });
    wireAllByText(doc, "button, a", "アーカイブ", STATE.buildHref("admin.tags", { fixture: context.fixture, tab: "archived" }, context), { maxLength: 24, quiet: true });
  }

  function wireGateway(doc, route, context) {
    if (route.id === "auth.login") {
      wireAllByText(doc, "button, a", "Google でログイン", STATE.buildHref("workspace.resolution", { fixture: "unaffiliated-user" }, context), { maxLength: 32 });
      return;
    }
    if (route.id === "workspace.resolution") {
      if (context.state === "create-path") {
        disableAllByText(doc, "button, a", "ワークスペースに参加する", { maxLength: 36 });
        wireAllByText(doc, "button, a", "新規作成", STATE.buildHref("knowledge.list", { fixture: "member" }, context), { maxLength: 18 });
        wireAllByText(doc, "button, a", "ドメイン外を検索", STATE.buildHref("workspace.join_request", { fixture: "join-request-applicant" }, context), { maxLength: 24 });
        return;
      }
      if (context.state === "active-member") {
        wireAllByText(doc, "button, a", "ワークスペースに参加する", STATE.buildHref("knowledge.list", { fixture: "member" }, context), { maxLength: 36 });
        disableAllByText(doc, "button, a", "新規作成", { maxLength: 18 });
        return;
      }
      wireAllByText(doc, "button, a", "ワークスペースに参加する", STATE.buildHref("workspace.invitation_accept", { fixture: "invitation-target-user", state: "pending" }, context), { maxLength: 36 });
      wireAllByText(doc, "button, a", "新規作成", STATE.buildHref("knowledge.list", { fixture: "member" }, context), { maxLength: 18 });
      wireAllByText(doc, "button, a", "ドメイン外を検索", STATE.buildHref("workspace.join_request", { fixture: "join-request-applicant" }, context), { maxLength: 24 });
      return;
    }
    if (route.id === "workspace.invitation_accept") {
      if (context.state === "expired") {
        disableAllByText(doc, "button, a", "招待を承諾する", { maxLength: 28 });
      } else if (context.state === "accepted") {
        disableAllByText(doc, "button, a", "招待を承諾する", { maxLength: 28 });
        disableAllByText(doc, "button, a", "辞退する", { maxLength: 16 });
      } else {
        wireAllByText(doc, "button, a", "招待を承諾する", STATE.buildHref("knowledge.list", { fixture: "member" }, context), { maxLength: 28 });
      }
      wireAllByText(doc, "button, a", "辞退する", STATE.buildHref("auth.login", { fixture: "unaffiliated-user" }, context), { maxLength: 16 });
      wireAllByText(doc, "button, a", "ログイン画面へ戻る", STATE.buildHref("auth.login", { fixture: "unaffiliated-user" }, context), { maxLength: 24 });
      return;
    }
    if (route.id === "workspace.join_request") {
      if (context.state === "cancelled") {
        disableAllByText(doc, "button, a", "参加リクエストを送信する", { maxLength: 36 });
        disableAllByText(doc, "button, a", "キャンセル", { maxLength: 16 });
        return;
      }
      if (context.state === "pending") {
        disableAllByText(doc, "button, a", "参加リクエストを送信する", { maxLength: 36 });
        wireAllByText(doc, "button, a", "キャンセル", STATE.buildHref("workspace.join_request", { fixture: "join-request-applicant", state: "cancelled" }, context), { maxLength: 16 });
        return;
      }
      wireAllByText(doc, "button, a", "参加リクエストを送信する", STATE.buildHref("workspace.join_request", { fixture: "join-request-applicant", state: "pending" }, context), { maxLength: 36 });
      wireAllByText(doc, "button, a", "キャンセル", STATE.buildHref("workspace.join_request", { fixture: "join-request-applicant", state: "cancelled" }, context), { maxLength: 16 });
    }
  }

  function wireRouteSpecific(doc, route, context) {
    if (route.template === "gateway") {
      wireGateway(doc, route, context);
      return;
    }
    switch (route.id) {
      case "knowledge.list":
        wireKnowledgeList(doc, context);
        break;
      case "knowledge.detail":
        wireKnowledgeDetail(doc, context);
        break;
      case "knowledge.create":
        wireKnowledgeCreate(doc, context);
        break;
      case "knowledge.edit":
        wireKnowledgeEdit(doc, context);
        break;
      case "knowledge.revisions":
        wireKnowledgeRevisions(doc, context);
        break;
      case "knowledge.edit_draft_create":
        wireEditDraftCreate(doc, context);
        break;
      case "knowledge.edit_draft_detail":
        wireEditDraftDetail(doc, context);
        break;
      case "review.queue":
        wireReviewQueue(doc, context);
        break;
      case "question.list":
        wireQuestionList(doc, context);
        break;
      case "question.detail":
        wireQuestionDetail(doc, context);
        break;
      case "question.create":
        wireQuestionCreate(doc, context);
        break;
      case "question.edit":
        wireQuestionEdit(doc, context);
        break;
      case "notification.list":
        wireNotifications(doc, context);
        break;
      case "bookmark.list":
        wireBookmarks(doc, context);
        break;
      case "admin.members":
        wireAdminMembers(doc, context);
        break;
      case "admin.tags":
        wireAdminTags(doc, context);
        break;
      default:
        break;
    }
  }

  function categoryForMemberRow(row) {
    var text = normalizeElementText(row);
    if (text.indexOf("参加申請中") >= 0 || text.indexOf("リクエスト中") >= 0) {
      return "join-requests";
    }
    if (text.indexOf("未承諾") >= 0 || text.indexOf("保留中") >= 0) {
      return "invitations";
    }
    return "members";
  }

  function applyMembersTab(doc, context) {
    queryAll(doc, "table tbody tr").forEach(function (row) {
      var category = categoryForMemberRow(row);
      if (context.tab && category !== context.tab) {
        row.classList.add("codex-proto-hidden");
      } else {
        row.classList.remove("codex-proto-hidden");
      }
    });
    queryAll(doc, "button, a, div, span").forEach(function (element) {
      var text = normalizeElementText(element);
      if (text.indexOf("メンバー") === 0 && text.length < 16 && context.tab === "members") {
        element.classList.add("codex-proto-tab-active");
      }
      if (text.indexOf("招待") === 0 && text.length < 16 && context.tab === "invitations") {
        element.classList.add("codex-proto-tab-active");
      }
      if (text.indexOf("参加リクエスト") === 0 && text.length < 20 && context.tab === "join-requests") {
        element.classList.add("codex-proto-tab-active");
      }
    });
  }

  function applyTagsTab(doc, context) {
    var label = {
      active: "アクティブ",
      merged: "統合済み",
      archived: "アーカイブ",
    }[context.tab];
    if (!label) {
      return;
    }
    queryAll(doc, "button, a, div, span").forEach(function (element) {
      var text = normalizeElementText(element);
      if (text.indexOf(label) === 0 && text.length < 24) {
        element.classList.add("codex-proto-tab-active");
      }
    });
  }

  function applyListTabs(doc, route, context) {
    if (route.id === "admin.members" && context.tab) {
      applyMembersTab(doc, context);
    }
    if (route.id === "admin.tags" && context.tab) {
      applyTagsTab(doc, context);
    }
  }

  function createStateCard(doc, route, context, panel, invalidFixture) {
    var layer = doc.createElement("div");
    var isBlocking = panel.kind === "blocking" || invalidFixture;
    if (isBlocking) {
      layer.className = "codex-proto-state-layer";
      layer.dataset.mode = invalidFixture || context.state === "permission-denied" ? "denied" : "blocked";
    }

    var card = doc.createElement("div");
    card.className = "codex-proto-state-card";
    card.dataset.kind = isBlocking ? "blocking" : "floating";
    card.dataset.tone = panel.tone || "info";
    card.innerHTML =
      '<p class="codex-proto-state-kicker">' +
      escapeHtml(route.id) +
      " / " +
      escapeHtml(context.state) +
      "</p>" +
      "<h2>" +
      escapeHtml(panel.title) +
      "</h2>" +
      "<p>" +
      escapeHtml(panel.body) +
      "</p>";

    var actions = doc.createElement("div");
    actions.className = "codex-proto-state-actions";
    var reset = doc.createElement("a");
    var resetHref = invalidFixture
      ? ((window.top && window.top.location && window.top.location.href) || window.location.href)
      : STATE.buildHref(route.id, { fixture: context.fixture }, context);
    reset.className = "codex-proto-state-link";
    reset.setAttribute("href", resetHref);
    reset.setAttribute("target", "_top");
    reset.textContent = panel.actionLabel || "標準 state に戻る";
    actions.appendChild(reset);

    if (isBlocking) {
      var back = doc.createElement("a");
      back.className = "codex-proto-state-link is-secondary";
      back.setAttribute("href", indexHref());
      back.setAttribute("target", "_top");
      back.textContent = "index へ戻る";
      actions.appendChild(back);
    }
    card.appendChild(actions);

    if (isBlocking) {
      layer.appendChild(card);
      return layer;
    }
    return card;
  }

  function resolvePanel(route, context) {
    if (context.invalidFixture || context.state === "permission-denied") {
      return DATA.statePanels["permission-denied"];
    }
    if (context.state === route.defaultState) {
      return null;
    }
    return DATA.statePanels[context.state] || null;
  }

  function applyStatePanel(doc, route, context) {
    var panel = resolvePanel(route, context);
    if (!panel) {
      return null;
    }
    var node = createStateCard(doc, route, context, panel, context.invalidFixture);
    doc.body.appendChild(node);
    return panel;
  }

  function applyBlockingContext(doc, context, panel) {
    if (!panel) {
      return;
    }
    if (panel.kind === "blocking" || context.invalidFixture) {
      doc.body.classList.add("codex-proto-blocked-context");
    }
    if (context.invalidFixture || context.state === "permission-denied") {
      doc.body.classList.add("codex-proto-denied-context");
    }
  }

  function applyQuestionHistoryModal(doc, route, context) {
    if (route.id !== "question.detail" || context.modal !== "history") {
      return;
    }
    var panel = DATA.historyPanel;
    var side = doc.createElement("aside");
    side.className = "codex-proto-side-panel";
    side.innerHTML =
      "<h2>" +
      escapeHtml(panel.title) +
      "</h2>" +
      panel.sections
        .map(function (section) {
          return (
            "<section><h3>" +
            escapeHtml(section.heading) +
            "</h3><ul>" +
            section.items
              .map(function (item) {
                return "<li>" + escapeHtml(item) + "</li>";
              })
              .join("") +
            "</ul></section>"
          );
        })
        .join("") +
      '<a class="codex-proto-close" href="' +
      STATE.buildHref(route.id, { fixture: context.fixture, state: context.state }, context) +
      '" target="_top">履歴パネルを閉じる</a>';
    doc.body.appendChild(side);
  }

  function applyFixtureRules(doc, route, context) {
    var navSelector = sidebarNavSelector();
    if (!STATE.isAdminFixture(context.fixture)) {
      hideByText(doc, navSelector, "管理者設定", { maxLength: 64 });
    }
    if (!STATE.isPrivilegedFixture(context.fixture)) {
      hideByIcon(doc, "rate_review");
    }
    if ((context.invalidFixture || context.state === "permission-denied") && (route.id === "admin.members" || route.id === "admin.tags" || route.id === "review.queue")) {
      disableAll(doc, "a, button, input, textarea, select");
    }
    if (route.id === "knowledge.detail" && (context.fixture !== "member" || context.state === "archived")) {
      hideByText(doc, "button, a", "編集する", { maxLength: 20 });
    }
    if (route.id === "workspace.join_request" && (context.state === "pending" || context.state === "cancelled")) {
      disableAll(doc, "textarea, input, select");
    }
    if (route.id === "knowledge.edit_draft_create" && context.state === "duplicate-blocked") {
      disableAll(doc, "textarea, input, select");
      disableAllByText(doc, "button, a", "ドラフトを作成", { maxLength: 24 });
    }
    if (route.id === "knowledge.edit_draft_detail" && (context.state === "applied" || context.state === "discarded")) {
      disableAllByText(doc, "button, a", "下書き保存", { maxLength: 18 });
      disableAllByText(doc, "button, a", "レビューを依頼", { maxLength: 24 });
      applyReadonlySelectors(doc, ".grid.grid-cols-12 > .col-span-8, .grid.grid-cols-12 > .col-span-4");
    }
    if (route.id === "question.edit" && context.state === "locked") {
      disableAllByText(doc, "button, a", "変更を保存", { maxLength: 24 });
      disableAllByText(doc, "button, a", "保存する", { maxLength: 16 });
      applyReadonlySelectors(doc, ".grid.grid-cols-12 > .col-span-12");
    }
  }

  function finalizeAnchors(doc, route, context) {
    queryAll(doc, "a").forEach(function (anchor) {
      if (anchor.classList.contains("codex-proto-disabled")) {
        return;
      }
      anchor.setAttribute("target", "_top");
      if (!anchor.getAttribute("href") || anchor.getAttribute("href") === "#") {
        anchor.setAttribute("href", STATE.buildHref(route.id, { fixture: context.fixture, state: context.state, tab: context.tab, modal: context.modal }, context));
      }
    });
  }

  function patchFrame(doc, route, context) {
    if (!doc) {
      throw new Error("Stitch frame document is unavailable");
    }
    var panel = resolvePanel(route, context);
    injectRuntimeStyle(doc);
    wireGlobalNavigation(doc, route, context);
    wireShellLinks(doc, route, context);
    wireFooterLinks(doc);
    wireRouteSpecific(doc, route, context);
    applyFixtureRules(doc, route, context);
    applyListTabs(doc, route, context);
    applyBlockingContext(doc, context, panel);
    applyStatePanel(doc, route, context);
    applyQuestionHistoryModal(doc, route, context);
    finalizeAnchors(doc, route, context);
  }

  function renderRoutePage(route) {
    var context = STATE.resolveContext(route, location.search);
    var rawHtml = embeddedRawHtml();
    document.title = route.title + " | Google Stitch Prototype";
    APP.innerHTML = '<div class="proto-viewer"><iframe id="proto-frame" title="' + escapeHtml(route.title) + '"></iframe></div>';
    var frame = document.getElementById("proto-frame");
    frame.addEventListener(
      "load",
      function () {
        patchFrame(frame.contentDocument, route, context);
      },
      { once: true }
    );
    if (rawHtml) {
      frame.srcdoc = rawHtml;
      return;
    }
    frame.src = route.rawPath;
  }

  function scenarioHref(scenario) {
    return STATE.buildHref(scenario.route, scenario.params || {}, scenario.params || {});
  }

  function routeExampleLinks(route) {
    var links = [];
    links.push(
      '<a class="proto-link" data-kind="primary" href="' +
        STATE.buildHref(route.id, { fixture: route.defaultFixture }, { fixture: route.defaultFixture }) +
        '">既定 route</a>'
    );
    route.states.slice(0, 3).forEach(function (stateName) {
      if (stateName !== route.defaultState) {
        links.push(
          '<a class="proto-link" data-kind="secondary" href="' +
            STATE.buildHref(route.id, { fixture: route.defaultFixture, state: stateName }, { fixture: route.defaultFixture }) +
            '">' +
            escapeHtml(stateName) +
            "</a>"
        );
      }
    });
    if (route.modals.indexOf("history") >= 0) {
      links.push(
        '<a class="proto-link" data-kind="secondary" href="' +
          STATE.buildHref(route.id, { fixture: route.defaultFixture, state: route.defaultState, modal: "history" }, { fixture: route.defaultFixture }) +
          '">history panel</a>'
      );
    }
    if (route.tabs.length) {
      links.push(
        '<a class="proto-link" data-kind="secondary" href="' +
          STATE.buildHref(route.id, { fixture: route.defaultFixture, tab: route.tabs[0] }, { fixture: route.defaultFixture }) +
          '">tab: ' +
          escapeHtml(route.tabs[0]) +
          "</a>"
      );
    }
    return links.join("");
  }

  function renderIndexPage() {
    var groups = groupBy(ROUTES, "group");
    var groupMarkup = Object.keys(groups)
      .map(function (groupName) {
        return (
          '<section class="proto-panel"><div class="proto-panel-head"><div><p class="proto-eyebrow">Routes</p><h2>' +
          escapeHtml(groupName) +
          '</h2><p>' +
          escapeHtml(groupName) +
          ' に属する Stitch route を screen-map に沿って整理しています。</p></div></div><div class="proto-grid">' +
          groups[groupName]
            .map(function (route) {
              return (
                '<article class="proto-card"><p class="proto-eyebrow">' +
                escapeHtml(route.slice) +
                " / " +
                escapeHtml(route.template) +
                "</p><h3>" +
                escapeHtml(route.title) +
                '</h3><p class="proto-meta">' +
                escapeHtml(route.id) +
                "<br />" +
                escapeHtml(route.screenLabel) +
                '</p><p>fixture: ' +
                escapeHtml(route.defaultFixture) +
                " / state: " +
                escapeHtml(route.defaultState) +
                '</p><div class="proto-actions">' +
                routeExampleLinks(route) +
                "</div></article>"
              );
            })
            .join("") +
          "</div></section>"
        );
      })
      .join("");

    var scenarioMarkup =
      '<section class="proto-panel"><div class="proto-panel-head"><div><p class="proto-eyebrow">Acceptance</p><h2>Scenario 1〜10</h2><p>screen-map の Flow Coverage と `受け入れ基準.md` を確認するための開始入口です。</p></div></div><div class="proto-grid">' +
      SCENARIOS.map(function (scenario) {
        return (
          '<a class="proto-card" href="' +
          scenarioHref(scenario) +
          '"><p class="proto-eyebrow">' +
          escapeHtml(scenario.id) +
          "</p><h3>" +
          escapeHtml(scenario.title) +
          '</h3><p>' +
          escapeHtml(scenario.description) +
          '</p><ul class="proto-list">' +
          scenario.path
            .map(function (routeId) {
              return "<li>" + escapeHtml(routeId) + "</li>";
            })
            .join("") +
          '</ul><div class="proto-actions"><span class="proto-link" data-kind="primary">Start scenario</span></div></a>'
        );
      }).join("") +
      "</div></section>";

    APP.innerHTML =
      '<main class="proto-index"><section class="proto-hero"><p class="proto-eyebrow">Google Stitch faithful prototype</p><h1>Raw export を相互リンクした static multi-page prototype</h1><p class="proto-copy">`docs/design/Google Stitch/*/code.html` を iframe でそのまま表示し、prototype 側で route wiring、query parameter state、permission-safe overlay を付与します。定常 UI に debug bar は置かず、`fixture` / `state` / `tab` / `modal` は URL から切り替えます。</p><div class="proto-badges"><span class="proto-badge" data-tone="info">20 screens</span><span class="proto-badge" data-tone="warning">No backend mutation</span><span class="proto-badge" data-tone="success">State overlays + history side panel</span></div></section>' +
      groupMarkup +
      scenarioMarkup +
      "</main>";
  }

  function renderMissingPage() {
    APP.innerHTML =
      '<div class="proto-empty"><div class="proto-empty-card"><p class="proto-eyebrow">Google Stitch Prototype</p><h2>route が見つかりません</h2><p>screen-map にない wrapper です。index から有効な route を開いてください。</p><div class="proto-actions"><a class="proto-link" data-kind="primary" href="' +
      indexHref() +
      '">index へ戻る</a></div></div></div>';
  }

  if (!APP) {
    return;
  }

  if (SCREEN_ID === "__index__") {
    renderIndexPage();
    return;
  }

  var route = routeById(SCREEN_ID);
  if (!route) {
    renderMissingPage();
    return;
  }

  renderRoutePage(route);
})();
