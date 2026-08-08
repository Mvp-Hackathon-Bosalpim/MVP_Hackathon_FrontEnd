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
