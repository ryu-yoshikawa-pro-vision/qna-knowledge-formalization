(function () {
  function getRoutes() {
    return (window.DESIGN_PROTO_ROUTES && window.DESIGN_PROTO_ROUTES.routes) || [];
  }

  function getRouteById(routeId) {
    return getRoutes().find(function (route) {
      return route.id === routeId;
    });
  }

  function getRouteBySlug(slug) {
    return getRoutes().find(function (route) {
      return route.slug === slug;
    });
  }

  function normalizeText(value) {
    return (value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function includesToken(list, value) {
    return Array.isArray(list) && list.indexOf(value) >= 0;
  }

  function pickToken(list, requested, fallback) {
    if (requested && includesToken(list, requested)) {
      return requested;
    }
    return fallback || (Array.isArray(list) && list.length ? list[0] : "");
  }

  function fixtureLabel(fixture) {
    var labels = {
      owner: "owner",
      admin: "admin",
      reviewer: "reviewer",
      member: "member",
      "unaffiliated-user": "unaffiliated authenticated user",
      "invitation-target-user": "invitation target user",
      "join-request-applicant": "join request applicant",
    };
    return labels[fixture] || fixture;
  }

  function isPrivilegedFixture(fixture) {
    return ["owner", "admin", "reviewer"].indexOf(fixture) >= 0;
  }

  function isAdminFixture(fixture) {
    return ["owner", "admin"].indexOf(fixture) >= 0;
  }

  function prototypeBaseUrl() {
    var href = (window.top && window.top.location && window.top.location.href) || window.location.href || "";
    try {
      return new URL("./", href);
    } catch (error) {
      return new URL("./", window.location.href);
    }
  }

  function routeUrl(filename) {
    return new URL(filename, prototypeBaseUrl());
  }

  function indexHref() {
    return routeUrl("index.html").toString();
  }

  function resolveContext(route, search) {
    var params = search instanceof URLSearchParams ? search : new URLSearchParams(search || location.search);
    var requestedFixture = normalizeText(params.get("fixture"));
    var requestedState = normalizeText(params.get("state"));
    var requestedTab = normalizeText(params.get("tab"));
    var requestedModal = normalizeText(params.get("modal"));
    var invalidFixture = Boolean(requestedFixture) && !includesToken(route.fixtures, requestedFixture);
    var resolvedFixture = pickToken(route.fixtures, requestedFixture, route.defaultFixture);

    return {
      fixture: invalidFixture ? requestedFixture : resolvedFixture,
      requestedFixture: requestedFixture,
      invalidFixture: invalidFixture,
      state: pickToken(route.states, requestedState, route.defaultState),
      tab: pickToken(route.tabs, requestedTab, route.defaultTab),
      modal: pickToken(route.modals, requestedModal, ""),
    };
  }

  function buildHref(routeId, overrides, current) {
    var route = getRouteById(routeId);
    var options = overrides || {};
    var ctx = current || {};
    if (!route) {
      return "./index.html";
    }

    var params = new URLSearchParams();
    var fixture = options.fixture;
    if (!fixture) {
      fixture = includesToken(route.fixtures, ctx.fixture) ? ctx.fixture : route.defaultFixture;
    }
    if (fixture) {
      params.set("fixture", fixture);
    }

    var state = options.hasOwnProperty("state") ? options.state : "";
    if (!state && route.defaultState) {
      state = route.defaultState;
    }
    if (state && includesToken(route.states, state) && state !== route.defaultState) {
      params.set("state", state);
    }

    var tab = options.hasOwnProperty("tab") ? options.tab : "";
    if (!tab && route.defaultTab) {
      tab = route.defaultTab;
    }
    if (tab && includesToken(route.tabs, tab) && tab !== route.defaultTab) {
      params.set("tab", tab);
    }

    var modal = options.hasOwnProperty("modal") ? options.modal : "";
    if (modal && includesToken(route.modals, modal)) {
      params.set("modal", modal);
    }

    var target = routeUrl(route.slug + ".html");
    target.search = params.toString();
    return target.toString();
  }

  window.DESIGN_PROTO_STATE = {
    getRouteById: getRouteById,
    getRouteBySlug: getRouteBySlug,
    resolveContext: resolveContext,
    buildHref: buildHref,
    normalizeText: normalizeText,
    fixtureLabel: fixtureLabel,
    isPrivilegedFixture: isPrivilegedFixture,
    isAdminFixture: isAdminFixture,
    indexHref: indexHref,
  };
})();
