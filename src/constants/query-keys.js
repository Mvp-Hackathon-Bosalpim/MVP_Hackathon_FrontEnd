export const inboxKeys = {
  all: ["inbox"],
  documents: (params) => ["inbox", "documents", params],
  document: (id) => ["inbox", "document", id],
  statusCounts: () => ["inbox", "status-counts"],
  search: (params) => ["inbox", "search", params],
  supplierNames: () => ["inbox", "supplier-names"],
  normalizedItemNames: () => ["inbox", "normalized-item-names"],
  deletedItems: () => ["inbox", "deleted-items"],
  duplicateGroup: (groupId, params) => ["inbox", "duplicate-group", groupId, params],
};

export const dashboardKeys = {
  all: ["dashboard"],
  summary: () => ["dashboard", "summary"],
  issueStats: () => ["dashboard", "issue-stats"],
};

export const exportKeys = {
  all: ["exports"],
  list: (params) => ["exports", "list", params],
};
