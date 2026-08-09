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
 * @property {number} new_count
 * @property {number} needs_review_count
 * @property {number} on_hold_count
 * @property {number} approved_count
 * @property {number} rejected_count
 */

/**
 * @typedef {Object} InboxItemDetailDto
 * @property {string} doc_id
 * @property {string} effactive_date
 * @property {number} id
 * @property {string[]} issue_types
 * @property {string} normaliszed_item_name
 * @property {number} price_after
 * @property {number} price_before
 * @property {string} raw_item_name
 * @property {string} review_status
 * @property {string} source_type
 * @property {string} spec
 * @property {string} spupplier_name
 * @property {string} unit
 *
 */
