/**
 * @typedef {Object} Rate
 * @property {number} from
 * @property {number} to
 * @property {number} value
 */

/**
 * @typedef {Object} Stat
 * @property {number} total
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
 * @typedef {'DAY'|'WEEK'|'MONTH'|'YEAR'} TimeIndicator
 */