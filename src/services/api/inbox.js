import client from "@/services/instance";

/**
 * @param {PageParams} [params]
 * @returns {Promise<PageResponseDto<InboxItemDetailDto>>}
 */
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
 * @param {{ item_names?: string[], supplier_names?: string[], start_date?: string, end_date?: string, review_status?: 'NEW'|'NEEDS_REVIEW'|'ON_HOLD'|'APPROVED'|'REJECTED' }} body
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

/**
 * @typedef {Object} SourceRef
 * @property {string} input_method
 * @property {string} file_name
 * @property {number} row_no
 */

/**
 * @typedef {Object} ChangeLogDto
 * @property {string} at
 * @property {string} field
 * @property {string} from
 * @property {string} to
 * @property {string} action
 * @property {string} [memo]
 */

/**
 * @typedef {Object} ItemDetailResponseDto
 * @property {string} doc_id
 * @property {string} source_type
 * @property {string} supplier_name
 * @property {string} raw_item_name
 * @property {string} normalized_item_name
 * @property {string} spec
 * @property {string} unit
 * @property {number} price_before
 * @property {number} price_after
 * @property {string} effective_date
 * @property {'NEW'|'NEEDS_REVIEW'|'ON_HOLD'|'APPROVED'|'REJECTED'} review_status
 * @property {number} duplicate_group
 * @property {string[]} exception_flags
 * @property {SourceRef} source_ref
 * @property {ChangeLogDto[]} change_log
 * @property {number} previous_doc_id
 * @property {number} next_doc_id
 * @property {number} current_index
 * @property {number} total
 */

/**
 * @param {number} id
 * @returns {Promise<ItemDetailResponseDto>}
 */
export const getDocument = async (id) => {
  const response = await client.get(`/api/v1/documents/${id}`);
  return response.data.data;
};

/**
 * @typedef {Object} ItemUpdateRequestDto
 * @property {string} [normalized_item_name]
 * @property {string} [supplier_name]
 * @property {string} [spec]
 * @property {string} [unit]
 * @property {number} [price_before]
 * @property {number} [price_after]
 * @property {string} [effective_date]
 */

/**
 * @param {number} id
 * @param {ItemUpdateRequestDto} body
 * @returns {Promise<void>}
 */
export const updateDocument = async (id, body) => {
  const response = await client.patch(`/api/v1/documents/${id}`, body);
  return response.data;
};

/**
 * @param {number} id
 * @param {{ memo?: string }} [body]
 * @returns {Promise<void>}
 */
export const deleteDocument = async (id, body) => {
  const response = await client.delete(`/api/v1/documents/${id}`, { data: body });
  return response.data;
};

/** @param {{ ids: number[], memo?: string }} body @returns {Promise<void>} */
export const bulkDeleteDocuments = async (body) => {
  const response = await client.delete("/api/v1/documents", { data: body });
  return response.data;
};

/**
 * @typedef {Object} DeletedItemResponseDto
 * @property {number} id
 * @property {string} doc_id
 * @property {'PDF'|'XLSX'|'IMAGE'|'MANUAL'|'CSV'|'UNKNOWN'} source_type
 * @property {string} supplier_name
 * @property {string} normalized_item_name
 * @property {string} spec
 * @property {number} price_before
 * @property {number} price_after
 * @property {string} effective_date
 * @property {string} [memo]
 */

/** @returns {Promise<DeletedItemResponseDto[]>} */
export const getDeletedItems = async () => {
  const response = await client.get("/api/v1/items/deleted");
  return response.data.data;
};

/**
 * @param {number} id - 중복 그룹 ID
 * @param {{ page?: number, size?: number }} [params]
 * @returns {Promise<PageResponseDto<InboxItemDetailDto>>}
 */
export const getDuplicateItems = async (id, params) => {
  const response = await client.get(`/api/v1/documents/duplicate/${id}`, { params });
  return response.data.data;
};
