import client from "@/services/instance";

/**
 * @typedef {Object} OcrPreviewItemDto
 * @property {string} doc_id
 * @property {number} row_no
 * @property {string} supplier_name
 * @property {string} raw_item_name
 * @property {string} source_type
 * @property {string} spec
 * @property {string} unit
 * @property {number} price_before
 * @property {number} price_after
 * @property {string} effective_date - yyyy-MM-dd
 */

/**
 * @param {File} file
 * @returns {Promise<ApiResponse<OcrPreviewItemDto[]>>}
 */
export const previewOcr = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Content-Type은 axios/브라우저가 FormData를 보고 boundary까지 채워 자동 설정하도록 비워둠
  // (직접 지정하거나 undefined로 덮으면 boundary가 빠져 요청이 깨짐)
  return client
    .post("/api/v1/preview/ocr", formData, {
      headers: {
        accept: "*/*", "Content-Type": undefined,
      }
    })
    .then((res) => res.data);
};
