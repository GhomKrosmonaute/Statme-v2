/**
 * @typedef {Object} Rate
 * @property {number} from
 * @property {number} to
 * @property {number} value
 */

/**
 * @typedef {Object} Stat
 * @property {number} max
 * @property {number} min
 * @property {number} total
 * @property {number} average
 * @property {TimeIndicator} per
 * @property {Rate[]} rates
 */

/**
 * @typedef {Object} Where
 * @property {'<'|'>'|'<='|'>='} [operator]
 * @property {string} column
 * @property {*} value
 */

/**
 * @typedef {Object} WhereBetween
 * @property {string} column
 * @property {*[]} values
 */

/**
 * @typedef {'DAY'|'WEEK'|'MONTH'|'YEAR'} TimeIndicator
 */