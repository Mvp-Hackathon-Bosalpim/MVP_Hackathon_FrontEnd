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
 * @template T
 * @typedef {Object} PageResponseDto
 * @property {T} content
 * @property {number} page
 * @property {number} size
 * @property {number} total_elements
 * @property {number} total_pages
 */

/**
 * @typedef {Object} PageParams
 * @property {number} [page=0]
 * @property {number} [size=20]
 */
