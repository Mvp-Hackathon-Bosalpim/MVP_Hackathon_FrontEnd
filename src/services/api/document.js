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

  return client
    .post("/api/v1/document", formData, {
      headers: {
        accept: "*/*", "Content-Type": undefined,
      }
    })
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
