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

/**
 * @typedef {Object} OcrConfirmItemDto
 * @property {string} doc_id
 * @property {string} source_type
 * @property {number} row_no
 * @property {string} supplier_name
 * @property {string} raw_item_name
 * @property {string} normalized_item_name
 * @property {string} spec
 * @property {string} unit
 * @property {number} price_before
 * @property {number} price_after
 * @property {string} effective_date
 * @property {string} duplicate_group_key
 * @property {boolean} has_parse_error
 */

/** @param {OcrPreviewItemDto} item */
const toOcrConfirmItem = (item) => ({
  doc_id: item.doc_id,
  source_type: item.source_type,
  row_no: item.row_no,
  supplier_name: item.supplier_name,
  raw_item_name: item.raw_item_name,
  // normalized_item_name: preview API 응답엔 없는 필드. raw_item_name과 동일하게 임시 채움 (백엔드 확인 필요)
  normalized_item_name: item.raw_item_name,
  spec: item.spec,
  unit: item.unit,
  price_before: item.price_before,
  price_after: item.price_after,
  effective_date: item.effective_date,
  // duplicate_group_key: preview API 응답엔 없는 필드. 빈 문자열로 임시 채움 (백엔드 확인 필요)
  duplicate_group_key: "",
  // has_parse_error: preview API 응답엔 없는 필드. false로 임시 채움 (백엔드 확인 필요)
  has_parse_error: false,
});

/**
 * @param {string} filename
 * @param {OcrPreviewItemDto[]} ocrItems
 * @returns {Promise<ApiResponse<UploadResultDto>>}
 */
export const confirmOcr = (filename, ocrItems) =>
  client
    .post("/api/v1/confirm/ocr", ocrItems.map(toOcrConfirmItem), {
      params: { filename },
    })
    .then((res) => res.data);
