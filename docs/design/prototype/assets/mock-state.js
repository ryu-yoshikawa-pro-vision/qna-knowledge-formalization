(function () {
  const signedInRoles = ["owner", "admin", "reviewer", "member"];
  const preMembershipActors = [
    "unaffiliated authenticated user",
    "invitation target user",
    "join request applicant"
  ];

  function getRouteById(id) {
    return window.DESIGN_PROTO_ROUTES.routes.find(function (route) {
      return route.id === id;
    });
  }

  function getRouteBySlug(slug) {
    return window.DESIGN_PROTO_ROUTES.routes.find(function (route) {
      return route.slug === slug;
    });
  }

  function toQuery(params) {
    const search = new URLSearchParams();
    Object.keys(params).forEach(function (key) {
      const value = params[key];
      if (value !== undefined && value !== null && value !== "") {
        search.set(key, value);
      }
    });
    const query = search.toString();
    return query ? "?" + query : "";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function buildHref(target, overrides, currentContext) {
    const route = getRouteById(target) || getRouteBySlug(target);
    if (!route) {
      return "#missing-route";
    }

    const context = Object.assign({}, currentContext || {}, overrides || {});
    const params = {};

    if (route.defaultRole) {
      params.role = context.role || route.defaultRole;
    }
    if (route.defaultActor) {
      params.actor = context.actor || route.defaultActor;
    }
    if (context.preset) {
      params.preset = context.preset;
    }

    return route.slug + ".html" + toQuery(params);
  }

  function reviewBadgeVisible(role) {
    return ["owner", "admin", "reviewer"].includes(role);
  }

  function normalizeSelection(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  function filterVisible(items, context) {
    return (items || []).filter(function (item) {
      if (item.roles && !item.roles.includes(context.role)) {
        return false;
      }
      if (item.actors && !item.actors.includes(context.actor)) {
        return false;
      }
      return true;
    });
  }

  window.DESIGN_PROTO_STATE = {
    signedInRoles,
    preMembershipActors,
    unreadCount: 7,
    reviewQueueCount: 3,
    getRouteById,
    getRouteBySlug,
    buildHref,
    escapeHtml,
    reviewBadgeVisible,
    normalizeSelection,
    filterVisible
  };
})();
