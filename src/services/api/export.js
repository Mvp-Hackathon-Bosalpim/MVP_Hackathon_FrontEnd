import client from "@/services/instance";

/**
 * @typedef {'JSON' | 'CSV'} ExportFormat
 *
 * @typedef {Object} ExportRequestDto
 * @property {ExportFormat} format
 * @property {string} file_name
 *
 * @typedef {Object} ExportHistoryResponseDto
 * @property {number} id
 * @property {string} fileName
 * @property {ExportFormat} format
 * @property {number} exportedCount
 * @property {string} exportedAt
 * @property {'COMPLETED' | 'FAILED'} status
 */

/**
 * @param {ExportRequestDto} body
 * @returns {Promise<ExportHistoryResponseDto>}
 */
export const exportDocuments = async (body) => {
  const response = await client.post("/api/v1/exports", body);
  return response.data.data;
};

/**
 * @param {number} exportHistoryId
 * @returns {Promise<string>}
 */
export const getExportDownloadUrl = async (exportHistoryId) => {
  const response = await client.get(
    `/api/v1/exports/${exportHistoryId}/download-url`,
  );
  return response.data.data.download_url;
};
