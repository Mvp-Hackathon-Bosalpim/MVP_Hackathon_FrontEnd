import client from "@/services/instance";

/** @param {PageParams} [params] @returns {Promise<ApiResponse<<PageResponseDto>>} */
export const getDocuments = (params) =>
  client.get("/api/v1/documents", { params }).then((res) => res.data);

/** @returns {Promise<ApiResponse<StatusCountResponseDto>} */
export const getDocumentStatusCounts = () =>
  client.get("/api/v1/documents/status-counts").then((res) => res.data);

/** @param {SearchParams} [params] @returns {Promise<ApiResponse<PageResponseDto>} */
export const searchDocuments = (params) =>
  client.get("/api/v1/documents/search", { params }).then((res) => res.data);

/** @returns {Promise<ApiResponse<string[]>} */
export const getSupplierNames = () =>
  client.get("/api/v1/items/supplier-names").then((res) => res.data);

/** @returns {Promise<ApiResponse<string[]>} */
export const getNormalizedItemNames = () =>
  client.get("/api/v1/items/normalized-item-names").then((res) => res.data);

/** @param {number} id @returns {Promise<void>} */
export const approveDocument = (id) =>
  client.post(`/api/v1/documents/${id}/approve`).then((res) => res.data);

/**
 * @param {number} id
 * @param {{ memo?: string }} body
 * @returns {Promise<void>}
 */

export const rejectDocument = (id, body) =>
  client.post(`/api/v1/documents/${id}/reject`, body).then((res) => res.data);

/** @param {{ ids: number[] }} body @returns {Promise<void>} */
export const bulkApprove = (body) =>
  client.post("/api/v1/documents/bulk-approve", body).then((res) => res.data);

/** @param {{ ids: number[] }} body @returns {Promise<void>} */
export const bulkReject = (body) =>
  client.post("/api/v1/documents/bulk-reject", body).then((res) => res.data);

/** @param {{ ids: number[] }} body @returns {Promise<void>} */
export const bulkReReview = (body) =>
  client.post("/api/v1/documents/bulk-re-review", body).then((res) => res.data);
