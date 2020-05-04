
const DAY = 1000 * 60 * 60 * 24

/**
 * @type {Object.<TimeIndicator,number>}
 */
module.exports.TIME = {
  DAY,
  WEEK: DAY * 7,
  MONTH: DAY * 31,
  YEAR: DAY * 365
}