/**
 * @typedef {Object} SearchParams
 * @property {string} [itemName]
 * @property {string} [supplierName]
 * @property {string} [startDate] - yyyy-MM-dd
 * @property {string} [endDate]   - yyyy-MM-dd
 * @property {number} [page=0]
 * @property {number} [size=20]
 */

/**
 * @typedef {Object} ItemListResponseDto
 * @property {number} id
 * @property {string} docId
 * @property {string} sourceType
 * @property {string} supplierName
 * @property {string} normalizedItemName
 * @property {string} rawItemName
 * @property {string} spec
 * @property {string} unit
 * @property {number} priceBefore
 * @property {number} priceAfter
 * @property {string} effectiveDate
 * @property {string} reviewStatus
 * @property {string[]} issueTypes
 */

/**
 * @typedef {Object} StatusCountResponseDto
 * @property {number} newCount
 * @property {number} needsReviewCount
 * @property {number} onHoldCount
 * @property {number} approvedCount
 * @property {number} rejectedCount
 */
