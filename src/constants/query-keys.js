export const inboxKeys = {
  all: ["inbox"],
  documents: (params) => ["inbox", "documents", params],
  statusCounts: () => ["inbox", "status-counts"],
  search: (params) => ["inbox", "search", params],
  supplierNames: () => ["inbox", "supplier-names"],
  normalizedItemNames: () => ["inbox", "normalized-item-names"],
};
