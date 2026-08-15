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

  return client
    .post("/api/v1/preview/ocr", formData, {
      headers: {
        accept: "*/*", "Content-Type": undefined,
      }
    })
    .then((res) => res.data);
};

/**
 * @param {string} filename
 * @param {OcrPreviewItemDto[]} ocrItems
 * @returns {Promise<ApiResponse<UploadResultDto>>}
 */
export const confirmOcr = (filename, ocrItems) =>
  client
    .post("/api/v1/confirm/ocr", ocrItems, {
      params: { filename },
    })
    .then((res) => res.data);
