import client from "@/services/instance";

/**
 * @typedef {Object} UploadResultDto
 * @property {number} total
 * @property {number} normal
 * @property {number} need_checked
 */

/**
 * @param {File} file
 * @returns {Promise<ApiResponse<UploadResultDto>>}
 */
export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Content-Type은 axios/브라우저가 FormData를 보고 boundary까지 채워 자동 설정하도록 비워둠
  // (직접 지정하거나 undefined로 덮으면 boundary가 빠져 요청이 깨짐)
  return client
    .post("/api/v1/document", formData, { headers: { accept: "*/*" } })
    .then((res) => res.data);
};

/**
 * @typedef {Object} ManualDocumentItem
 * @property {string} spec
 * @property {string} unit
 * @property {string} supplier_name
 * @property {string} raw_item_name
 * @property {number} price_before
 * @property {number} price_after
 * @property {string} effective_date - yyyy-MM-dd
 */

/**
 * @param {ManualDocumentItem[]} items
 * @returns {Promise<ApiResponse<UploadResultDto>>}
 */
export const createManualDocument = (items) =>
  client.post("/api/v1/manual-document", { items }).then((res) => res.data);
