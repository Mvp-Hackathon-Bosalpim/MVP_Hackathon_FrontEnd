import client from "@/services/instance";

/** @param {PageParams} [params] @returns {Promise<ApiResponse<PageResponseDto>} */

/** @returns {Promise<PageResponseDto<InboxItemDetailDto>} */
export const getDocuments = async (params) => {
  const response = await client.get("/api/v1/documents", { params });
  return response.data.data;
};

/** @returns {Promise<StatusCountResponseDto>} */
export const getDocumentStatusCounts = async () => {
  const response = await client.get("/api/v1/documents/status-counts");

  return response.data.data;
};
/**
 * @param {{ item_names?: string[], supplier_names?: string[], start_date?: string, end_date?: string }} body
 * @param {{ page?: number, size?: number }} params
 * @returns {Promise<PageResponseDto<InboxItemDetailDto>>}
 */
export const searchDocuments = async (body, params) => {
  const response = await client.post("/api/v1/documents/search", body, { params });
  return response.data.data;
};

/** @returns {Promise<string[]>} */
export const getSupplierNames = async () => {
  const response = await client.get("/api/v1/items/supplier-names");

  return response.data.data;
};

/** @returns {Promise<string[]>} */
export const getNormalizedItemNames = async () => {
  const response = await client.get("/api/v1/items/normalized-item-names");
  return response.data.data;
};

/**
 * @param {number} id
 * @param {{ memo?: string }} body
 * @returns {Promise<void>}
 */
export const approveDocument = async (id, body) => {
  const response = await client.post(`/api/v1/documents/${id}/approve`, body);
  return response.data;
};

/**
 * @param {number} id
 * @param {{ memo?: string }} body
 * @returns {Promise<void>}
 */
export const rejectDocument = async (id, body) => {
  const response = await client.post(`/api/v1/documents/${id}/reject`, body);
  return response.data;
};

/** @param {{ ids: number[], memo?: string }} body @returns {Promise<void>} */
export const bulkApprove = async (body) => {
  const response = await client.post("/api/v1/documents/bulk-approve", body);
  return response.data;
};

/** @param {{ ids: number[], memo?: string }} body @returns {Promise<void>} */
export const bulkReject = async (body) => {
  const response = await client.post("/api/v1/documents/bulk-reject", body);
  return response.data;
};

/** @param {{ ids: number[], memo?: string }} body @returns {Promise<void>} */
export const bulkReReview = async (body) => {
  const response = await client.post("/api/v1/documents/bulk-re-review", body);
  return response.data;
};
