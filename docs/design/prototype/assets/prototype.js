(function () {
  const state = window.DESIGN_PROTO_STATE;
  const routes = window.DESIGN_PROTO_ROUTES.routes;
  const scenarios = window.DESIGN_PROTO_ROUTES.scenarios;
  const pages = window.DESIGN_PROTO_PAGES;
  const app = document.getElementById("app");
  const screenId = document.body.dataset.screen || "__index__";
  const page = pages[screenId];

  function navLinks(currentId, role) {
    const items = [
      { label: "Knowledge", route: "knowledge.list", count: "" },
      { label: "Questions", route: "question.list", count: "" },
      { label: "Bookmarks", route: "bookmark.list", count: "" },
      { label: "Notifications", route: "notification.list", count: String(state.unreadCount) }
    ];

    if (["owner", "admin"].includes(role)) {
      items.push({ label: "Admin", route: currentId === "admin.tags" ? "admin.tags" : "admin.members", count: "" });
    }

    return '<nav class="nav-list">' + items.map(function (item) {
      const href = state.buildHref(item.route, {}, { role: role });
      const active = currentId === item.route || (item.label === "Knowledge" && currentId.startsWith("knowledge.")) || (item.label === "Questions" && currentId.startsWith("question.")) || (item.label === "Admin" && currentId.startsWith("admin."));
      return '<a class="nav-link' + (active ? " is-active" : "") + '" href="' + href + '"><span>' + item.label + '</span>' + (item.count ? '<span class="nav-count">' + item.count + "</span>" : "") + "</a>";
    }).join("") + "</nav>";
  }

  function renderActions(items, context) {
    return state.filterVisible(items, context).map(function (item) {
      const href = state.buildHref(item.route, item.params || {}, context);
      return '<a class="button-link ' + item.kind + '" href="' + href + '">' + item.label + "</a>";
    }).join("");
  }

  function renderNotices(items) {
    return (items || []).map(function (item) {
      return '<div class="notice ' + item.tone + '"><p class="notice-title">' + item.title + "</p><p>" + item.body + "</p></div>";
    }).join("");
  }

  function renderPermissionDeniedBody(route, context, allowedValues, deniedType) {
    const requestedValue = deniedType === "role" ? context.role : context.actor;
    const summary = deniedType === "role"
      ? "この screen は指定 role では開けません。prototype でも権限不足をそのまま表示します。"
      : "この screen は指定 actor では開けません。prototype でも actor 制約をそのまま表示します。";
    const detailLabel = deniedType === "role" ? "Allowed roles" : "Allowed actors";

    return {
      heroSummary: summary,
      stateBadges: [
        '<span class="status status-danger">Permission denied</span>',
        '<span class="status status-muted">' + deniedType + " = " + requestedValue + "</span>"
      ],
      bodyMarkup:
        renderNotices([
          {
            tone: "danger",
            title: "Permission denied",
            body: "unsupported " + deniedType + " を最初の許可値へフォールバックせず、そのまま denied state として扱います。"
          }
        ]) +
        '<section class="section">' +
          '<div class="section-head"><div><div class="section-kicker">Access</div><h2 class="section-title">Permission denied</h2></div></div>' +
          '<p class="section-copy">requested ' + deniedType + ' は `' + requestedValue + '` です。この screen の許可値は次だけです。</p>' +
          '<div class="permission-block"><strong>Access restricted</strong><p>' + detailLabel + ": " + allowedValues.join(", ") + '.</p></div>' +
          '<div class="action-row">' +
            (deniedType === "role"
              ? '<a class="button-link secondary" href="' + state.buildHref("knowledge.list", { role: context.role || "member" }, context) + '">Knowledge list に戻る</a>'
              : '<a class="button-link secondary" href="' + state.buildHref("auth.login", {}, context) + '">ログイン入口へ戻る</a>') +
          "</div>" +
        '</section>' +
        '<p class="app-footer">Acceptance coverage: ' + route.acceptance.join(", ") + "</p>"
    };
  }

  function renderToggleGroup(label, options, currentValue, key, context, pageDef) {
    return '<div><div class="meta-label">' + label + '</div><div class="toggle-group">' + options.map(function (option) {
      const next = Object.assign({}, context);
      next[key] = option;
      if (key !== "preset" && !pageDef.presets[next.preset]) {
        next.preset = Object.keys(pageDef.presets)[0];
      }
      const href = location.pathname.split("/").pop() + "?" + new URLSearchParams({
        role: next.role || "",
        actor: next.actor || "",
        preset: next.preset || ""
      }).toString();
      return '<a class="toggle-link' + (option === currentValue ? " is-active" : "") + '" href="' + href + '">' + option + "</a>";
    }).join("") + "</div></div>";
  }

  function renderAside(route, pageDef, context) {
    return '<aside class="aside-stack">' +
      '<div class="surface-panel"><div class="meta-label">Manifest</div><h3 class="card-title">' + route.id + '</h3><p class="card-meta">Route: ' + route.slug + '.html</p><p class="card-meta">Template: ' + route.template + ' / ' + route.slice + '</p><p class="card-meta">Acceptance: ' + route.acceptance.join(", ") + '</p></div>' +
      '<div class="surface-panel"><div class="meta-label">References</div><div class="section-stack">' +
      '<div><strong>Spec</strong>' + '<ul class="bullet-list">' + pageDef.specRefs.map(function (item) { return "<li>" + item + "</li>"; }).join("") + "</ul></div>" +
      '<div><strong>Design</strong>' + '<ul class="bullet-list">' + pageDef.designRefs.map(function (item) { return "<li>" + item + "</li>"; }).join("") + "</ul></div>" +
      '</div></div>' +
      '<div class="surface-panel"><div class="meta-label">Fixture</div><p class="card-meta">' + (context.role ? "role = " + context.role : "actor = " + context.actor) + "</p><p class=\"card-meta\">preset = " + context.preset + '</p></div>' +
      '<div class="surface-panel"><div class="meta-label">Static demo note</div><p class="card-meta">Mutation は実行せず、擬似遷移で state / side effect を説明する。</p></div>' +
      "</aside>";
  }

  function renderPage(pageDef) {
    const params = new URLSearchParams(location.search);
    const presetKeys = Object.keys(pageDef.presets);
    const requestedRole = params.get("role");
    const requestedActor = params.get("actor");
    const context = {
      role: pageDef.supportRoles ? (requestedRole || pageDef.supportRoles[0]) : "",
      actor: pageDef.supportActors ? (requestedActor || pageDef.supportActors[0]) : "",
      preset: state.normalizeSelection(params.get("preset"), presetKeys, presetKeys[0])
    };
    const preset = pageDef.presets[context.preset];
    const route = state.getRouteById(screenId);
    const hasRoleDenied = Boolean(pageDef.supportRoles && requestedRole && !pageDef.supportRoles.includes(requestedRole));
    const hasActorDenied = Boolean(pageDef.supportActors && requestedActor && !pageDef.supportActors.includes(requestedActor));
    document.title = pageDef.title + " | Design Prototype";

    const fixtureGroups = [];
    if (pageDef.supportRoles) {
      fixtureGroups.push(renderToggleGroup("Role", pageDef.supportRoles, context.role, "role", context, pageDef));
    }
    if (pageDef.supportActors) {
      fixtureGroups.push(renderToggleGroup("Actor", pageDef.supportActors, context.actor, "actor", context, pageDef));
    }
    fixtureGroups.push(renderToggleGroup("Preset", presetKeys, context.preset, "preset", context, pageDef));

    const deniedState = hasRoleDenied
      ? renderPermissionDeniedBody(route, context, pageDef.supportRoles, "role")
      : hasActorDenied
        ? renderPermissionDeniedBody(route, context, pageDef.supportActors, "actor")
        : null;

    const hero = '<section class="' + (pageDef.signedIn === false ? "gateway-hero" : "page-hero") + '">' +
      '<div class="hero-heading"><div class="hero-kicker">' + route.slice + " / " + route.template + '</div><h1 class="hero-title">' + pageDef.title + '</h1><p class="hero-summary">' + (deniedState ? deniedState.heroSummary : preset.summary) + "</p></div>" +
      '<div class="chip-row">' + (deniedState ? deniedState.stateBadges : preset.stateBadges).join("") + "</div>" +
      '<div class="fixtures">' + fixtureGroups.join("") + "</div>" +
      '<div class="action-row">' + (deniedState ? "" : renderActions(preset.actions, context)) + "</div>" +
      "</section>";

    const bodyMarkup = deniedState
      ? deniedState.bodyMarkup
      : renderNotices(preset.notices) + preset.body + '<p class="app-footer">Acceptance coverage: ' + pageDef.coverage.join(", ") + "</p>";

    if (pageDef.signedIn === false) {
      app.innerHTML = '<div class="gateway-wrap"><div class="gateway">' + hero + bodyMarkup + renderAside(route, pageDef, context) + "</div></div>";
      return;
    }

    app.innerHTML = '<div class="prototype-shell">' +
      '<aside class="sidebar">' +
      '<div class="brand-block"><div class="brand-title">Knowledge Infrastructure</div><p class="brand-caption">knowledge-first / state-driven / role-aware</p></div>' +
      '<div class="workspace-panel"><strong>Knowledge Operations Japan</strong><span class="brand-caption">workspace.current</span></div>' +
      navLinks(screenId, context.role) +
      "</aside>" +
      '<div class="content">' +
      '<header class="topbar"><div class="topbar-group"><span class="search-chip">Global search entry</span><span class="count-pill">Notifications ' + state.unreadCount + '</span>' + (state.reviewBadgeVisible(context.role) ? '<span class="count-pill">Review Queue ' + state.reviewQueueCount + "</span>" : "") + '</div><div class="topbar-group"><span class="user-pill">' + context.role + '</span><span class="user-pill">workspace.current</span></div></header>' +
      '<main class="page-wrap">' + hero + '<div class="page-grid"><div class="main-stack">' + bodyMarkup + '</div>' + renderAside(route, pageDef, context) + "</div></main>" +
      "</div></div>";
  }

  function renderIndex() {
    document.title = "Design Prototype Index";
    const grouped = {};
    routes.forEach(function (route) {
      if (!grouped[route.group]) {
        grouped[route.group] = [];
      }
      grouped[route.group].push(route);
    });

    const routeGroups = Object.keys(grouped).map(function (group) {
      return '<section class="section"><div class="section-head"><div><div class="section-kicker">Routes</div><h2 class="section-title">' + group + '</h2></div></div><p class="section-copy">screen-map に対応する route 一覧。</p><div class="route-grid">' + grouped[group].map(function (route) {
        const href = state.buildHref(route.id, { preset: route.id === "workspace.resolution" ? "create-path" : route.id === "question.detail" ? "open" : route.id === "knowledge.detail" ? "formal" : undefined }, { role: route.defaultRole, actor: route.defaultActor });
        return '<article class="route-card"><div class="meta-label">' + route.slice + '</div><h3>' + route.title + '</h3><p class="card-meta">' + route.id + " / " + route.template + '</p><p class="card-meta">Acceptance: ' + route.acceptance.join(", ") + '</p><a class="button-link secondary" href="' + href + '">Open route</a></article>';
      }).join("") + "</div></section>";
    }).join("");

    const scenarioMarkup = '<section class="section"><div class="section-head"><div><div class="section-kicker">Acceptance</div><h2 class="section-title">Scenario 1〜10</h2></div></div><p class="section-copy">acceptance route の確認入口。</p><div class="route-grid">' + scenarios.map(function (scenario) {
      const start = state.getRouteById(scenario.start);
      const href = state.buildHref(start.id, {
        preset: start.id === "knowledge.create" ? "request-review" : start.id === "workspace.join_request" ? "pending" : start.id === "question.detail" ? "history" : start.id === "admin.members" ? "invitations" : start.id === "admin.tags" ? "merge" : start.id === "knowledge.detail" ? "formal" : undefined
      }, { role: start.defaultRole, actor: start.defaultActor });
      return '<article class="route-card"><div class="meta-label">' + scenario.id + '</div><h3>' + scenario.title + '</h3><p class="card-meta">Path: ' + scenario.path.join(" -> ") + '</p><a class="button-link primary" href="' + href + '">Start scenario</a></article>';
    }).join("") + "</div></section>";

    app.innerHTML = '<div class="gateway-wrap"><div class="gateway">' +
      '<section class="gateway-hero"><div class="hero-heading"><div class="hero-kicker">docs/design/prototype</div><h1 class="hero-title">Design Prototype Index</h1><p class="hero-summary">20 画面の static demo。screen ID を主キーにし、Scenario 1〜10 と role / actor / state を query parameter で辿る。</p></div><div class="chip-row"><span class="status status-formal">20 screens</span><span class="status status-info">Scenario 1-10</span><span class="status status-success">No backend runtime</span></div></section>' +
      routeGroups +
      scenarioMarkup +
      '<section class="section"><div class="section-head"><div><div class="section-kicker">Checklist</div><h2 class="section-title">Validation checklist</h2></div></div><p class="section-copy">prototype review 前にここだけは見る。</p><div class="two-up">' +
        '<article class="card"><h3 class="card-title">Header and badge</h3><p class="card-copy">workspace 名、通知未読、review queue badge の role 差分を確認する。</p><p class="card-meta">review queue badge: owner/admin/reviewer only</p></article>' +
        '<article class="card"><h3 class="card-title">Question history</h3><p class="card-copy">`question.detail` の中で history panel を開く。</p><p class="card-meta">no separate route</p></article>' +
        '<article class="card"><h3 class="card-title">Admin subsections</h3><p class="card-copy">`admin.members` は Members / Invitations / Join Requests の 3 view を持つ。</p><p class="card-meta">table-first</p></article>' +
        '<article class="card"><h3 class="card-title">Placeholders</h3><p class="card-copy">`href="#"` を prototype 配下に残さない。</p><p class="card-meta">linkage validation</p></article>' +
      '</div></section>' +
      "</div></div>";
  }

  if (!page || !app) {
    document.body.innerHTML = "<p>Prototype page not found.</p>";
    return;
  }

  if (screenId === "__index__") {
    renderIndex();
  } else {
    renderPage(page);
  }
})();
