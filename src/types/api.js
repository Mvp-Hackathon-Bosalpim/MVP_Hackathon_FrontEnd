/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {'SUCESS' | "FAIL"} status
 * @property {number} code
 * @property {string} message
 * @property {T} data
 *
 */

/**
 * @typedef {Object} PageResponseDto
 * @property {ItemListResponseDto[]} content
 * @property {number} page
 * @property {number} size
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {Object} PageParams
 * @property {number} [page=0]
 * @property {number} [size=20]
 */
